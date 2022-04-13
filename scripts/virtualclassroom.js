// List of lessons divided by section.
let lessonList = [];

$(async function() {
    var videos;

    while(true) {
        videos = document.querySelectorAll('[id^="videoPlayer_"]');
        if(videos.length > 0) {
            break;
        } else {
            await sleep(100);
        }
    }

    for(let index = 0; index < videos.length; ++index) {
        newPlayer(videos[index]);
    }

    displayHotkeysLabels();

    // Mark this as a virtual classroom page.
    let HTMLbody = $("body");
    HTMLbody.addClass("virtual-classroom");

    //TODO Modal ancora utile?
    let modal = `
	<div id="modal-container">
		<div class="modal-background">
			<div class="modal">
				<img style="width: 60px; height: 60px;" src="` + extensionBase + `immagini/triangolo.png" alt="triangolo">
				<br><br><br>
				<p>Questa virtual classroom è in fase di conversione e non può essere scaricata.</p>
				<svg class="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
					<rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
				</svg>
			</div>
		</div>
    </div>`;

    HTMLbody.append(modal);

    $('#modal-container').on("click", function() {
        $(this).addClass('out');
        $('body').removeClass('modal-active');
    });

    // Get ALL the VCs lists across the various panels.
    // (This year, Past year, Other courses...)
    sections = document.querySelectorAll('[id^="lessonList_"]');

    for (let index = 0; index < sections.length; ++index) {
        // For each panel create a JDownloader button.
        let jDownloader       = document.createElement("button");
        jDownloader.className = "btn btn-primary download-all";
        jDownloader.innerHTML = "Export JDownloader List";

        // For each panel create a Download All button.
        let downloadAll       = document.createElement("button");
        downloadAll.className = "btn btn-primary download-all";
        downloadAll.innerHTML = "Download ALL";

        downloadAll.addEventListener("click", function() {
            if (confirm("Sei sicuro di voler scaricare tutte (" + lessonList[index].length + ") le virtual classroom già convertite?\nL'operazione può richiedere tempo e non può essere annullata.")) {
                for (let i = 0; i < lessonList[index].length; ++i) {
                    downloadLesson(index, i);
                }
            }
        }, false);

        jDownloader.addEventListener("click", function() {
            copyToClipboard(lessons[index].map(lesson => lesson.url).join("\n"));
            alert("Link copiati negli appunti! ATTENZIONE! Le lezioni non convertite non verranno aggiunte alla lista\r\nLinks copied to clipboard! Not converted lessons will not be added to the list");
        }, false);

        sections[index].insertBefore(downloadAll, sections[index].firstChild);
        sections[index].insertBefore(jDownloader, sections[index].firstChild);
        lessonList[index] = [];

        let lessons = sections[index].getElementsByClassName("h5");
        for(let i = 0; i < lessons.length; ++i) {
            // Obtain VC data to later perform the download
            let link        = lessons[i].getElementsByTagName("a")[0];
            let bbbid       = link.getAttribute("data-bbb-id");
            let incarico    = link.getAttribute("data-id_inc");
            let provvisorio = link.getAttribute("data-id_inc-prov");
            
            // Save this to a global storage
            lessonList[index].push({
                bbbid,
                incarico,
                provvisorio,
            });

            // Create the download button
            let lessonDownload = document.createElement("button");
            lessonDownload.className = "btn btn-primary dwlbtn";
            lessonDownload.id = "directdwn_" + index + "_" + i;
            lessonDownload.innerHTML = '<span class="fa fa-download"></span> Download';

            lessonDownload.addEventListener("click", function() {
                downloadLesson(index, i);
            }, false);

            lessons[i].insertBefore(lessonDownload, lessons[i].firstChild);
        }
    }

});

function sleep(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

// Check if the video has already been converted (not a WIP BBB recording).
function isConverted(doc) {
    return doc.querySelectorAll('[id^="videoPlayer_"]');
}

function downloadFile(url, filename) {
    chrome.runtime.sendMessage({
        msg: "PLS_DOWNLOAD",
        data: {
            subject: "URL",
            content: url,
            filename: filename
        }
    });
}

function copyToClipboard(content) {
    navigator.clipboard.writeText(content);
}

function downloadLesson(list, index) {
    $.ajax({
        data: {
            "p_bbbid"      : lessonList[list][index].bbbid,
            "p_id_inc"     : lessonList[list][index].incarico,
            "p_id_inc_prov": lessonList[list][index].provvisorio
        },
        type: "POST",
        url: "https://didattica.polito.it/pls/portal30/sviluppo.virtual_classroom_dev.getVCTpl",
        index: list,
        success: function(response) {
            const parser  = new DOMParser();
            const content = parser.parseFromString(response, "text/html");
            const url     = content.querySelector('[id^="videoPlayer_"]').children[0].getAttribute("src");
            const title   = content.getElementsByTagName("h3")[0].innerHTML;

            downloadFile(url, title);
        },
        error: function(xhr, status, error) {
            alert("Error downloading media.");
        }
    });
}

function newPlayer(video) {
    let source  = (video.src == null || video.src == "") ? video.children[0].src : video.src;
    let videoId = video.id;

    video.outerHTML =  `<video id="` + videoId + `" class="video-js vjs-theme-forest vjs-big-play-centered vjs-playback-rate"
							controls preload="auto" width="768" height="432"
							data-setup='{"controls": true, "autoplay": false, "preload": "auto", "playbackRates": [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3]}'>
							<source src= ` + source + ` + type="video/mp4" />
							<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
					    </video>`

    let myVideo = videojs(videoId);
    myVideo.ready(function() {
        this.hotkeys({
            volumeStep: 0.1,
            seekStep: 10,
            enableModifiersForNumbers: false,
            captureDocumentHotkeys: true,
            enableHoverScroll: true,
            documentHotkeysFocusElementFilter: e=>e.tagName.toLowerCase() === 'body',
            customKeys: {
                //TODO sostituire event.which con nuova implementazione
                slower: {
                    key: function(event) {
                        return (event.which === 74); // J
                    },
                    handler: function() {
                        let curr = myVideo.playbackRate();
                        if (curr > 1)
                            myVideo.playbackRate((curr - 0.1).toFixed(1));
                    }
                },
                faster: {
                    key: function(event) {
                        return (event.which === 75); // K
                    },
                    handler: function() {
                        let curr = myVideo.playbackRate();
                        if (curr < 3)
                            myVideo.playbackRate((curr + 0.1).toFixed(1));
                    }
                },
                reset: {
                    key: function(event) {
                        return (event.which === 76); // L
                    },
                    handler: function() {
                        myVideo.playbackRate(1);
                    }
                }
            }
        });
    });
}

function displayHotkeysLabels() {
    $(".video-js-box").append(
       `<div class = labels>
			<h3 style="font-size: 21px; margin-top: 21px;" class="cb-title">Hotkeys</h3>
			<p class="inline"><span class="keyboard-char">J</span> Slower</p>
			<p class="inline"><span class="keyboard-char">K</span> Faster</p>
			<p class="inline"><span class="keyboard-char">L</span> Reset</p>
			<br><br>
		</div>`
    );
}
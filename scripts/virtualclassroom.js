let urlList = [];
let lessonlist = [];
let preurl;
let seqVideoId;
let navbarAll = [];

$(function() {

    urlList = [];
    seqVideoId = 0;
    preurl = "https://didattica.polito.it/portal/pls/portal/";

    if (isConverted(document)) {
        newPlayer();
        hotkeysLabels();
    } else
        console.log("NOT CONVERTED");

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

    navbarAll = document.querySelectorAll('[id^="lessonList_"]');
    // questo server per le diverse sezioni di VirtualClassroom -- al momento ce n'è solo una, quindi il for seguente cicla una sola volta

    for (let i = 0; i < navbarAll.length; i++) {
        navbar = navbarAll[i]
        let jdown = document.createElement("button");
        jdown.className = "btn btn-primary download-all";
        jdown.innerHTML = "Export JDownloader List";

        let downAll = document.createElement("button");
        downAll.className = "btn btn-primary download-all";
        downAll.innerHTML = "Download ALL";

        downAll.addEventListener("click", function() {
            // lessonlist è creata qualche riga più in basso
            if (confirm("Sei sicuro di voler scaricare tutte (" + lessonlist[i].length + ") le virtual classroom già convertite?\nL'operazione può richiedere tempo e non può essere annullata.")) {
                for (let j = 0; j < lessonlist[i].length; j++) {
                    let d = document.getElementById("directdwn_" + i + "_" + j)  // id aggiunto da populateDownloadButton
					console.log(j+ " downloaded")
					d.click();  // clicca automaticamente tutti i tasti di download
                }
            }
        }, false);

        jdown.addEventListener("click", function() {
            let list = urlList[i].join("\n");
            copyToClipboard(list);
            alert("Link copiati negli appunti! ATTENZIONE! Le lezioni non convertite non verranno aggiunte alla lista\r\nLinks copied to clipboard! Not converted lessons will not be added to the list");
        }, false)

        navbar.insertBefore(downAll, navbar.firstChild);
        navbar.insertBefore(jdown, navbar.firstChild);

        lessonlist.push(navbar.getElementsByClassName("h5"));  // è un Array di HTMLCollection che è una lista di <li /> -- ha senso l'Array esterno?
		urlList.push([]);

        populateDownloadButton(i);
    }

});

function populateDownloadButton(index) {
	j = index;
    if (lessonlist[j]) {
        for (let i = 0; i < lessonlist[j].length; i++) {
            let li = lessonlist[j][i];
            let a = li.getElementsByTagName("a")[0];

            $(li).on("click", "a", function() {
                console.log("clicked!");
//                newPlayer(i);
            });

            let btn = document.createElement("button");
            btn.className = "btn btn-primary dwlbtn";
            btn.id = "directdwn_" + j + "_" + i;
            btn.innerHTML = '<span class="fa fa-download"></span> Download';
            btn.ass = a;
            bbbid = a.getAttribute("data-bbb-id");
            p_id_inc = a.getAttribute("data-id_inc");
            p_id_inc_prov = a.getAttribute("data-id_inc-prov");

            $.ajax({
                data: {
                    "p_bbbid": bbbid,
                    "p_id_inc": p_id_inc,
                    "p_id_inc_prov": p_id_inc_prov,
                },
                type: "POST",
                url: "https://didattica.polito.it/pls/portal30/sviluppo.virtual_classroom_dev.getVCTpl",
				index: j,
                success: function(r) {
                    el = document.createElement('html');
                    el.innerHTML = r;

                    let url = el.querySelector("source").src;
                    // get url with ajax
                    let filename = el.querySelector("h3").innerHTML + ".mp4";

                    urlList[this.index].push(url);

                    btn.addEventListener("click", function() {

                        downloadFile(url, filename);

                    }, false);

                    li.insertBefore(btn, li.firstChild);
                    var res = r
                    //$("#videoPlayerDiv_245793").html(r);
                }
            });
        }
    }

}

function sleep(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

async function newPlayer() {  // TODO: check
    await sleep(300);

    let video = $("video")[0];
    let source = video.src;
    if (source == null || source == "") {
        let src = video.children[0];
        source = src.src;
    }

    let videoId = "videoMP4_" + seqVideoId++;

    video.outerHTML = `<video id="` + videoId + `" class="video-js vjs-theme-forest vjs-big-play-centered vjs-playback-rate"
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
                        return (event.which === 74);
                        // J
                    },
                    handler: function() {
                        let curr = myVideo.playbackRate();
                        if (curr > 1)
                            myVideo.playbackRate((curr - 0.1).toFixed(1));
                    }
                },
                faster: {
                    key: function(event) {
                        return (event.which === 75);
                        // K
                    },
                    handler: function() {
                        let curr = myVideo.playbackRate();
                        if (curr < 3)
                            myVideo.playbackRate((curr + 0.1).toFixed(1));
                    }
                },
                reset: {
                    key: function(event) {
                        return (event.which === 76);
                        // L
                    },
                    handler: function() {
                        myVideo.playbackRate(1);
                    }
                }
            }
        });
    });
}

function hotkeysLabels() {

    let labels = `<div class = labels>
					<h3 style="font-size: 21px; margin-top: 21px;" class="cb-title">Hotkeys</h3>
					<p class="inline"><span class="keyboard-char">J</span> Slower</p>
					<p class="inline"><span class="keyboard-char">K</span> Faster</p>
					<p class="inline"><span class="keyboard-char">L</span> Reset</p>
					<br><br>
				  </div>`;

    $(".video-js-box").append(labels);
}

function isConverted(doc) {

    return doc.querySelectorAll('[id^="videoPlayer_"]');

}

function populateList() {

    if (lessonlist == null)
        return;

    console.log(lessonlist);

    /*let populate = 0;
    let id;

    if (urlList === "")
        populate = 1;
    id = "directdwn_";

    if (populate) {
        for (let i = 0; i <= lessonlist.length; i++) {
            let btn = document.getElementById(id + i);
            retrieveLink(btn);
        }
    }*/

}

function downloadFile(url, filename) {  // TODO: check
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
    navigator.clipboard.writeText(content);  // TODO: Unhandled Promise Rejection: NotAllowedError: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.
}

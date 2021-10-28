let urlList;
let lessonlist;
let preurl;

$(function () {

    urlList = "";
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
				<img style="width: 60px; height: 60px;" src="chrome-extension://` + exID + `/immagini/triangolo.png" alt="triangolo">
				<br><br><br>
				<p>Questa virtual classroom è in fase di conversione e non può essere scaricata.</p>
				<svg class="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
					<rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
				</svg>
			</div>
		</div>
    </div>`;

    HTMLbody.append(modal);

    $('#modal-container').on("click", function () {
        $(this).addClass('out');
        $('body').removeClass('modal-active');
    });

    navbar = document.querySelector('[id^="lessonList_"]');

    let jdown = document.createElement("button");
    jdown.className = "btn btn-primary download-all";
    jdown.innerHTML = "Export JDownloader List";

    let downAll = document.createElement("button");
    downAll.className = "btn btn-primary download-all";
    downAll.innerHTML = "Download ALL";

    downAll.addEventListener("click", function () {
        if (confirm("Sei sicuro di voler scaricare tutte le virtual classroom già convertite?\nL'operazione può richiedere tempo e non può essere annullata.")) {
            for (let i = 0; i < lessonlist.length; i++) {
                document.getElementById("directdwn_" + i).click();
            }
        }
    }, false);

    jdown.addEventListener("click", function () {
        populateList();
        alert("Link copiati negli appunti! ATTENZIONE! Le lezioni non convertite non verranno aggiunte alla lista\r\nLinks copied to clipboard! Not converted lessons will not be added to the list");
    }, false)

    navbar.insertBefore(downAll, navbar.firstChild);
    navbar.insertBefore(jdown, navbar.firstChild);

    lessonlist = navbar.getElementsByClassName("h5");

    populateDownloadButton();
    prevNextButtons();

});

function populateDownloadButton() {

    if (lessonlist) {
        for (let i = 0; i < lessonlist.length; i++) {
            let li = lessonlist[i];
            let a = li.getElementsByTagName("a")[0];

            a.addEventListener("click", function () {
                console.log(i);
                newPlayer(i);
            })

            let btn = document.createElement("button");
            btn.className = "btn btn-primary dwlbtn";
            btn.id = "directdwn_" + i;
            btn.innerHTML = '<span class="fa fa-download"></span> Download';
            btn.ass = a;
            let attribute = a.getAttribute("data-obj");
            const obj = JSON.parse(attribute);
            let url = obj.embed_url; // Url preso dal JSON all'interno dell'attributo data-obj
            let filename = obj.titolo_lez + ".mp4";

            btn.addEventListener("click", function () {

                downloadFile(url, filename);

            }, false);

            li.insertBefore(btn, li.firstChild);
        }
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function newPlayer() {
    await sleep(1000);

    let video = $("video")[0];
    let source = video.src;

    let videoId = "videoMP4_" + Math.floor(Math.random() * 10000000);

    video.outerHTML = `<video id="` + videoId + `" class="video-js vjs-theme-forest vjs-big-play-centered vjs-playback-rate"
							controls preload="auto" width="768" height="432"
							data-setup='{"controls": true, "autoplay": false, "preload": "auto", "playbackRates": [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3]}'>
							<source src= ` + source + ` + type="video/mp4" />
							<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
						</video>`

    let myVideo = videojs(videoId);

    myVideo.ready(function () {

        this.hotkeys({
            volumeStep: 0.1,
            seekStep: 10,
            enableModifiersForNumbers: false,
            captureDocumentHotkeys: true,
            enableHoverScroll: true,
            documentHotkeysFocusElementFilter: e => e.tagName.toLowerCase() === 'body',
            customKeys: { //TODO sostituire event.which con nuova implementazione
                slower: {
                    key: function (event) {
                        return (event.which === 74); // J
                    },
                    handler: function () {
                        let curr = myVideo.playbackRate();
                        if (curr > 1)
                            myVideo.playbackRate((curr - 0.1).toFixed(1));
                    }
                },
                faster: {
                    key: function (event) {
                        return (event.which === 75); // K
                    },
                    handler: function () {
                        let curr = myVideo.playbackRate();
                        if (curr < 3)
                            myVideo.playbackRate((curr + 0.1).toFixed(1));
                    }
                },
                reset: {
                    key: function (event) {
                        return (event.which === 76); // L
                    },
                    handler: function () {
                        myVideo.playbackRate(1);
                    }
                }
            }
        });
    });
}

function hotkeysLabels() {

    console.log("HOTKEYS");

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

function prevNextButtons() {

    let url = window.location.href;
    let i;

    for (i = 0; i < lessonlist.length; i++) {
        let a = lessonlist[i].getElementsByTagName("a");

        if (url === a[0].href) {
            if (i !== 0) { //non è il primo
                let prev = lessonlist[i - 1].getElementsByTagName("a");
                createButton(0, 1, prev[0].href);
            } else {
                createButton(0, 0, null);
            }
            if (i !== (lessonlist.length - 1)) { //non è l'ultimo
                let next = lessonlist[i + 1].getElementsByTagName("a");
                createButton(1, 1, next[0].href);
            } else {
                createButton(1, 0, null);
            }
            break;
        }
    }

    if (i === lessonlist.length)
        $(".labels").append("<u><b>Choose a lesson from the list on the left to enable prev/next buttons</b></u><br><br>");


}

function createButton(prevOrNext, isActive, url) { //Che bottone devo creare e se attivo o disattivo per gestione testa (no prev) e coda (no next)

    let btn = document.createElement("button");
    btn.className = "btn btn-primary dwlbtn";

    if (prevOrNext) { // next
        btn.id = "nextBtn";
        btn.innerHTML = "Next lesson";
        if (isActive) {
            btn.addEventListener("click", function () {
                window.location = url;
            })
        } else {
            btn.addEventListener("click", function () {
                alert("Sei all'ultima lezione!\r\nYou're at the last lesson!");
            })
        }

    } else {
        btn.id = "nextBtn";
        btn.innerHTML = "Previous lesson";
        if (isActive) {
            btn.addEventListener("click", function () {
                window.location = url;
            })
        } else {
            btn.addEventListener("click", function () {
                alert("Sei alla prima lezione!\r\nYou're at the first lesson!");
            })
        }
    }

    $(".labels").append(btn);

}

function populateList() {

    if (lessonlist == null)
        return;

    let populate = 0;
    let id;

    if (urlList === "")
        populate = 1;
    id = "directdwn_";

    if (populate) {
        for (let i = 0; i <= lessonlist.length; i++) {
            let btn = document.getElementById(id + i);
            retrieveLink(btn);
        }
    }

}

function retrieveLink(target) {

    if (target == null)
        return;

    let url = target.ass.getAttribute("href");

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            retrieveLinkCallback(xmlHttp.responseText);
    }

    xmlHttp.open("GET", preurl + url, true);
    xmlHttp.send(null);

}

function retrieveLinkCallback(response) {

    let parser = new DOMParser();
    let doc = parser.parseFromString(response, "text/html");

    if (isConverted(doc)) {
        let url = doc.getElementsByTagName("source")[0].src;

        urlList = urlList + "," + url;

        copyToClipboard(urlList.replaceAll(",", "\n"));
    }


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



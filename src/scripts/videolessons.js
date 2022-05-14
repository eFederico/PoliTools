let navbar;
let lessonlist;
let preurl;
let urlPSList;
let urlSOList;

$(function () {

    urlPSList = "";
    urlSOList = "";
    preurl = "https://didattica.polito.it/portal/pls/portal/";

    navbar = document.getElementById("navbar_left_menu");
    lessonlist = navbar.getElementsByClassName("h5");


    //newPlayer();
    //hotkeysLabels();
    //downloadAllButtons();
    //prevNextButtons();
    //populateDownloadButton();

});

function downloadAllButtons() {

    let downAll = document.createElement("button");
    downAll.className = "btn btn-primary download-all";
    downAll.innerHTML = "Download ALL (Prof & Slide)";

    let downAllSlide = document.createElement("button");
    downAllSlide.className = "btn btn-primary download-all";
    downAllSlide.innerHTML = "Download ALL (Slide Only)";

    let jdownSO = document.createElement("button");
    jdownSO.className = "btn btn-primary download-all";
    jdownSO.innerHTML = "Export JDownloader List (Slide Only)";

    let jdownPS = document.createElement("button");
    jdownPS.className = "btn btn-primary download-all";
    jdownPS.innerHTML = "Export JDownloader List (Prof & Slide)";

    downAll.addEventListener("click", function () {
        if (confirm("Sei sicuro di voler scaricare tutte le videolezioni (Prof & Slide)?\nL'operazione può richiedere tempo e non può essere annullata.")) {
            for (let i = 0; i < lessonlist.length; i++) {
                document.getElementById("directdwn_" + i).click();
            }
        }
    }, false);

    downAllSlide.addEventListener("click", function () {
        if (confirm("Sei sicuro di voler scaricare tutte le videolezioni (Slide Only)?\nL'operazione può richiedere tempo e non può essere annullata.")) {
            for (let i = 0; i < lessonlist.length; i++) {
                document.getElementById("directdwnslide_" + i).click();
            }
        }
    }, false);

    jdownSO.addEventListener("click", function () {
        populateList(1);
        alert("Link copiati negli appunti!\r\nLinks copied to clipboard!");
    }, false);
    jdownPS.addEventListener("click", function () {
        populateList(0);
        alert("Link copiati negli appunti!\r\nLinks copied to clipboard!");
    }, false);

    navbar.insertBefore(downAll, navbar.firstChild);
    navbar.insertBefore(downAllSlide, navbar.firstChild);
    navbar.insertBefore(jdownPS, navbar.firstChild);
    navbar.insertBefore(jdownSO, navbar.firstChild);

}

function populateList(type) {

    if (lessonlist == null) {
        return;
    }

    let populate = 0;
    let id;
    if (type) {
        if (urlSOList === "") {
            populate = 1;
        }
        id = "directdwnslide_";
    } else {
        if (urlPSList === "") {
            populate = 1;
        }
        id = "directdwn_";
    }

    if (populate) {
        for (let i = 0; i <= lessonlist.length; i++) {
            let btn = document.getElementById(id + i);
            retrieveLink(btn, type);
        }
    }

}

function copyToClipboard(content) {
    navigator.clipboard.writeText(content);
}

function populateDownloadButton() {
    if (lessonlist == null) {
        return;
    }
    for (let i = 0; i < lessonlist.length; i++) { // Per ogni lezione...

        let firstChild = lessonlist[i].firstChild;

        let hr = document.createElement("hr");
        lessonlist[i].insertBefore(hr, firstChild);

        let btn = document.createElement("button");
        btn.className = "btn btn-primary dwlbtn";
        btn.id = "directdwn_" + i;
        btn.innerHTML = '<span class="fa fa-download"></span>  Prof & Slide'; //aggiungo tasto Prof + Slide

        let btnSlide = document.createElement("button");
        btnSlide.className = "btn btn-primary dwlbtnslide";
        btnSlide.id = "directdwnslide_" + i;
        btnSlide.innerHTML = '<span class="fa fa-download"></span> Slide Only'; //aggiungo tasto Slide Only

        lessonlist[i].insertBefore(btn, firstChild); //Inserisco bottoni in testa all'elenco
        lessonlist[i].insertBefore(btnSlide, firstChild);

        let a = lessonlist[i].getElementsByTagName("a")[0];

        btn.ass = a;
        btn.addEventListener("click", function (e) { //Associo listener al bottone Prof + Slide

            startDownload(e.target, 0);

        }, false);

        btnSlide.ass = a;
        btnSlide.addEventListener("click", function (e) { //Associo listener al bottone Slide Only

            startDownload(e.target, 1);

        }, false);
    }

}

function retrieveLink(target, type) {

    if (target == null) {
        return;
    }

    let url = target.ass.getAttribute("href");

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            switch (type) {
                case 0:
                    retrieveLinkCallback(xmlHttp.responseText, 0);
                    break; // Callback per Prof + Slide
                case 1:
                    retrieveLinkCallback(xmlHttp.responseText, 1);   // Callback Slide Only
            }
    }

    console.log(preurl + url);

    xmlHttp.open("GET", preurl + url, true);
    xmlHttp.send(null);
}

function retrieveLinkCallback(response, slideOnly) {

    let parser = new DOMParser();
    let doc = parser.parseFromString(response, "text/html");

    // 0 -> 1 => primo link P+S - 1 -> 2 => secondo link SO
    let url = doc.querySelector("div.container-fluid > div.row > div.col-md-8 > " +
        "div.row:nth-child(5) ul > li:nth-child(" + (slideOnly + 1) + ") a").href;

    console.log(url);

    if (slideOnly) {
        urlSOList = urlSOList + "," + url;
        copyToClipboard(urlSOList.replaceAll(",","\n"));
    } else {
        urlPSList = urlPSList + "," + url;
        copyToClipboard(urlPSList.replaceAll(",","\n"));

    }
}

function startDownload(target, type) {
    let url = target.ass.getAttribute("href");
    let filename = target.ass.text;

    filename = filename.replace(/\//g, "_");
    filename = filename.replace(/ /g, "_");

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            switch (type) {
                case 0:
                    callback(xmlHttp.responseText, 0, filename); // Callback per Prof + Slide
                    break;
                case 1:
                    callback(xmlHttp.responseText, 1, filename);   // Callback Slide Only
            }
    }

    xmlHttp.open("GET", preurl + url, true);
    xmlHttp.send(null);
}

function callback(response, slideOnly, filename) {

    let parser = new DOMParser();
    let doc = parser.parseFromString(response, "text/html");

    slideOnly += 1; // 0 -> 1 => primo link P+S    -    1 -> 2 => secondo link SO

    let url = doc.querySelector("div.container-fluid > div.row > div.col-md-8 > " +
        "div.row:nth-child(5) ul > li:nth-child(" + slideOnly + ") a").href;

    if (slideOnly) {
        filename = filename + "_SlideOnly.mp4";
    } else {
        filename = filename + "_Prof&Slide.mp4";
    }
    download(url, filename);
}

function download(url, filename) {

    chrome.runtime.sendMessage({
        msg: "REDIRECT_AND_DOWNLOAD",
        data: {
            subject: "URL",
            content: url,
            filename: filename
        }
    });
}

function newPlayer() {

    let video = $("video")[0];

    // TODO Rimuovere flowplayer
    /*
        var test = flowplayer(video);
        test.shutdown();
    */

    let mp4Video = video.querySelector("source").src;
    let poster = $('.video-js').attr("poster");

    video.outerHTML = `<video id="videoMP4" class="video-js vjs-theme-forest vjs-big-play-centered vjs-playback-rate"
							controls preload="auto" width="768" height="432"
							poster = ` + poster + `
							data-setup='{"controls": true, "autoplay": false, "preload": "auto", "playbackRates": [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3]}'>
							<source src= ` + mp4Video + ` + type="video/mp4" />
							<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
						</video>`;

    let myVideo = videojs('videoMP4');

    myVideo.ready(function () { //TODO separare in JS a parte?
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
                    handler: function (player, options, event) {
                        let curr = myVideo.playbackRate();
                        if (curr > 1)
                            myVideo.playbackRate((curr - 0.1).toFixed(1));
                    }
                },
                faster: {
                    key: function (event) {
                        return (event.which === 75); // K
                    },
                    handler: function (player, options, event) {
                        let curr = myVideo.playbackRate();
                        if (curr < 3)
                            myVideo.playbackRate((curr + 0.1).toFixed(1));
                    }
                },
                reset: {
                    key: function (event) {
                        return (event.which === 76); // L
                    },
                    handler: function (player, options, event) {
                        myVideo.playbackRate(1);
                    }
                }
            }
        });
    });
}

function hotkeysLabels() {

    let labels = `<div class = "labels">
					<h3 style="font-size: 21px; margin-top: 21px;" class="cb-title">Hotkeys</h3>
					<p class="inline"><span class="keyboard-char">J</span> Slower</p>
					<p class="inline"><span class="keyboard-char">K</span> Faster</p>
					<p class="inline"><span class="keyboard-char">L</span> Reset</p>
					<br> <br>
				  </div>`;

    $(".video-js-box").append(labels);
}

function prevNextButtons() {

    let url = window.location.href;
    let i;

    for (i = 0; i < lessonlist.length; i++) {
        let a = lessonlist[i].getElementsByTagName("a");

        if (url === a[0].href) {
            if (i !== 0) { //non è il primo
                let prev = lessonlist[i-1].getElementsByTagName("a");
                createButton(0, 1, prev[0].href);
            } else {
                createButton(0, 0, null);
            }
            if (i !== (lessonlist.length-1)) { //non è l'ultimo
                let next = lessonlist[i+1].getElementsByTagName("a");
                createButton(1, 1, next[0].href);
            } else {
                createButton(1, 0, null);
            }
            break;
        }
    }

    if (i === lessonlist.length)
        $(".labels").append("<u><b>Choose a lesson from the list on the left to enable prev/next buttons</b></u>");


}

function createButton(prevOrNext, isActive, url) { //Che bottone devo creare e se attivo o disattivo per gestione testa (no prev) e coda (no next)

    let btn = document.createElement("button");
    btn.className = "btn btn-primary dwlbtn";

    if(prevOrNext) { // next
        btn.id = "nextBtn";
        btn.innerHTML = "Next lesson";
        if (isActive) {
            btn.addEventListener("click", function (e) {
                window.location = url;
            })
        } else {
            btn.addEventListener("click", function (e) {
                alert("Sei all'ultima lezione!\r\nYou're at the last lesson!");
            })
        }

    } else {
        btn.id = "nextBtn";
        btn.innerHTML = "Previous lesson";
        if (isActive) {
            btn.addEventListener("click", function (e) {
                window.location = url;
            })
        } else {
            btn.addEventListener("click", function (e) {
                alert("Sei alla prima lezione!\r\nYou're at the first lesson!");
            })
        }
    }

    $(".labels").append(btn);

}

/*function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

addStyle(`
  #navbar_left_menu {
	  display: flex;
	  flex-direction: column-reverse;
  }
`);*/


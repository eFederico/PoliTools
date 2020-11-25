var navbar;
var lessonlist;

$(document).ready(function() {

	navbar = document.getElementById("navbar_left_menu");
	lessonlist = navbar.getElementsByClassName("h5");

	newPlayer();
	hotkeysLabels();
	downloadAllButtons();
    populateDownloadButton();
    	
});

function downloadAllButtons() {

	var downAll = document.createElement("button");
	downAll.className="btn btn-primary download-all";
	downAll.innerHTML = "Download ALL (Prof & Slide)";

	var downAllSlide = document.createElement("button");
	downAllSlide.className="btn btn-primary download-all";
	downAllSlide.innerHTML = "Download ALL (Slide Only)";

	downAll.addEventListener("click", function () {
		if(confirm("Sei sicuro di voler scaricare tutte le videolezioni (Prof & Slide)?\nL'operazione può richiedere tempo e non può essere annullata.")) {
			for (var i = 0; i < lessonlist.length; i++) {
				document.getElementById("directdwn_" + i).click();
			}
		}
	}, false);


	downAllSlide.addEventListener("click", function () {
		if(confirm("Sei sicuro di voler scaricare tutte le videolezioni (Slide Only)?\nL'operazione può richiedere tempo e non può essere annullata.")) {
			for (var i = 0; i < lessonlist.length; i++) {
				document.getElementById("directdwnslide_" + i).click();
			}
		}
	}, false);

	navbar.insertBefore(downAll, navbar.firstChild);
	navbar.insertBefore(downAllSlide, navbar.firstChild);
}

function populateDownloadButton()
{
	if (lessonlist) {
        for (var i = 0; i < lessonlist.length; i++) { // Per ogni lezione...

			var firstChild = lessonlist[i].firstChild;

			var hr = document.createElement("hr");
			lessonlist[i].insertBefore(hr, firstChild);

            var btn = document.createElement("button");
            btn.className="btn btn-primary dwlbtn";
            btn.id="directdwn_"+i;
            btn.innerHTML = '<span class="fa fa-download"></span>  Prof & Slide'; //aggiungo tasto Prof + Slide
            
            var btnSlide = document.createElement("button");
            btnSlide.className="btn btn-primary dwlbtnslide";
            btnSlide.id="directdwnslide_"+i;
            btnSlide.innerHTML = '<span class="fa fa-download"></span> Slide Only'; //aggiungo tasto Slide Only

            lessonlist[i].insertBefore(btn, firstChild); //Inserisco bottoni in testa all'elenco
            lessonlist[i].insertBefore(btnSlide, firstChild);

            var a = lessonlist[i].getElementsByTagName("a")[0];

            btn.ass = a;
            btn.addEventListener("click", function(e) { //Associo listener al bottone Prof + Slide

                startDownload(e.target,0);
                    
            }, false);
            
            btnSlide.ass = a;
            btnSlide.addEventListener("click", function(e) { //Associo listener al bottone Slide Only

                startDownload(e.target,1);
                    
            }, false);
        }
	}
}

function startDownload(target, type)
{
	var url = target.ass.getAttribute("href");
	var filename = target.ass.text;

	filename = filename.replace(/\//g, "_");
	filename = filename.replace(/ /g, "_");

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
			switch (type) {
				case 0: callback(xmlHttp.responseText, 0, filename); break; // Callback per Prof + Slide
				case 1: callback(xmlHttp.responseText, 1, filename);   // Callback Slide Only
			}
	}
	var preurl = "https://didattica.polito.it/portal/pls/portal/";
		
	xmlHttp.open("GET", preurl+url, true);
	xmlHttp.send(null);
}

function callback(response, slideOnly, filename)
{
	if (slideOnly) {
		filename = filename + "_SlideOnly";
	} else {
		filename = filename + "_Prof&Slide";
	}

	filename = filename+".mp4";

    slideOnly++; // 0 -> 1 => primo link P+S    -    1 -> 2 => secondo link SO

	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");

	var url = doc.querySelector("div.container-fluid > div.row > div.col-md-8 > div.row:nth-child(5) ul > li:nth-child("+slideOnly+") a").href;

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

	var video = $("video")[0];

	// TODO
	/*
		var test = flowplayer(video);
		test.shutdown();
	*/

	var mp4Video = video.querySelector("source").src;
	var poster = $('.video-js').attr("poster");

	video.outerHTML =	`<video id="videoMP4" class="video-js vjs-theme-forest vjs-big-play-centered vjs-playback-rate"
							controls preload="auto" width="768" height="432"
							poster = ` + poster + `
							data-setup='{"controls": true, "autoplay": false, "preload": "auto", "playbackRates": [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3]}'>
							<source src= ` + mp4Video + ` + type="video/mp4" />
							<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
						</video>`;

	var myVideo = videojs('videoMP4');

	myVideo.ready(function(){
		this.hotkeys({
			volumeStep: 0.1,
			seekStep: 10,
			enableModifiersForNumbers: false,
			captureDocumentHotkeys: true,
			enableHoverScroll: true,
			documentHotkeysFocusElementFilter:  e => e.tagName.toLowerCase() === 'body' ,
			customKeys: {
				slower: {
					key: function(event) {
						return (event.which === 74); // J
					},
					handler: function(player, options, event) {
						let curr = myVideo.playbackRate();
						if(curr > 1)
							myVideo.playbackRate((curr - 0.1).toFixed(1));
					}
				},
				faster:{
					key: function(event) {
						return (event.which === 75); // K
					},
					handler: function(player, options, event) {
						let curr = myVideo.playbackRate();
						if(curr < 3)
							myVideo.playbackRate((curr + 0.1).toFixed(1));
					}
				},
				reset:{
					key: function(event) {
						return (event.which === 76); // L
					},
					handler: function(player, options, event) {
						myVideo.playbackRate(1);
					}
				}
			}
		});
	});
}

function hotkeysLabels() {

	var labels = `<div><h3 style="font-size: 21px; margin-top: 21px;" class="cb-title">Hotkeys</h3>
					<p class="inline"><span class="keyboard-char">J</span> Slower</p>
					<p class="inline"><span class="keyboard-char">K</span> Faster</p>
					<p class="inline"><span class="keyboard-char">L</span> Reset</p>
				  </div>`;

	$(".video-js-box").append(labels);
}
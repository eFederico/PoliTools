$(document).ready(function() { 

	newPlayer();

    navbar = document.getElementById("navbar_left_menu");

    var downAll = document.createElement("button");
	downAll.className="btn btn-primary download-all";
	downAll.innerHTML = "Download ALL (Prof & Slide)";
	
	var downAllSlide = document.createElement("button");
	downAllSlide.className="btn btn-primary download-all";
	downAllSlide.innerHTML = "Download ALL (Slide Only)";

	var lessonList = getLessonListDOM();

	downAll.addEventListener("click", function() {
		for(var i = 0; i < lessonList.length; i++)
		{
			document.getElementById("directdwn_"+i).click();
		}
	}, false);
	
	downAllSlide.addEventListener("click", function() {
		for(var i = 0; i < lessonList.length; i++)
		{
			document.getElementById("directdwnslide_"+i).click();
		}
	}, false);
	
	navbar.insertBefore(downAll, navbar.firstChild);
	navbar.insertBefore(downAllSlide, navbar.firstChild);
	
    populateDownloadButton();
    	
});

function populateDownloadButton()
{
	var lessonList = getLessonListDOM();
		
	if (lessonList) {
        for (var i = 0; i < lessonList.length; i++) { //Per ogni lezione...
            
            var btn = document.createElement("button");
            btn.className="btn btn-primary dwlbtn";
            btn.id="directdwn_"+i;
            btn.innerHTML = '<span class="fa fa-download"></span>  Prof & Slide'; //aggiungo tasto Prof + Slide
            
            var btnSlide = document.createElement("button");
            btnSlide.className="btn btn-primary dwlbtnslide";
            btnSlide.id="directdwnslide_"+i;
            btnSlide.innerHTML = '<span class="fa fa-download"></span> Slide Only'; //aggiungo tasto Slide Only
            
            var firstChild = lessonList[i].firstChild;

            lessonList[i].insertBefore(btn, firstChild); //Inserisco bottoni in testa all'elenco
            lessonList[i].insertBefore(btnSlide, firstChild);
            
            var a = lessonList[i].getElementsByTagName("a")[0];
            
            var hr = document.createElement("hr");
            lessonList[i].insertBefore(hr, firstChild);
    
            btn.ass = a;
            btn.addEventListener("click", function(e) { //Associo listner al bottone Prof + Slide
                var url = e.target.ass.getAttribute("href");
              
                startDownload(url, 1, 0);
                    
            }, false);
            
            btnSlide.ass = a;
            btnSlide.addEventListener("click", function(e) { //Associo listner al bottone Slide Only
                var url = e.target.ass.getAttribute("href");
               
                startDownload(url, 1, 1);
                    
            }, false);
        }
	}
}

function getLessonListDOM()
{
	return navbar.getElementsByClassName("h5");
}

function startDownload(url, type)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			switch (type) {
				case 0: callback(xmlHttp.responseText, 0); break; // Callback per Prof + Slide
				case 1: callback(xmlHttp.responseText, 1);   // Callback Slide Only
			}
	}
	var preurl = "https://didattica.polito.it/portal/pls/portal/";
		
	xmlHttp.open("GET", preurl+url, true);
	xmlHttp.send(null);
}

function callback(response, slideOnly)
{   
    slideOnly++; // 0 -> 1 => primo link P+S    -    1 -> 2 => secondo link SO

	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");

	var url = doc.querySelector("div.container-fluid > div.row > div.col-md-8 > div.row:nth-child(5) ul > li:nth-child("+slideOnly+") a").href;
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				downloadFromURL(xmlHttp.responseURL);
		}
	}
	
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function downloadFromURL(url)   // FIXME Da spostare in background.js
{
	chrome.runtime.sendMessage({
	msg: "PLS_DOWNLOAD", 
	data: {
		subject: "URL",
		content: url,
	}
	});
	
}

function newPlayer() {

	var video = document.getElementsByTagName("video")[0];
	var mp4Video = video.getElementsByTagName("source")[0].src;
	var poster = $('.video-js').attr("poster");

	video.outerHTML =	`<video id="videoMP4" class="video-js vjs-theme-forest vjs-big-play-centered vjs-playback-rate"
							controls preload="auto" width="768" height="432"
							poster = ` + poster + `
							data-setup='{"controls": true, "autoplay": false, "preload": "auto", "playbackRates": [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]}'>
							<source src= ` + mp4Video + ` + type="video/mp4" />
							<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
						</video>`;

	videojs('videoMP4');
	
	videojs('videoMP4').ready(function(){
		this.hotkeys({
			volumeStep: 0.1,
			seekStep: 10,
			eneableModifiersForNumbers: false
		});
	});
}
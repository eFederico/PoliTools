$(document).ready(function() { 

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
    	
	insertSlider();

	manageHotkeys();

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

function rangeSlider(){
    var slider = $('.range-slider'),
    range = $('.range-slider__range'),
    value = $('.range-slider__value');
    
 	  slider.each(function(){

      value.each(function(){
        var value = $('.range-slider__range').attr('value');
        $(this).html(value);
      
      });

      range.on('input', function(){
        $('.range-slider__value').html(this.value);
      });
    });
};

function insertSlider() {
	
	var slider = `<div><h3 style="font-size: 21px;" class="cb-title">Hotkeys</h3>
						<p class="inline"><span class="keyboard-char">J</span> Slower</p>
						<p class="inline"><span class="keyboard-char">K</span> Faster</p>
						<p class="inline"><span class="keyboard-char">L</span> Reset</p>
						<div class="range-slider"><input class="range-slider__range " type="range" value="1.0" min="0.1" max="2.5" step="0.1">
						<span class="range-slider__value col-md-1">1</span>
					</div>`
	var macro = document.createElement('div');
	
	macro.innerHTML = slider;
	var controls = document.querySelector(".col-md-12.col-lg-8");

	controls.insertBefore(macro, controls.firstChild);
	
	document.querySelector(".range-slider__range").addEventListener("change", function(){

		document.querySelector(".video-js").playbackRate = document.querySelector(".range-slider__value").innerHTML;
	});
	
   	rangeSlider();
}



function manageHotkeys(){
	document.addEventListener('keyup', function (e){
  
		if(e.defaultPrevented){
			return;
		}
  
		var key = e.key || e.keyCode;
		var video = document.querySelector(".video-js");
		
		if(video.playbackRate < 2.5 && (key === 'K' || key === 'k' || key === 75)){ //Accelero
	
		  video.playbackRate += 0.1;
		} else if(video.playbackRate > 0.1 && (key === 'J' || key === 'j' || key === 74)){ //Decellero
		
		  video.playbackRate -= 0.1;
		} else if(key === 'L' || key === 'l' || key === 76){ //Reset
		  
		  video.playbackRate = 1.0;
		}
		document.querySelector(".range-slider__value").innerHTML = video.playbackRate.toFixed(1);
		document.querySelector(".range-slider__range").value = video.playbackRate.toFixed(1);
	});
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
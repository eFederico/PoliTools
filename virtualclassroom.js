var map = {};
var selected = {};
var last_selected = 0;

var total = 0;
var modal_dom;

var navbar;
var page_mode = 0;
var page_subtype = 0;
var exID = chrome.runtime.id;


$(document).ready(function() { 
	
	console.log("Virtual Classroom");

	$("body").addClass("virtual-classroom");
//$f("aflowplayer").setOpts({keyboard: {seek_step: "20"}});
	var modal = `
	<div id="modal-container">
		<div class="modal-background">
			<div class="modal">
				<img style="width: 60px; height: 60px;" src="chrome-extension://`+exID+`/immagini/triangolo.png">
				<br><br><br>
				<p>Questa virtual classroom è in fase di conversione e non può essere scaricata.</p>
				<svg class="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
					<rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
				</svg>
			</div>
		</div>
	</div>`;

	$("body").append(modal);
	 
	$('#modal-container').click(function(){
		$(this).addClass('out');
		$('body').removeClass('modal-active');
	});

    navbar = document.getElementById("navbar_left_menu");
	
	if(typeof navbar === 'undefined' || navbar == null){
		page_mode = 1;
		navbar = document.getElementById("lessonList");
		$('head').append('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">');
	}

    var downall = document.createElement("button");
	downall.className="btn btn-primary download-all";
	downall.innerHTML = "Download ALL";

    downall.addEventListener("click", function() {
		var els = getLessonListDOM();
		for(var i = 0; i < els.length; i++)
		{
			document.getElementById("directdwn_"+i).click();
		}
	}, false);

	navbar.insertBefore(downall, navbar.firstChild);

	populateDownloadButton();

	fullScreen();

	insertSlider();

});

function insertSlider() {

	var slider = `<div><h3 style="font-size: 21px; margin-top: 21px;" class="cb-title">Hotkeys</h3>
					<p class="inline"><span class="keyboard-char">J</span> Slower</p>
					<p class="inline"><span class="keyboard-char">K</span> Faster</p>
					<p class="inline"><span class="keyboard-char">L</span> Reset</p>
					<div class="range-slider">
						<div style="width:80%">
							<input class="range-slider__range " type="range" value="1.0" min="0.1" max="2.5" step="0.1"></div>
							<div style="width:15%">
								<span class="range-slider__value col-md-1" style="padding-right: 34px;">1</span>
							</div>
						</div>
					</div>`;

	var controls = $(".video-js-box");

	if (controls.get().length == 1) {
		console.log("Virtual classroom convertita");
		
		controls.append(slider);
		document.querySelector(".range-slider__range").addEventListener("change", function(){

			document.querySelector(".video-js").playbackRate = document.querySelector(".range-slider__value").innerHTML;
		});

		manageHotkeys();
	} else {
		console.log("Virtual classroom BBB");
		var hotkeysLabel = `<div><h3 style="font-size: 21px; margin-top: 30px;" class="cb-title">Hotkeys</h3> <p class="inline"><span class="keyboard-char">J</span> Slower</p><p class="inline"><span class="keyboard-char">K</span> Faster</p><p class="inline"><span class="keyboard-char">L</span> Reset</p>`;

		$("iframe").parent().append(hotkeysLabel);
		//if ($("body.virtual-classroom") != null) {
			
		//controls =  document.querySelector("body.virtual-classroom");

		//controls.parentNode.insertBefore(macro, controls.nextSibling);
	
		/*document.querySelector(".range-slider__range").addEventListener("change", function(){
			var iframe = document.querySelector('iframe');
			iframe.contentWindow.document.querySelector("#video.webcam").playbackRate = document.querySelector(".range-slider__value").innerHTML;
		});*/
		//}
		
	}
   	rangeSlider();
}

function populateDownloadButton()
{
	var els = getLessonListDOM();
		
	if(els){
        for(var i = 0; i < els.length; i++)
        {

			var li = els[i];
			var a = li.getElementsByTagName("a")[0];
			var lin = a.getAttribute("href");
			
			var btn = document.createElement("button");
			btn.className="btn btn-primary dwlbtn";
			btn.id="directdwn_"+i;
			btn.innerHTML = '<span class="fa fa-download"></span> Download';

			li.insertBefore(btn, li.firstChild);

			/*if(page_mode == 0) {
				var hr = document.createElement("hr");
				li.insertBefore(hr, li.firstChild);
			} else {
				a.parentNode.removeChild(a.nextSibling);
			}*/
		
			var dombtn = document.getElementById("directdwn_"+i);
		
			dombtn.ass = a;
			dombtn.addEventListener("click", function(evt) {

				var xmlHttp = new XMLHttpRequest();
				xmlHttp.onreadystatechange = function() 
				{ 
					if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
					checkBBB(xmlHttp.responseText, evt);
				}
				var preurl = "https://didattica.polito.it/portal/pls/portal/";
				
				if(page_mode == 0){	}
				else if(page_mode == 1)
				{
					if(page_subtype == 0) 
						preurl = "https://elearning.polito.it/gadgets/video/";
					else if(page_subtype == 1) 
						preurl = "https://elearning.polito.it/main/videolezioni/";
				}

				xmlHttp.open("GET", preurl+evt.target.ass.getAttribute("href"), true);
				xmlHttp.send(null);   

			}, false);
            
        }
	}
}

function checkBBB(response, evt) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");

	if (doc.querySelector("video.video-js") != null) {

		var url = evt.target.ass.getAttribute("href");
		var filename = evt.target.ass.text;

		filename = filename.replace(/\//g, function (x) { return x = "_"; });
		filename = filename.replace(/ /g, function (x) { return x = "_"; });
		filename = filename+".mp4";
		
		var inn = evt.target.id.substr(10);
		
		if(total <= inn) total = (inn+1);
		
		startDownload(inn, url, 1, 0, filename);
	} else {
		var buttonId = 'two';
 		$('#modal-container').removeAttr('class').addClass(buttonId);
 		$('body').addClass('modal-active');
	}
}

/*function insertButton(document, response, i) {
	
	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");
	
	var classes = document.querySelectorAll("#lessonList .h5");
	var li = classes[i];

	var btn = doc.createElement("button");
	btn.className="btn btn-primary dwlbtn";
	btn.id="directdwn_"+i;
	btn.innerHTML = '<span class="fa fa-download"></span> Download';
	
	li.insertBefore(btn, li.firstChild);

	var a = li.getElementsByTagName("a")[0];
	if(page_mode == 0) {
		var hr = doc.createElement("hr");
		li.insertBefore(hr, li.firstChild);
	} else {
		a.parentNode.removeChild(a.nextSibling);
	}

	var dombtn = document.getElementById("directdwn_"+i);

	if (doc.querySelector("video.video-js") != null) {
		dombtn.ass = a;
		dombtn.addEventListener("click", function(evt) {
				var url = evt.target.ass.getAttribute("href");
				var inn = evt.target.id.substr(10);
				
				if(total <= inn) total = (inn+1);
				
				startDownload(inn, url, 1, 0);
			
		}, false);
	} else {
		dombtn.disabled = true;
	}
	
}*/

function getLessonListDOM()
{
	var els;
	if(page_mode == 0)
	{
		els = navbar.getElementsByClassName("h5");
	}
	else
	{
		//els = $("#"+navbar.getElementsByTagName("ul")[0].id).children();
		//els = .children;
		var arr = navbar.getElementsByClassName("lezioni");
		if(arr.length == 2)
		{
			page_subtype = 1;
		}
		
		console.log(arr);
		els = getChilds(arr[arr.length-1],"li");
		console.log(els);
	}
	
	return els;
}

function puy_startReconizer()
{
	//var navbar = document.getElementById("navbar_left_menu");
	var els = getLessonListDOM();
	total = els.length;
	if(els){
	for(var i = 0; i<els.length; i++)
	{
		
	   //if( i > 20) break;
	   
	   var a = els[i].getElementsByTagName("a");
	   if(a)
	   {
			var lin = a[0].getAttribute("href");
			//console.log(lin);
			var mol = i*500;
			//console.log(mol);
			setTimeout(startDownload, mol, i, lin, 0);
	   }
	}
	}
}

function startDownload(index, lin, direct=0, type, filename)
{

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			switch (type) {
				case 0: callback(index, xmlHttp.responseText, direct, filename); break;
				case 1: callbackSlide(index, xmlHttp.responseText, direct); break;
			}
	}
	var preurl = "https://didattica.polito.it/portal/pls/portal/";
	
	if(page_mode == 0){	}
	else if(page_mode == 1)
	{
		if(page_subtype == 0) 
			preurl = "https://elearning.polito.it/gadgets/video/";
		else if(page_subtype == 1) 
			preurl = "https://elearning.polito.it/main/videolezioni/";
	}
	
	xmlHttp.open("GET", preurl+lin, true);
	xmlHttp.send(null);
}

function callback(index, response, direct=0, filename)
{
	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");

	var a = doc.getElementsByTagName("script");
	for(var i = 0; i<a.length; i++)
	{
		if(!a[i]) continue;
		var str = a[i].textContent;
		if(str.indexOf("flowplayer.commercial-latest.swf") != -1)
		{
			
			var ind1 = str.indexOf(",{'url':'");
			if(ind1 != -1)
			{
				var ind2 = str.indexOf("}", ind1+9);
				if(ind2 != -1){
					var fin = str.substring((ind1+9),(ind2-1));
					//console.log("1: "+ind1+" 2: "+ind2+ " 3:"+(ind2-ind1));
					map[index] = fin;
					
					//reloadTable();
					console.log(fin);
					if(direct == 1)
						download(index, filename);
					return;
				}
			}
		}
		
	}
}

function downloadFromURL(url)
{

	chrome.runtime.sendMessage({
	msg: "PLS_DOWNLOAD", 
	data: {
		subject: "URL",
		content: url,
	}
	});
	
}

function download(index, filename)
{
	var urll = map[index];

	chrome.runtime.sendMessage({
	msg: "PLS_DOWNLOAD", 
	data: {
		subject: "URL",
		content: urll,
		filename: filename
	}
	});
}

var rangeSlider = function(){
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
		} /* else if(key === 'ArrowRight' || key === 39){ //Seek avanti
			
			seek(+30);
	    } else if(key === 'ArrowLeft' || key === 37){ //Seek indietro
			
			seek(-30);
		} */
		document.querySelector(".range-slider__value").innerHTML = video.playbackRate.toFixed(1);
		document.querySelector(".range-slider__range").value = video.playbackRate.toFixed(1);
	});
  }

function fullScreen() {
	let iframe = document.querySelector("iframe");

	if (iframe != null) {
    	iframe.allowFullscreen = true;
  	  iframe.src = iframe.src;
	}
}

/* function seek(sec) {
	var video = document.getElementsByTagName("video")[0];
	var currentTime = video.currentTime;
	video_seek(currentTime+sec);
}

function html5_seek (secondi){
	var video = document.getElementsByTagName("video")[0];
	video.pause();
	video.currentTime = secondi;
	video.play();
}
function flow_seek(secondi) {
	if ($f("aflowplayer").isPlaying()) $f("aflowplayer").pause();
	$f("aflowplayer").seek(secondi);
	$f("aflowplayer").play();
}
function video_seek(secondi){
	var video = document.getElementsByTagName("video")[0];
	if (video.style.display=='none') {
	  flow_seek(secondi);
	} else {
	  html5_seek(secondi);
}
} */


$(function() {

	if(isConverted(document)) {
		newPlayer();
		hotkeysLabels();
	}

	let HTMLbody = $("body");

    HTMLbody.addClass("virtual-classroom");

    //TODO Modal ancora utile?
    let modal = `
	<div id="modal-container">
		<div class="modal-background">
			<div class="modal">
				<img style="width: 60px; height: 60px;" src="chrome-extension://`+exID+`/immagini/triangolo.png" alt="triangolo">
				<br><br><br>
				<p>Questa virtual classroom è in fase di conversione e non può essere scaricata.</p>
				<svg class="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
					<rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
				</svg>
			</div>
		</div>
    </div>`;
    
    HTMLbody.append(modal);
    
    $('#modal-container').on("click", function(){
		$(this).addClass('out');
		$('body').removeClass('modal-active');
	});

    navbar = document.getElementById("navbar_left_menu");

    let downAll = document.createElement("button");
	downAll.className="btn btn-primary download-all";
	downAll.innerHTML = "Download ALL";

	downAll.addEventListener("click", function () {
		if(confirm("Sei sicuro di voler scaricare tutte le virtual classroom già convertite?\nL'operazione può richiedere tempo e non può essere annullata.")) {
			var lessonList = getLessonListDOM();
			for (var i = 0; i < lessonList.length; i++) {
				document.getElementById("directdwn_" + i).click();
			}
		}
	}, false);

    navbar.insertBefore(downAll, navbar.firstChild);

	populateDownloadButton();

});

function getLessonListDOM()
{
	return navbar.getElementsByClassName("h5");
}

function populateDownloadButton()
{
	let lessonList = getLessonListDOM();
		
	if (lessonList){
        for(let i = 0; i < lessonList.length; i++)
        {
			let li = lessonList[i];
			let a = li.getElementsByTagName("a")[0];

			let btn = document.createElement("button");
			btn.className="btn btn-primary dwlbtn";
			btn.id="directdwn_"+i;
			btn.innerHTML = '<span class="fa fa-download"></span> Download';
			btn.ass = a;
			btn.addEventListener("click", function(e) {
				console.log(e.target);
				let xmlHttp = new XMLHttpRequest();
				xmlHttp.onreadystatechange = function() 
				{ 
					if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
						callback(xmlHttp.responseText, e.target);
					}
                }
                
				let preurl = "https://didattica.polito.it/portal/pls/portal/";

				xmlHttp.open("GET", preurl+e.target.ass.getAttribute("href"), true);
				xmlHttp.send(null);   

			}, false);

			li.insertBefore(btn, li.firstChild);
        }
	}
}

function callback(response, target) {

	let parser = new DOMParser();
	let doc = parser.parseFromString(response, "text/html");

	if (isConverted(doc)) {

		let filename = target.ass.text;

		filename = filename.replace(/\//g, "_");
		filename = filename.replace(/ /g, "_");
		filename = filename+".mp4";

		let url = doc.getElementsByTagName("source")[0].src;

		console.log(url);

		chrome.runtime.sendMessage({
			msg: "PLS_DOWNLOAD",
			data: {
				subject: "URL",
				content: url,
				filename: filename
			}
		});

	} else { 
		let buttonId = 'two';
 		$('#modal-container').removeAttr('class').addClass(buttonId); // Apro popup se è una BBB
 		$('body').addClass('modal-active');
	}
}

function newPlayer() {

	let video = $("video")[0];
	let mp4Video = video.querySelector("source").src;

	video.outerHTML =	`<video id="videoMP4" class="video-js vjs-theme-forest vjs-big-play-centered vjs-playback-rate"
							controls preload="auto" width="768" height="432"
							data-setup='{"controls": true, "autoplay": false, "preload": "auto", "playbackRates": [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3]}'>
							<source src= ` + mp4Video + ` + type="video/mp4" />
							<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
						</video>`

	let myVideo = videojs('videoMP4');

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

	let labels = `<div>
					<h3 style="font-size: 21px; margin-top: 21px;" class="cb-title">Hotkeys</h3>
					<p class="inline"><span class="keyboard-char">J</span> Slower</p>
					<p class="inline"><span class="keyboard-char">K</span> Faster</p>
					<p class="inline"><span class="keyboard-char">L</span> Reset</p>
				  </div>`;

	$(".video-js-box").append(labels);
}

function isConverted(doc) {

	return doc.getElementById("videoPlayer") != null;
}
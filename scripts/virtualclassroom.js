var exID = chrome.runtime.id;

$(document).ready(function() { 

    $("body").addClass("virtual-classroom");
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

    var downAll = document.createElement("button");
	downAll.className="btn btn-primary download-all";
	downAll.innerHTML = "Download ALL";

    downAll.addEventListener("click", function() {
		var lessonList = getLessonListDOM();
		for(var i = 0; i < lessonList.length; i++)
		{
			document.getElementById("directdwn_"+i).click();
		}
	}, false);

    navbar.insertBefore(downall, navbar.firstChild);

	populateDownloadButton();

    insertSlider();

});

function populateDownloadButton()
{
	var lessonList = getLessonListDOM();
		
	if (lessonList){
        for(var i = 0; i < lessonList.length; i++)
        {

			var li = lessonList[i];
			var a = li.getElementsByTagName("a")[0];

			var btn = document.createElement("button");
			btn.className="btn btn-primary dwlbtn";
			btn.id="directdwn_"+i;
			btn.innerHTML = '<span class="fa fa-download"></span> Download';

			li.insertBefore(btn, li.firstChild);
		
			btn.ass = a;
			btn.addEventListener("click", function(e) {

				var xmlHttp = new XMLHttpRequest();
				xmlHttp.onreadystatechange = function() 
				{ 
					if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
					callback(xmlHttp.responseText, e);
                }
                
				var preurl = "https://didattica.polito.it/portal/pls/portal/";

				xmlHttp.open("GET", preurl+e.target.ass.getAttribute("href"), true);
				xmlHttp.send(null);   

			}, false);
            
        }
	}
}

function callback(response, e) {

	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");

	if (doc.querySelector("video.video-js") != null) { // Controllo se convertita

		var url = e.target.ass.getAttribute("href");
		var filename = e.target.ass.text;

		filename = filename.replace(/\//g, "_");
		filename = filename.replace(/ /g, "_");
		filename = filename+".mp4";
		
		var index = e.target.id.substr(10);
				
		startDownload(index, url, 1, filename);
	} else { 
		var buttonId = 'two';
 		$('#modal-container').removeAttr('class').addClass(buttonId); // Apro popup se è una BBB
 		$('body').addClass('modal-active'); z
	}
}

function getLessonListDOM()
{
	return navbar.getElementsByClassName("h5");
}

function startDownload(index, url, direct=0, filename)
{

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback1(index, xmlHttp.responseText, direct, filename); break;
				
	}
	var preurl = "https://didattica.polito.it/portal/pls/portal/";
	
	xmlHttp.open("GET", preurl+url, true);
	xmlHttp.send(null);
}

function callback1(index, response, direct=0, filename)
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
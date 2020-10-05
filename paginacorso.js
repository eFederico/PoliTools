var imgsrc;

$(document).ready(function() { 

	var link = $(".RegionBorderMao > p > a").attr("href");
	startDownload(link, 1);

});

function startDownload(lin, direct=0)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			getPhoto(xmlHttp.responseText, direct);
	}
	
	xmlHttp.open("GET", lin, true); // true for asynchronous 
	xmlHttp.send(null);
}

function getPhoto(response, direct=0)
{
	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");
	
	remoteimg =  doc.querySelector("#tabs-1 > div:first-child > img");

	if (remoteimg != null) {

		var imgsrc = remoteimg.src;
		
		var img = '<img class="prof-img" width="150" src="'+imgsrc+'">'
		
		$(".RegionBorderMao > p").first().append(img);
	}
	
}
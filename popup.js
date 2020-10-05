navigate("home");

function navigate (path) {
	
	if (path == "home") {
		$(".back-arrow").hide();
	} else {
		$(".back-arrow").show();
	}

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			var data = JSON.parse(this.responseText);
			callback(data, path);
		}
	};
	xmlhttp.open("GET", chrome.runtime.getURL("/nav.json"), true);
	xmlhttp.send();

	function callback(data, path) {
		var contenuto = $(".contenuto");
		contenuto.attr("data", path);

		contenuto.empty();

		data = data["home"];
		
		var pagename = "PoliTools";

		if (path != "home") {
			var splitted = path.split("_");
			var j = 0;
			splitted.forEach(function(dir) {
				if (j != 0) {
					var a = parseInt(dir);
					data = data[a];
					pagename = data.name.it;
					data = data.contents
					
				}
				j++;
			});
			
		} 

		$('#cb-nav h3').html(pagename); 

		$.each(data, function(i, obj) {
			
			if (obj.type == "dir") {
				var row = `<div id="`+obj.file+`" class="row pt-btn">
								<div class="box" data="`+path+`_`+i+`">
									<div class="box-image"><img src="/immagini/`+obj.img+`" width="100%"></div>
									<div class="box-text"><p>`+obj.name.it+`</p></div>
								</div>
							</div>`;
				contenuto.append(row);
				$("#"+obj.file+" > .box").click(function() {
					navigate($(this).attr("data"));
				});
			} else if (obj.type == "theme") {
				var row = `<div id="`+obj.file+`" class="row">
								<div class="box theme col-xs-12">
									<div class="box-image col-xs-12" style="background-image: url('/immagini/`+obj.img+`');"><p>`+obj.name.it+`</p></div>
								</div>
							</div>`;
				contenuto.append(row);
				$("#"+obj.file+" > .box").click(function() {
					setTheme(obj.id);
				});
			} else if (obj.type == "option") {
				var row = `<div id="`+obj.file+`" class="row">
								<div class="box theme col-xs-12">
									<div class="box-text col-xs-12">`+obj.name.it+`</div>

								</div>
							</div>`;
				contenuto.append(row);
				$("#"+obj.file+" > .box").click(function() {
					
				});
			} else if (obj.type == "link") {
				var row = `<div id="`+obj.file+`" class="row">
								<div class="box theme col-xs-12">
									<p>`+obj.text+`</p>
									<a href="`+obj.link+`" target="_blank">`+obj.name.it+`</a>
								</div>
							</div>`;
				contenuto.append(row);
				$("#"+obj.file+" > .box").click(function() {
					
				});
			}	else if (obj.type == "text") {
				var row = `<div id="`+obj.file+`" class="row">
								<div class="col-xs-12">
									<p>`+obj.text+`</p>
								</div>
							</div>`;
				contenuto.append(row);
				
			} else if (obj.type == "font") {
				var row = `<div id="`+obj.file+`" class="row">
								<div class="box theme col-xs-12">
									<p class="border-bottom" style="font-size: 20px; font-family:`+obj.text+`;">`+obj.name.it+`</p>
								</div>
							</div>`;
				contenuto.append(row);
				$("#"+obj.file+" > .box").click(function() {
					setFont(obj.text);
				});
			}
		});
		

		/*

		var splitted = path.split("_");
		splitted.forEach(function(dir) {
			data = data[dir];
		});
		
		contenuto.empty();
		
		for(var k in data) {
			
			var row = `<div id="`+k+`" class="row">
							<div class="box col-xs-12" data="`+path+`_`+k+`">
								<div class="box-image col-xs-4"><img src="/immagini/theme.png" width="100%"></div>
								<div class="box-text col-xs-8"><p>`+k+`</p></div>
							</div>
						</div>`;

				
			contenuto.append(row);

			$("#"+k+" > .box").click(function() {
				navigate($(this).attr("data"));
			});
			
		}
		
		*/
	}
}


$(".back-arrow").click(function() {
	var currentpath = $(".contenuto").attr("data");
	var splitted = currentpath.split("_");

	var path = "";
	var i = 0;
	splitted.forEach(function(dir) {
		if (i < splitted.length - 1) {
			if (i == 0) 
				path = dir;
			else
				path = path+"_"+dir;
		}
		i++;
	});
	navigate(path);
	
	
});

function setTheme(i) {
	chrome.storage.local.set({'theme': i}, function() {
        console.log("New selected theme: " + i);
		
    });
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.reload(tabs[0].id);
	});
}

function getTheme() {
	chrome.storage.local.get(['theme'], function(result) {
        console.log('Value currently is ' + result.theme);
		
    });
}

function setFont(i) {
	chrome.storage.local.set({'font': i}, function() {
        console.log("New selected font: " + i);
		
    });
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.reload(tabs[0].id);
	});
}

function getFont() {
	chrome.storage.local.get(['font'], function(result) {
        console.log('Current font is ' + result.font);
		
    });
}
var exID = chrome.runtime.id;

async function getTheme() {

	chrome.storage.local.get(['theme'], function(result) {
        
        var cssFile;

        switch(result.theme) {

			case 0:
            cssFile = "default"; 
			break;

			case 1: 
			cssFile = "dark";
			
        }
        
        $('head').append(`<link rel="stylesheet" type="text/css" href="chrome-extension://`+exID+`/themes/`+cssFile+`.css">`);

    });
}

var fonts = `<style>
td,div,a,p,body {
	font-family: %font% !important;
}
</style>`;

async function getFont() {
	
	chrome.storage.local.get(['font'], function(result) {
		var font = result.font;
		if (font != "Default" && font != null) {
	   		console.log("Font:" + font);
		   $("html").append(fonts.replace("%font%", font)); 
		}
	});
}

getTheme();
getFont();

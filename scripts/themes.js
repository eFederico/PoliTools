let extensionBase = chrome.runtime.getURL("/");

async function getTheme() {
	chrome.storage.local.get(['theme'], function(result) {
		fetch(extensionBase + "themes/themes.json")
			.then(response => response.json())
  			.then(themes => { 
				  theme = themes.themes[result.theme];
				  
				  //Add custom css files
				  theme.css.forEach( cssFile => {
					customCss = "<link rel='stylesheet' type='text/css' href='" + extensionBase + "themes/" + theme.name + "/" + cssFile + "'/>";
					$('head').append(customCss);
				  });
				  
				  //Add custom js scripts
				  theme.js.forEach( jsFile => {
					customJs = "<script type='text/javascript' src='" + extensionBase + "themes/" + theme.name + "/js/" + jsFile + "'/>";
					$('head').append(customJs);
				  });

			  });
    });
}

let fonts = `<style>
				td,div,a,p,body {
				font-family: %font% !important;
				}
			</style>`;

async function getFont() {
	
	chrome.storage.local.get(['font'], function(result) {
		let font = result.font;
		if (font !== "Default" && font != null) {
	   		console.log("Font:" + font);
		   $("html").append(fonts.replace("%font%", font));
		}
	});
}

getTheme();
getFont();

chrome.runtime.onInstalled.addListener(function() {

	chrome.storage.local.get(['theme'], function(result) {
		if (result.theme === null) {
			chrome.storage.local.set({'theme': 0}, function() {
				console.log("New selected theme: " + 0);
			});
		}
	});

	//aggiungo listener per controllare cambiamenti su didattica.polito.it

	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'didattica.polito.it'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if( details.url === "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.main_js" ){
			return  {redirectUrl: chrome.extension.getURL("./lib/test.js") };
		}
		else if(details.url === "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.filenavigator_js")
		{
			return {redirectUrl: chrome.extension.getURL("./lib/sviluppo.filemgr.filenavigator_js") };
		}

	},
	{urls: ["*://*.polito.it/*.*"]},
	["blocking"]
);

chrome.runtime.onMessageExternal.addListener(
	function(request)
	{	
	  if (request.msg === "download_single_file") {
			let url = request.data;
		  	let name = request.name;

		  	chrome.downloads.download({
				url: url,
				filename: name
		  	});
	    }
	}
);

chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.msg === "PLS_DOWNLOAD") {
			let url = request.data.content;
			let filename = request.data.filename;
			chrome.downloads.download({
			  url: url,
			  filename: filename
			});
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.msg === "REDIRECT_AND_DOWNLOAD") {

			let url = request.data.content;
			let filename = request.data.filename;

			let xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function()
			{

				if (xmlHttp.readyState === 3) { // Attendo pagina pronta
					chrome.downloads.download({
						url: xmlHttp.responseURL,
						filename: filename
					});
					xmlHttp.abort(); // Download partito, chiudo pagina (PORCODIO)
				}
			}

			xmlHttp.open("GET", url, true);
			xmlHttp.send(null);

        }
    }
);

function forceDownload(blob, filename) {

	let a = document.createElement('a');
	a.download = filename;
	a.href = blob;
	document.body.appendChild(a);
	a.click();
	a.remove();

	console.log("Downloading: " + filename);
}

function downloadResource(url, filename) {
	if (!filename) filename = url.split('\\').pop().split('/').pop();

	fetch(url, {
		headers: new Headers({
			'Origin': location.origin
		}),
		mode: 'cors'
	})
		.then(response => response.blob())
		.then(blob => {
			let blobUrl = window.URL.createObjectURL(blob);
			forceDownload(blobUrl, filename);
		})
		.catch(e => console.error(e));
}

chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) 
	 {
	   if (request.msg === "zipAndDownloadAll") {

		   let tree = request.tree;
		   let el = findFirstFile(tree);
	   
		   if(el == null)
		   {
			   updateDownloadStatus(0);
			   return;
		   }
	   
		   manageSession(
		   {
			   code: el.code},
			   
			   function(statusok) {
				   if(statusok === "ok")
				   {
					   zipAndDownloadAll(tree);
				   }
				   else
				   {
					   updateDownloadStatus(0);
				   }
			   }
		   );
	   }
	 }
);

chrome.runtime.onConnectExternal.addListener(function(port) {
	
  if(port.name === "lalaland")
  {
	theport = port;
	port.onDisconnect.addListener(	
		function(event) {
			theport=null;
	});
  }

});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) 
  {
	if (request.msg === "getBinaryContent") {
		let url = request.url;
		
		let blob = null;
		let xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
		xhr.onload = function()
		{
			blob = xhr.response;
			console.log(blob);
			
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload =  function(e){
					console.log('DataURL:', e.target.result);
			};
			
			let bloburl =  (window.URL ? URL : webkitURL).createObjectURL(blob);
			console.log(bloburl);
			
			let response = {err: false, data:bloburl};
			console.log(response);
			sendResponse(response);
		}
		xhr.send();
		
		/*JSZipUtils.getBinaryContent(url, function (err, data) {
			console.log("rispondo: ");
			console.log(data);
			
			var binaryData = [];
			binaryData.push(data);

			var blob = new Blob(binaryData);
			console.log(blob);
			var bloburl =  (window.URL ? URL : webkitURL).createObjectURL(blob);
			
			
			
			
			var response = {err: err, data:datares};
			console.log(response);
			sendResponse(response);
		});*/
		return true;
	}
  }
);



function manageSession(testEl, callback)
{
	let size = testEl.size;
	let url = "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.handler?action=download&code="+testEl.code;
	
	let client = new XMLHttpRequest();
	client.overrideMimeType('application/xml');
	client.open("GET", url, true);
	
	client.send();
	
	let mode = 0; //1 try to session

	client.onreadystatechange = function() {
		if(this.readyState === this.HEADERS_RECEIVED ) {
		
			let resurl = client.responseURL;
			/*
			https://file.didattica.polito.it/download/MATDID/32837182
			https://idp.polito.it/idp/profile/SAML2/Redirect/SSO
			https://idp.polito.it/idp/x509mixed-login
			*/
			if(resurl.includes("://file.didattica.polito.it")) //Sessione didattica Ok, Sessione File Ok
			{
				client.abort();
				callback("ok");
				return;
			}
			else if(resurl.includes("://idp.polito.it/idp/profile")) //Sessione didattica Ok (?), Sessione File no
			{
				mode = 1;
			}
			else 
			{
				client.abort();
				chrome.tabs.create({ url: url });
				
				callback("ko");
				return;
			}
			
			console.log("res url:",client.responseURL);
		}
		
		if (mode === 1 && client.readyState === client.DONE && client.status === 200) {

			let xxml = client.responseXML;
			if(client.responseXML != null)
			{
				let lform = xxml.getElementsByTagName("form")[0]; //action page method post/get
				if(lform)
				{
					let hiddens = lform.getElementsByTagName("input");
					let req = "";
					console.log(hiddens);
					
					let i = 0;
					
					let datapost = new FormData();
					
					
					for (let entry of hiddens) {
						
						if(entry.type === "hidden")
						{
							if(i !== 0)
								req+="&";
							
							req += entry.name+"="+encodeURIComponent(entry.value);
							
							datapost.append(entry.name, entry.value);
							i++;
						}
						
					}

					let http = new XMLHttpRequest();
					let sessurl = lform.action;
					
					let params = req;
					http.open('POST', sessurl, true);

					//Send the proper header information along with the request
					http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					
					http.onreadystatechange = function() {
						if(http.readyState === http.HEADERS_RECEIVED)
						{
							if(http.status === 200)
							{
								callback("ok");
							}
							else
							{
								callback("ko");
								chrome.tabs.create({ url: url });
							}
							
							http.abort();

						}
					}
					http.send(req);
				}
			}
			else{
				chrome.tabs.create({ url: url });
				callback("ko");
			}
		}
		
	  }
}

function findFirstFile(list)
{	
	for (let i = 0, len = list.length; i < len; i++) {
		let el = list[i];
		
		if(el.type !== "dir")
		{
			return el;
		}
		else
		{
			let ret = findFirstFile(el.list);
			
			if(ret !== null)
				return ret;
		}
	}
	
	return null;
}

let theport = null;
let thetotal = 0;
let theended = 0;

function updateDownloadStatus(ds)
{
	let msg = {type: "downloadstatus", val: ds};
	theport.postMessage(msg);
}

function updateProgressBar(current_progress, string, type = 0)
{
	let msg = {type: "updateProgressBar", cs: current_progress, string: string, tt: type};
	theport.postMessage(msg);
}

function zipAndDownloadAll(tree)
{

	let zip = new JSZip();
	thetotal = 0;
	theended = 0;
	
	thetotal = countFileList(tree).count;
	
	let callb = function(){

		updateDownloadStatus(3);
		
		zip.generateAsync({type:'blob',compression: "STORE"}, function updateCallback(metadata) {

			updateProgressBar(metadata.percent.toFixed(2),"Zipping files... "+metadata.percent.toFixed(2)+"%",3);
		}).then(function(content) {
			
			const url = URL.createObjectURL(content);

			updateDownloadStatus(4);
			updateProgressBar(100,"Done",1);

			chrome.downloads.download({
				url: url,
				filename: "PoliTools.zip"
			});
			
		});
	}
	
	tree.forEach(function(el){
		recursive_download(zip,el,callb);
	});	
}
		
function countFileList(list)
{
	let count = 0;
	let size = 0;
	list.forEach(function(el){
		if(el.type !== "dir")
		{
			count++;
			size += el.size;
		}
		else
		{
			var re = countFileList(el.list);
			count += re.count;
			size += re.size;
		}
	});
	
	return {"count": count,"size": size};
}

function recursive_download(dirzip, elem, callback)
{
	if(elem.type !== 'dir')
	{
		let url = "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.handler?action=download&code="+elem.code;
		//var url = "https://file.didattica.polito.it/download/MATDID/"+elem.code;
		
		JSZipUtils.getBinaryContent(url, function (err, data) {
			
			let name = elem.name;
			
			if (typeof elem.nomefile !== 'undefined') //TODO dov'è questa variabile?
				name = elem.nomefile;
			
			dirzip.file(name, data, {binary:true});
			theended++;

			let perc = (theended/thetotal)*100;
			
			if(thetotal === theended)
			{
				callback();
				//updateProgressBar(101,"Wait for Zipping...");
			}
			else
			{
				updateProgressBar(perc,"Downloading: "+(parseInt(theended)+1)+" of "+thetotal,0);
			}
			
		});
		
		return;
	}

	let thiszipdir = dirzip.folder(elem.name);
	
	elem.list.forEach(function(el){
		recursive_download(thiszipdir,el,callback);
	});
}
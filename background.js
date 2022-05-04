let messagePort = null;
let thetotal = 0;
let theended = 0;

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(['theme'], function(result) {
        if (result.theme === null) {
            chrome.storage.local.set({'theme': 0}, function() {
                console.log("New selected theme: " + 0);
            });
        }
    });
});

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === "politools") {
        console.log("Connection received from content script.");
        messagePort = port;

        // Register global events to handle port messages and delete the port on disconnection.
        messagePort.onMessage.addListener(dispatchMessages);
        messagePort.onDisconnect.addListener(function(event) {messagePort=null;});
    }
});

// Send messages to the correct destination.
function dispatchMessages(msg) {
    switch(msg.msg) {
        case "background-log":
            console.log("[CONTENT SCRIPT] ", msg.data);
            break;
        case "zip-download-all":
            prepareDownloadSession(JSON.parse(msg.lst));
            break;
        case "download-file":
            chrome.downloads.download({
                url:      msg.data.content,
                filename: msg.data.filename.replaceAll("/", ".").replaceAll("\\", ".").replace(/[/\\?%*:|"<>]/g, '-'),
            });
            break;
        default:
            console.log("ERROR: Received message of unknown type '" + msg.msg + "'");
            break;
    }
}

function prepareDownloadSession(tree) {
    let el = findFirstFile(tree);
    if(el == null) {
        console.error("Failed to ZIP and Download selected files: no files present in selection!");
        updateDownloadStatus(0);
        return;
    }

    manageSession(
        {code: el.code},
        function(statusok) {
            if(statusok === "ok") {
                zipAndDownloadAll(tree);
            } else {
                console.error("Failed to ZIP and Download selected files: test download failed!");
                updateDownloadStatus(0);
            }
        }
    );
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.url === "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.main_js" ) {
            return  {redirectUrl: chrome.runtime.getURL("./lib/test.js") };
        } else if(details.url === "https://didattica.polito.it/pls/portal30/sviluppo.filemgr.filenavigator_js") {
            return {redirectUrl: chrome.runtime.getURL("./lib/sviluppo.filemgr.filenavigator.js") };
        }
    },
    {urls: ["*://*.polito.it/*.*"]},
    ["blocking", "requestBody"]
);

chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.msg === "REDIRECT_AND_DOWNLOAD") {

            let url = request.data.content;
            let filename = request.data.filename;

            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
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

function manageSession(testEl, callback) {
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
            else if(resurl.includes("://idp.polito.it/idp/profile")) { //Sessione didattica Ok (?), Sessione File no
                mode = 1;
            } else {
                client.abort();
                chrome.tabs.create({ url: url });

                console.error("ERROR: Unknown resource URL received: '" + resurl + "'")
                callback("ko");
                return;
            }
        }

        if(mode === 1 && client.readyState === client.DONE && client.status === 200) {
            let xxml = client.responseXML;
            if(client.responseXML != null) {
                let lform = xxml.getElementsByTagName("form")[0]; //action page method post/get
                if(lform) {
                    let hiddens = lform.getElementsByTagName("input");
                    let req = "";
                    console.log(hiddens);

                    let i = 0;

                    let datapost = new FormData();


                    for (let entry of hiddens) {
                        if(entry.type === "hidden") {
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
                        if(http.readyState === http.HEADERS_RECEIVED) {
                            if(http.status === 200) {
                                callback("ok");
                            } else {
                                callback("ko");
                                chrome.tabs.create({ url: url });
                            }

                            http.abort();
                        }
                    }
                    http.send(req);
                }
            } else {
                chrome.tabs.create({ url: url });
                callback("ko");
            }
        }

    }
}

function findFirstFile(list) {
    for (let i = 0, len = list.length; i < len; i++) {
        let el = list[i];

        if(el.type !== "dir") {
            return el;
        } else {
            let ret = findFirstFile(el.list);

            if(ret !== null)
                return ret;
        }
    }

    return null;
}

function updateDownloadStatus(value) {
    if(messagePort)
        messagePort.postMessage({dst: "window", dat:{msg: "download-progress", value}});
}

function updateProgressBar(progress, string, type = 0) {
    if(messagePort)
        messagePort.postMessage({dst: "window", dat:{msg: "download-status", progress, string, type}});
}

function zipAndDownloadAll(tree) {
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

    tree.forEach(function(el) {
        recursive_download(zip,el,callb);
    });
}

function countFileList(list) {
    let count = 0;
    let size = 0;
    list.forEach(function(el){
        if(el.type !== "dir") {
            count++;
            size += el.size;
        } else {
            let re = countFileList(el.list);
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

            if(thetotal === theended) {
                callback();
                //updateProgressBar(101,"Wait for Zipping...");
            } else {
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
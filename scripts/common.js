let PoliToolsPort  = chrome.runtime.connect({name: "politools"});
let PoliToolsDebug = true;

function extensionLog(msg) {
    if(PoliToolsDebug) {
        PoliToolsPort.postMessage({
            msg : "DEBUG_LOG",
            data: msg
        });
    }
}
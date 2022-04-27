let PoliToolsPort  = chrome.runtime.connect({name: "politools"});
let PoliToolsDebug = true;

// Allow content scripts to console.log to the extension's console.
function extensionLog(msg) {
    if(PoliToolsDebug) {
        PoliToolsPort.postMessage({
            msg: "background-log",
            str: msg
        });
    }
}

// Listen for messages coming from the page.
window.addEventListener("message", function(event) {
    // Only allow messages if they are from the same window and contain both destination and data fields.
    if(event.source != window || !event.data.dst || !event.data.dat)
        return;

    switch(event.data.dst) {
        case "background-script":
            PoliToolsPort.postMessage(event.data.dat);
            break;
        case "background-log":
            if(event.data.str)
                extensionLog(event.data.str);
            else
                extensionLog("Received malformed message from page.");
            break;
        default:
            extensionLog("Received malformed message from page.");
    }
});

// Listen for messages coming from the background script
PoliToolsPort.onMessage.addListener(function(msg) {
    if(!msg.dst) {
        extensionLog("Received message from background script but no destination was specified.");
        return;
    }

    switch(msg.dst) {
        case "window":
            window.postMessage(msg.dat);
            break;
        default:
            extensionLog("Received message from background script but no destination matches '" + msg.dst + "'.");
    }
});
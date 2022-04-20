function isNotices() {
    return $("#nav_menu li:nth-child(3).active").length
}

function isGuide() {
    return $("#nav_menu li:nth-child(4).active").length
}

function isMaterial() {
    return $("#nav_menu li:nth-child(5).active").length
}

function isForum() {
    return $("#nav_menu li:nth-child(6).active").length
}

function isAssignments() {
    return $("#nav_menu li:nth-child(7).active").length
}

function isVideo() {
    return $("#nav_menu li:nth-child(8).active").length
}

// Handle download status messages.
PoliToolsPort.onMessage.addListener(function(msg)
{
    let container = document.getElementById("dynamic-container");
    let button    = document.getElementById("button_download_selected");

    if(msg.type === "downloadstatus") {
        extensionLog("Download status: " + msg.val + "")

        container.style.display = (msg.val != 0 && msg.val != 4) ? 'block' : 'none';
        button.style.display    = (msg.val != 0 && msg.val != 4) ? 'none'  : 'inline-block';
    } else if(msg.type === "updateProgressBar") {
        extensionLog("Progress status: [" + msg.cs + "% - " + statuses[msg.type] + ".")
        
        let dynamic = document.getElementById("dynamic");
        let statuses = ['success', 'info', 'danger', 'warning'];

        dynamic.setAttribute('aria-valuenow', msg.cs);
        dynamic.style.width = msg.cs + '%';
        dynamic.innerText   = msg.string;
        dynamic.className.replace("progress-bar-[a-z]+", "progress-bar-" + statuses[msg.type]);
    }
});
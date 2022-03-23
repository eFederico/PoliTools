// If running in Firefox, set up the handlers that the background script will use to communicate to the page the
// download status of the current download.
if(typeof chrome != "undefined" && typeof browser != "undefined") {
    let port = browser.runtime.connect({name: "firefoxland"});

    port.onMessage.addListener(function(msg)
    {
        if(msg.type === "downloadstatus")
        {
            if(msg.val != 0 && msg.val != 4) {
                document.getElementById("dynamic-container")
                    .setAttribute('style', 'margin-bottom: 0');
                document.getElementById("button_download_selected")
                    .setAttribute('style', 'margin-bottom: 0; display: none');
            } else {
                document.getElementById("dynamic-container")
                    .setAttribute('style', 'margin-bottom: 0; display: none');
                document.getElementById("button_download_selected")
                    .setAttribute('style', 'margin-bottom: 0');
            }
        }
        else if(msg.type === "updateProgressBar")
        {
            var dynamic = document.getElementById("dynamic");

            dynamic.setAttribute('style', 'width: ' + msg.cs + '%');
            dynamic.setAttribute('aria-valuenow', msg.cs);
            dynamic.innerText = msg.string;

            switch(type) {
                case 0:
                    dynamic.classList.remove("progress-bar-danger");
                    dynamic.classList.remove("progress-bar-info");
                    dynamic.classList.remove("progress-bar-warning");
                    dynamic.classList.add("progress-bar-success");
                    break;
                case 1:
                    dynamic.classList.remove("progress-bar-danger");
                    dynamic.classList.remove("progress-bar-success");
                    dynamic.classList.remove("progress-bar-warning");
                    dynamic.classList.add("progress-bar-info");
                    break;
                case 2:
                    dynamic.classList.remove("progress-bar-success");
                    dynamic.classList.remove("progress-bar-info");
                    dynamic.classList.remove("progress-bar-warning");
                    dynamic.classList.add("progress-bar-danger");
                    break;
                case 3:
                    dynamic.classList.remove("progress-bar-success");
                    dynamic.classList.remove("progress-bar-info");
                    dynamic.classList.remove("progress-bar-danger");
                    dynamic.classList.add("progress-bar-warning");
                    break;
            }
        }
    });
}

$(function() {
    
});

function isMaterial() {
    return $("#nav_menu li:nth-child(5).active").length
}

function isNotices() {
    return $("#nav_menu li:nth-child(1).active").length
}
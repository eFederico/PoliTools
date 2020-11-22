const wait = t => new Promise(resolve => setTimeout(resolve, t));

$(document).ready(function() {

    if (!isConverted(document)) {
        fullScreen();
    }

});

async function fullScreen() {

    let i = 0;
    let fullscreenOld;
    let iframe = document.querySelector("iframe");

    if (iframe != null) {
        iframe.allowFullscreen = true;
        iframe.src = iframe.src;
    }

    do {
        await wait(1000);
        fullscreenOld = document.querySelector(".fullscreen-button button");
        i++;
    } while (fullscreenOld === null && i < 5);

    if (fullscreenOld != null) {
        let fullscreen = fullscreenOld.cloneNode(true); // Remove event listeners
        fullscreenOld.replaceWith(fullscreen);

        fullscreen.addEventListener("click", (e) => {
            e.preventDefault();

            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.body.requestFullscreen();
            }
        }, false);
    }


}

function isConverted(doc) {

    return doc.getElementById("videoPlayer") != null;
}


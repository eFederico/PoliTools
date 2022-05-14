(function () {
    //Use loader during page style modification
    //setLoader();
    //Prevent overload of Portale della Didattica server
    darkUnderline();
})();

// create a loader that catches jquery errors so other scripts using jquery can run
// TODO: catch errors
function setLoader() {
    const body = document.getElementsByTagName('body')[0];
    const loader = document.createElement("div");
    loader.setAttribute("id", "loading_poliTools");
    const loaderImg = document.createElement("img");
    loaderImg.setAttribute("id", "loading-image");
    loaderImg.setAttribute("alt", "Loading");
    loaderImg.setAttribute("src", "https://didattica.polito.it/img/logo_poli/logo_poli_bianco_260.png");
    loader.appendChild(loaderImg);
    
    if(body !== undefined){
        body.appendChild(loader);
    }

}

function unsetLoader() {
    $('#loading_poliTools').hide();
}

function darkUnderline(){
    Array.from(document.getElementsByTagName('span'))
    .forEach( p => 
        {   
            if(p.style.backgroundColor !== undefined)
                p.style.backgroundColor = "transparent";

            if(p.style.color !== "white"){
                p.style.color = "white";
            }
        });
}

function setNews() {
    
}
$(function() {

    if (isNotices()) {

        Array.from(document.getElementsByTagName('span'))
        .forEach( p => 
            {
                
                if(p.style.backgroundColor != "undefined") 
                    p.style.backgroundColor = "transparent";

                if(p.style.color != "white"){
                    //p.style.color = "white"; Da modificare con un flag sul tema
                }

            });

    }

    

});

function isMaterial() {
    return $("#nav_menu li:nth-child(5).active").length
}

function isNotices() {
    return $("#nav_menu li:nth-child(1).active").length
}
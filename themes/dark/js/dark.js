$(function() {

    //Remove underline in dark theme
    darkUnderline();
    
});

function darkUnderline(){
    Array.from(document.getElementsByTagName('span'))
    .forEach( p => 
        {   
            if(p.style.backgroundColor != "undefined") 
                p.style.backgroundColor = "transparent";

            if(p.style.color != "white"){
                p.style.color = "white"; 
            }
        });
}

$(document).ready(function() { 

  insertSlider();
  manageHotkeys();

});

const wait = t => new Promise(resolve => setTimeout(resolve, t));

if (document.fullscreenEnabled) main();

async function main() {
  do {
    await wait(1000);
    var $fullscreenOld = document.querySelector(".acorn-fullscreen-button");
  } while ($fullscreenOld === null);

  let $fullscreen = $fullscreenOld.cloneNode(true); // Remove event listeners
  $fullscreenOld.replaceWith($fullscreen);

  $fullscreen.addEventListener("click", (e) => {
    e.preventDefault();

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }, false);
}


function insertSlider() {
    var slider = `<div style="float:right; width:30%;">
                    <div class="range-slider" style="border: none; background:transparent; margin: 0.65rem 0">
                      <div style="width: 70%; float:left;">
                        <input class="range-slider__range" type="range" value="1.0" min="0.1" max="2.5" step="0.1" style="width: 100% !important;">
                      </div>
                      <div style="width:20%; float:right;">
                        <span class="range-slider__value col-md-1" style="width: 100%;">1</span>
                      </div>
                    </div>
                  </div>`;
    $("#navbar").append(slider);

    $("#recording-title").attr("style", "float:left");

    document.querySelector(".range-slider__range").addEventListener("change", function(){

      document.querySelector("#video.webcam").playbackRate = document.querySelector(".range-slider__value").innerHTML;
    });
    rangeSlider();
}

var rangeSlider = function(){
    var slider = $('.range-slider'),
    range = $('.range-slider__range'),
    value = $('.range-slider__value');
    
 	  slider.each(function(){

      value.each(function(){
        var value = $('.range-slider__range').attr('value');
        $(this).html(value);
      
      });

      range.on('input', function(){
        $('.range-slider__value').html(this.value);
      });
    });
};

function manageHotkeys(){
  document.addEventListener('keyup', function (e){

      if(e.defaultPrevented){
          return;
      }

      var key = e.key || e.keyCode;
      var video = document.querySelector("#video.webcam");
      
      if(video.playbackRate < 2.5 && (key === 'K' || key === 'k' || key === 75)){ //Accelero
  
        video.playbackRate += 0.1;
      } else if(video.playbackRate > 0.1 && (key === 'J' || key === 'j' || key === 74)){ //Decellero
      
        video.playbackRate -= 0.1;
      } else if(key === 'L' || key === 'l' || key === 76){ //Reset
        
        video.playbackRate = 1.0;
      }
      document.querySelector(".range-slider__value").innerHTML = video.playbackRate.toFixed(1);
      document.querySelector(".range-slider__range").value = video.playbackRate.toFixed(1);
  });
}
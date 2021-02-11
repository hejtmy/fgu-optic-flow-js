//based on an Example by @curran
window.requestAnimFrame = (function(){return  window.requestAnimationFrame})();
var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

var numStars = 300;
var radius = '0.'+ Math.floor(Math.random() * 9) + 1;
var focalLength = canvas.width *2;
var warp = 0;
var centerX, centerY;
var speed = 5000;
var starSize = 5;

var random = false;

var stars = [], star;
var i;

var animate = true;

const arduinoController = new ArduinoController();

initializeStars();

function executeFrame(){
    if(!animate) return;
    requestAnimFrame(executeFrame);
    moveStars();
    drawStars();
}

function initializeStars(){
    arduinoController.blink();

  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  
  stars = [];
  for(i = 0; i < numStars; i++){
    star = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      o: '0.'+ Math.floor(Math.random() * 99) + 1,
      dir_x: (Math.random() * canvas.width - canvas.width/2)/speed,
      dir_y: (Math.random() * canvas.height - canvas.height/2)/speed,
    };
    stars.push(star);
  }
}

function moveStars(){
    if(random){
        for(i = 0; i < numStars; i++){
            star = stars[i];
            star.x += star.dir_x;
            star.y += star.dir_y;
        }
    } else {
        for(i = 0; i < numStars; i++){
            star = stars[i];
            star.z--;

            if(star.z <= 0){
            star.z = canvas.width;
            }
        }
        }
}

function drawCentralCross(context, canvas, thickness = 5, length = 40){
    // vertical
    context.fillStyle = "#FF0000";
    context.fillRect(canvas.width/2 - length/2, canvas.height/2 - thickness/2, length, thickness);
    // horizontal
    context.fillStyle = "#FF0000";
    context.fillRect(canvas.width/2-thickness/2, canvas.height/2 - (length/2), thickness, length);
}

function drawStars(){
  var pixelX, pixelY, pixelRadius;
  
    //TODO - change to ONwindowsResuze
    // Resize to the screen - change to ON 
    if(canvas.width != window.innerWidth || canvas.width != window.innerWidth){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
    }
    if(warp == 0){
      c.fillStyle = "rgba(0,10,20,1)";
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
    c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
    if(random){
        for(i = 0; i < numStars; i++){
            star = stars[i];
            pixelX = star.x;
            pixelY = star.y
            pixelRadius = starSize;
            c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
            c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
        }
    } else {
        for(i = 0; i < numStars; i++){
            star = stars[i];
            pixelX = (star.x - centerX) * (focalLength / star.z);
            pixelX += centerX;
            pixelY = (star.y - centerY) * (focalLength / star.z);
            pixelY += centerY;
            pixelRadius = starSize * (focalLength / star.z);
            c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
            c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
        }
    }
    drawCentralCross(c, canvas);
}

document.getElementById('trace').addEventListener("click", function(e){
    window.warp = window.warp==1 ? 0 : 1;
    initializeStars();
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('random').addEventListener("click", function(e){
    window.random = window.random ? false : true;
    initializeStars();
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('arduino-connect-btn').addEventListener("click", function(e){
   arduinoController.connect();
})

executeFrame();

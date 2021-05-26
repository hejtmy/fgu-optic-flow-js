const FlowDirection = Object.freeze({
    "radialin":0,
    "radialout":1,
    "horizontalleft":2,
    "horizontalright":3,
    "random":4
})

let OpticFlowSettings = {
    CurrentFlowDirection: FlowDirection.radialin,
}

//based on an Example by @curran
window.requestAnimFrame = (function(){return  window.requestAnimationFrame})();
var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

var numStars = 300;
let radius = '0.'+ Math.floor(Math.random() * 9) + 1;
let focalLength = canvas.width *2;
let warp = 0;
var centerX, centerY;
var speed = 5000;
var starSize = 5;

let stars = [], star;
var i;

var animate = true;

const arduinoController = new ArduinoController();

stars = initializeStars();

function executeFrame(){
    if(!animate) return;
    requestAnimFrame(executeFrame);
    moveStars(stars);
    drawStars(stars);
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
  return stars;
}

function moveStars(stars){
    switch(OpticFlowSettings.CurrentFlowDirection){
        case FlowDirection.radialin:
            stars = moveRadial(stars);
        case FlowDirection.random:
            stars = moveRandom(stars);
        case FlowDirection.horizontalright:
            stars = moveHorizontal(stars);
    }
}

function moveRandom(stars){
    for(i = 0; i < stars.length; i++){
        star = stars[i];
        star.x += star.dir_x;
        star.y += star.dir_y;
    }
    return stars;
}

function moveHorizontal(stars){

}

function moveRadial(stars){
    for(i = 0; i < stars.length; i++){
        star = stars[i];
        star.z--;
        if(star.z <= 0){
            star.z = canvas.width;
        }
    }
    return stars;
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
    switch(OpticFlowSettings.CurrentFlowDirection){
        case FlowDirection.random:
            drawRandom(stars);
        case FlowDirection.radialin:
            drawRadial(stars);
    }
    drawCentralCross(c, canvas);
}

function drawRadial(stars){
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

function drawHorizontal(){

}

function drawRandom(stars){
    for(i = 0; i < numStars; i++){
        star = stars[i];
        pixelX = star.x;
        pixelY = star.y
        pixelRadius = starSize;
        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
    }
}

// BUTTONS -------------------

document.getElementById('trace').addEventListener("click", function(e){
    window.warp = window.warp==1 ? 0 : 1;
    initializeStars();
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('random').addEventListener("click", function(e){
    OpticFlowSettings.CurrentFlowDirection = OpticFlowSettings.CurrentFlowDirection == FlowDirection.random ? FlowDirection.radialin : FlowDirection.random;
    initializeStars();
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('arduino-connect-btn').addEventListener("click", function(e){
   arduinoController.connect();
})

// EXECUTE ----------------------
//execute frame loops on itself
executeFrame();

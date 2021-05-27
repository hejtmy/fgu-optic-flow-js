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

var depth = 2000;

var numStars = 300;
var radius = '0.'+ Math.floor(Math.random() * 9) + 1;
var focalLength = canvas.width * 2;
var warp = 0;
var centerX, centerY;
var speed=  5;
var horizontalSpeed = 1;
var depthSpeed = 5;
var starSize = 5;

var stars = [], star;
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
      z: Math.random() * depth,
      o: '0.'+ Math.floor(Math.random() * 99) + 1,
      dir_x: (Math.random() + 0.1) * horizontalSpeed,
      dir_y: (Math.random() + 0.1) * horizontalSpeed
    };
    stars.push(star);
  }
  return stars;
}

function moveStars(stars){
    switch(OpticFlowSettings.CurrentFlowDirection){
        case FlowDirection.radialin:
        case FlowDirection.radialout:
            stars = moveRadial(stars, OpticFlowSettings.CurrentFlowDirection);
            break;
        case FlowDirection.random:
            stars = moveRandom(stars);
            break;
        case FlowDirection.horizontalright:
        case FlowDirection.horizontalleft:
            stars = moveHorizontal(stars, OpticFlowSettings.CurrentFlowDirection);
            break;
    }
}

function moveRandom(stars){
    for(i = 0; i < stars.length; i++){
        star = stars[i];
        star.x += star.dir_x;
        star.y += star.dir_y;
        star = keepStarInCanvas(star);
        stars[i] = star;
    }
    return stars;
}

function moveHorizontal(stars, direction){
    for(i = 0; i < stars.length; i++){
        var star = stars[i];
        star.x += (((direction == FlowDirection.horizontalleft)*2)-1) * Math.abs(star.dir_x);
        stars[i] = keepStarInCanvas(star);
    }
    return stars;
}

function keepStarInCanvas(star){
    if(star.x < 0){star.x = canvas.width;}
    if(star.x > canvas.width){star.x = 0;}
    if(star.y < 0){star.y = canvas.height;}
    if(star.y > canvas.height){star.y = 0;}
    return star;
}

function moveRadial(stars, direction){
    for(i = 0; i < stars.length; i++){
        var star = stars[i];
        star.z = ((direction == FlowDirection.radialin)*2-1) * speed;
        if(star.z <= 0 || star.z >= depth){
            star.z = 0;
        }
        stars[i] = star;
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
            drawStars2(stars);
            break;
        case FlowDirection.radialin:
        case FlowDirection.radialout:
            drawRadial(stars);
            break;
        case FlowDirection.horizontalleft:
        case FlowDirection.horizontalright:
            drawStars2(stars);
            break;

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

function drawStars2(stars){
    for(i = 0; i < stars.length; i++){
        var star = stars[i];
        var pixelRadius = starSize * ((depth - star.z) / depth);
        c.fillRect(star.x, star.y, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
    }
}

function drawHorizontal(){

}
// BUTTONS -------------------

document.getElementById('trace').addEventListener("click", function(e){
    window.warp = window.warp == 1 ? 0 : 1;
    initializeStars();
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('random').addEventListener("click", function(e){
    OpticFlowSettings.CurrentFlowDirection += 1;
    if(OpticFlowSettings.CurrentFlowDirection > 4) OpticFlowSettings.CurrentFlowDirection = 0;
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('arduino-connect-btn').addEventListener("click", function(e){
   arduinoController.connect();
})

// EXECUTE ----------------------
//execute frame loops on itself
executeFrame();

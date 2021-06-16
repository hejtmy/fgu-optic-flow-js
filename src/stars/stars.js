//DEFINITIONS ----

//const Stars = function(){

var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

var depth = 2000;

var numStars = 500;
var radius = '0.'+ Math.floor(Math.random() * 9) + 1;
var focalLength = canvas.width * 2;
var warp = 0;
var centerX, centerY;
var speed = 5;
var horizontalSpeed = 0.3;
var depthSpeed = 1;
var starSize = 10;

var stars = [], star;
var i;

var lastTime, deltaTime;
var animate = true;

const arduinoController = new ArduinoController();

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

const centralArea = {
    width:150,
    height:150
}

window.requestAnimFrame = (() => {
    return window.requestAnimationFrame
})();

// EXECUTION -----
stars = initializeStars();

function executeFrame(){
    if(!animate) return;
    requestAnimFrame(executeFrame);
    var t = Date.now();
    deltaTime = t-lastTime;
    lastTime = t;
    moveStars(stars);
    drawStars(stars);
}

function initializeStars(){
  arduinoController.blink();

  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  
  stars = [];
    for(i = 0; i < numStars; i++){
        var directionAngle = Math.random()*2*Math.PI;
        star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: (Math.random()*0.5+0.5) * depth,
            o: 20, //'0.'+ Math.floor(Math.random() * 99) + 1,
            dir_x: Math.sin(directionAngle),
            dir_y: Math.cos(directionAngle),
            dir_z: (Math.random() * 2) - 1,
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
        star.x += star.dir_x * horizontalSpeed * deltaTime * (1-(star.z/depth));
        star.y += star.dir_y * horizontalSpeed * deltaTime * (1-(star.z/depth));
        star.z += star.dir_z * depthSpeed * deltaTime;
        star = keepStarInCanvas(star);
        stars[i] = star;
    }
    return stars;
}

function moveHorizontal(stars, direction){
    for(i = 0; i < stars.length; i++){
        var star = stars[i];
        star.x += (((direction == FlowDirection.horizontalleft)*2)-1) * (1-(star.z/depth)) * horizontalSpeed * deltaTime;
        stars[i] = keepStarInCanvas(star);
    }
    return stars;
}

function keepStarInCanvas(star){
    if(star.x < 0){star.x = canvas.width;}
    if(star.x > canvas.width){star.x = 0;}
    if(star.y < 0){star.y = canvas.height;}
    if(star.y > canvas.height){star.y = 0;}
    if(star.z > depth){resetStar(star, 0, 0.8);}
    if(star.z < 0){resetStar(star, 0.2, 1.0);}
    return star;
}

function moveRadial(stars, direction){
    for(i = 0; i < stars.length; i++){
        var sign = ((direction == FlowDirection.radialin)*2-1);
        var star = stars[i];
        star.z += sign * depthSpeed*deltaTime;
        star.x -= sign * (star.x - centerX)*(depthSpeed/depth)*deltaTime;
        star.y -= sign * (star.y - centerY)*(depthSpeed/depth)*deltaTime;
        if(star.z > depth || star.z < 0 || star.y < 0 || star.x < 0 || star.y > canvas.height || star.x > canvas.width){
            if(sign > 0) { 
                resetStar(star, 0, 0.8);
            } else {
                resetStar(star, 0.2, 1.0);
            }
        }
        stars[i] = star;
    }
    return stars;
}

function resetStar(star, zmin, zmax){
    star.z = (Math.random()*(zmax-zmin) + zmin) * depth,
    star.x = Math.random() * canvas.width;
    star.y = Math.random() * canvas.height
    return(star)
}

function drawCentralCross(context, canvas, thickness = 5, length = 40){
    // vertical
    context.fillStyle = "#000000";
    context.fillRect(canvas.width/2 - centralArea.width/2, canvas.height/2 - centralArea.height/2, centralArea.width, centralArea.height);
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
    //c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
    drawStars2(stars);
    drawCentralCross(c, canvas);
}

function drawStars2(stars){
    for(i = 0; i < stars.length; i++){
        var star = stars[i];
        var pixelRadius = starSize * ((depth - star.z) / depth);
        c.fillRect(star.x, star.y, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
    }
}
//}

// EXECUTE ----------------------
//execute frame loops on itself
executeFrame();

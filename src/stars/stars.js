//DEFINITIONS ----
const FlowDirection = Object.freeze({
    "radialin": 0,
    "radialout": 1,
    "horizontalleft": 2,
    "horizontalright": 3,
    "random": 4
})

const StarsController = {

canvas: null,
c: null,
depth: 2000,
numStars: 500,
radius: '0.'+ Math.floor(Math.random() * 9) + 1,
focalLength: null,
warp: 0,
centerX:null,
centerY:null,
speed: 5,
horizontalSpeed: 0.3,
depthSpeed: 0.75,
starSize: 10,
stars: [], 
lastTime:null,
deltaTime: null,
animate: true,
window:null,

arduinoController: new ArduinoController(),

OpticFlowSettings: {
    CurrentFlowDirection: FlowDirection.radialin,
},

centralArea: {
    width:150,
    height:150
},

// EXECUTION -----

initialize: function(canvas){
    this.canvas = canvas;
    this.c = canvas.getContext('2d');
    this.focalLength = canvas.width * 2;
    this.window = window;
    this.stars = this.initializeStars(canvas);
},

start: function(){
    this.animate = true;
    this.executeFrame();
},

stop : function(){
    this.animate = false;
},

executeFrame: function(){
    if(!this.animate) return;
    var t = Date.now();
    this.deltaTime = t - this.lastTime;
    this.lastTime = t;
    this.moveStars(this.stars);
    this.drawStars(this.stars);
    //https://stackoverflow.com/questions/19459449/running-requestanimationframe-from-within-a-new-object
    this.window.requestAnimationFrame(this.executeFrame.bind(this));
},

initializeStars: function(canvas){
    this.arduinoController.blink();

    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    
    let stars = [];
    for(var i = 0; i < this.numStars; i++){
        var directionAngle = Math.random() * 2 * Math.PI;
        var star = {
            o: 20, //'0.'+ Math.floor(Math.random() * 99) + 1,
            dir_x: Math.sin(directionAngle),
            dir_y: Math.cos(directionAngle),
            dir_z: (Math.random() * 2) - 1,
        }
        this.resetStar(star, 0, 1, canvas);
        stars.push(star);
  }
  return stars;
},

setFlowDirection: function(flowDirection){
    if(flowDirection > 4 || flowDirection < 0){
        flowDirection = 0;
    }
    this.OpticFlowSettings.CurrentFlowDirection = flowDirection;
},

moveStars: function(stars){
    switch(this.OpticFlowSettings.CurrentFlowDirection){
        case FlowDirection.radialin:
        case FlowDirection.radialout:
            this.stars = this.moveRadial(stars, this.OpticFlowSettings.CurrentFlowDirection);
            break;
        case FlowDirection.random:
            this.stars = this.moveRandom(stars);
            break;
        case FlowDirection.horizontalright:
        case FlowDirection.horizontalleft:
            this.stars = this.moveHorizontal(stars, this.OpticFlowSettings.CurrentFlowDirection);
            break;
    }
},

moveRandom: function(stars){
    for(var i = 0; i < stars.length; i++){
        var star = stars[i];
        star.x += star.dir_x * this.horizontalSpeed * this.deltaTime * (1-(star.z/this.depth));
        star.y += star.dir_y * this.horizontalSpeed * this.deltaTime * (1-(star.z/this.depth));
        star.z += star.dir_z * this.depthSpeed * this.deltaTime;
        star = this.keepStarInCanvas(star);
        stars[i] = star;
    }
    return stars;
},

moveHorizontal: function(stars, direction){
    for(var i = 0; i < stars.length; i++){
        var star = stars[i];
        star.x += (((direction == FlowDirection.horizontalleft)*2)-1) * (1-(star.z/this.depth)) * this.horizontalSpeed * this.deltaTime;
        stars[i] = this.keepStarInCanvas(star);
    }
    return stars;
},

keepStarInCanvas: function(star){
    if(star.x < 0){star.x = this.canvas.width;}
    if(star.x > this.canvas.width){star.x = 0;}
    if(star.y < 0){star.y = this.canvas.height;}
    if(star.y > this.canvas.height){star.y = 0;}
    if(star.z > this.depth) this.resetStar(star, 0, 0.8, this.canvas);
    if(star.z < 0) this.resetStar(star, 0.2, 1.0, this.canvas);
    return star;
},

moveRadial: function(stars, direction){
    for(var i = 0; i < stars.length; i++){
        var sign = ((direction == FlowDirection.radialin)*2 - 1);
        var star = stars[i];
        star.z += sign * this.depthSpeed*this.deltaTime;
        star.x -= sign * (star.x - this.centerX)*(this.depthSpeed/this.depth)*this.deltaTime;
        star.y -= sign * (star.y - this.centerY)*(this.depthSpeed/this.depth)*this.deltaTime;
        if(star.z > this.depth || star.z < 0 || star.y < 0 || star.x < 0 || star.y > this.canvas.height || star.x > this.canvas.width){
            if(sign > 0) { 
                this.resetStar(star, 0, 0.8, this.canvas);
            } else {
                this.resetStar(star, 0.2, 1.0, this.canvas);
            }
        }
        stars[i] = star;
    }
    return stars;
},

resetStar: function(star, zmin, zmax, canvas){
    star.z = (Math.random()*(zmax-zmin) + zmin) * this.depth,
    star.x = Math.random() * canvas.width;
    star.y = Math.random() * canvas.height
    return(star)
},

drawCentralCross: function(context, canvas, centralArea, thickness = 5, length = 40){
    // vertical
    context.fillStyle = "#000000";
    context.fillRect(canvas.width/2 - centralArea.width/2, canvas.height/2 - centralArea.height/2, centralArea.width, centralArea.height);
    context.fillStyle = "#FF0000";
    context.fillRect(canvas.width/2 - length/2, canvas.height/2 - thickness/2, length, thickness);
    // horizontal
    context.fillStyle = "#FF0000";
    context.fillRect(canvas.width/2-thickness/2, canvas.height/2 - (length/2), thickness, length);
},

drawStars: function(){
    // TODO - change to ONwindowsResuze
    // Resize to the screen - change to ON 
    if(this.canvas.width != window.innerWidth || this.canvas.width != window.innerWidth){
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.stars = this.initializeStars(this.canvas);
    }
    if(this.warp == 0){
        this.c.fillStyle = "rgba(0,10,20,1)";
        this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    //c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
    this.drawStars2(this.stars, this.depth, this.starSize);
    this.drawCentralCross(this.c, this.canvas, this.centralArea);
},

drawStars2: function(stars, spaceDepth, starSize){
    for(var i = 0; i < stars.length; i++){
        var star = stars[i];
        var pixelRadius = starSize * ((spaceDepth - star.z) / spaceDepth);
        this.c.fillRect(star.x, star.y, pixelRadius, pixelRadius);
        this.c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
    }
}
}

// EXECUTE ----------------------
//execute frame loops on itself
//executeFrame();

export {FlowDirection, StarsController};
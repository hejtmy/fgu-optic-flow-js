import { StarsController } from '../stars/stars.js';

let starsController = Object.create(StarsController);

var canvas = document.getElementById("space");
let experimentWindow = document.getElementById("experiment");

// BUTTONS -------------------
window.addEventListener('resize', function(event) {
    starsController.resize();
}, true);

// Start stop -----
document.getElementById('btn-startstop').addEventListener('click', function(event){
    if(starsController.isRunning()){
        starsController.stop();
    } else {
        starsController.start();
    }
})

// Blinking -----
document.getElementById('btn-blink').addEventListener('click', function(e){
    let startTime = new Date().getTime();
    starsController.blink(200, () => {
        let finishTime = new Date().getTime();
        console.log(finishTime - startTime);
    });
})

// Showing hiding ------
document.getElementById('btn-showhide').addEventListener('click', function(e){
    if(starsController.hidden){
        starsController.show();
    } else {
        starsController.hide();
    }
})

// Message showing  --------
document.getElementById('btn-message').addEventListener('click', function(e){
    starsController.showMessage("MESSAGE");
})

// Selecting movement ---------

// if a button inside element btn-group-movement is clicked display console message
document.getElementById('btn-group-movement').addEventListener('click', function(e){
    console.log(e.target.innerHTML);
    starsController.setFlowDirection(Number(e.target.value));
})

//selectMovement.addEventListener("change", function(event){
//})
// FUNCTIONS ---------------

// INITIALIZATION -----------

document['starsController'] = starsController;
starsController.initialize(canvas, window);
starsController.start();
starsController.resize();
starsController.setFlowDirection(0);
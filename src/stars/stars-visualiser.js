import { StarsController } from './stars.js';
import basesettings from './settings/basesettings.js';

let starsController = Object.create(StarsController);

var canvas = document.getElementById("space");
let experimentWindow = document.getElementById("experiment");

let selectMovement = document.getElementById('select-movement');
let btnStartStop = document.getElementById('btn-startstop');
let btnBlink = document.getElementById('btn-blink');

// BUTTONS -------------------

window.addEventListener('resize', function(event) {
    starsController.resize();
}, true);

btnStartStop.addEventListener('click', function(event){
    if(starsController.isRunning()){
        starsController.stop();
    } else {
        starsController.start();
    }
})

btnBlink.addEventListener('click', function(e){
    let startTime = new Date().getTime();
    starsController.blink(200, () => {
        let finishTime = new Date().getTime();
        console.log(finishTime - startTime);
    });
})

selectMovement.addEventListener("change", function(event){
    starsController.setFlowDirection(Number(selectMovement.value));
})
// FUNCTIONS ---------------

// INITIALIZATION -----------

document['starsController'] = starsController;

starsController.initialize(canvas, window);
starsController.start();
starsController.resize();
starsController.setFlowDirection(0);
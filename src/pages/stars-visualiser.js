import { StarsController } from '../stars/stars.js';
import basesettings from '../stars/settings/basesettings.js';

let starsController = Object.create(StarsController);

var canvas = document.getElementById("space");
let experimentWindow = document.getElementById("experiment");

let selectMovement = document.getElementById('select-movement');
let btnStartStop = document.getElementById('btn-startstop');
let btnBlink = document.getElementById('btn-blink');
let btnShowHide = document.getElementById('btn-showhide');
let btnMessage = document.getElementById('btn-message');

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

btnShowHide.addEventListener('click', function(e){
    if(starsController.hidden){
        starsController.show();
    } else {
        starsController.hide();
    }
})

btnMessage.addEventListener('click', function(e){
    starsController.showMessage("MESSAGE");
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

import { StarsController } from '../stars/stars.js';
import { injectMessage } from '../utils.js';
import {PauseData} from '../stars/experiment.js';

let starsController = Object.create(StarsController);
var canvas = document.getElementById("space");

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
document.getElementById('input-message').value = `Toto je pauza. Máte za sebou {TrialNumber} z 
{TotalTrials} trialů. Váš průměrný čas je {AverageReactionTime} ms. Správně jste zodpověděli {Correct} pokusů. Pro pokračování stiskněte mezerník.`;
document.getElementById('btn-message').addEventListener('click', function(e){
    starsController.hide();
    //get message from input field
    let message = document.getElementById('input-message').value;
    let pauseData = Object.create(PauseData);
    let msg = injectMessage(message, pauseData);
    console.log(msg);
    starsController.showMessage(msg);
})

// Selecting movement ---------
document.getElementById('btn-group-movement').addEventListener('click', function(e){
    console.log(e.target.innerHTML);
    starsController.show();
    starsController.setFlowDirection(Number(e.target.value));
})

// FUNCTIONS ---------------

// INITIALIZATION -----------

document['starsController'] = starsController;
starsController.initialize(canvas, window);
starsController.start();
starsController.resize();
starsController.setFlowDirection(0);
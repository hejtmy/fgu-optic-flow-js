import OpticFlowExperiment from './experiment.js';
import {StarsController, FlowDirection} from './stars.js';

let experiment = OpticFlowExperiment;

var canvas = document.getElementById("space");
experiment.init(canvas);
let starsController = StarsController;
starsController.initialize(document.getElementById('space'));

// BUTTONS -------------------

document.getElementById('trace').addEventListener("click", function(e){
    window.warp = window.warp == 1 ? 0 : 1;
    starsController.initializeStars(document.getElementById('space'));
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('random').addEventListener("click", function(e){

    starsController.initializeStars(document.getElementById('space'));
    starsController.OpticFlowSettings.CurrentFlowDirection += 1;
    if(starsController.OpticFlowSettings.CurrentFlowDirection > 4) starsController.OpticFlowSettings.CurrentFlowDirection = 0;
    window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
});

document.getElementById('arduino-connect-btn').addEventListener("click", function(e){
   arduinoController.connect();
})


document['experiment'] = experiment;

starsController.start();
import OpticFlowExperiment from './experiment.js';

let experiment = OpticFlowExperiment;

var canvas = document.getElementById("space");
experiment.init(canvas);

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


document['experiment'] = experiment;
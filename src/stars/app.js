import { OpticFlowExperiment, ExperimentSettings, TrialSettings } from './experiment.js';
import { StarsController, FlowDirection } from './stars.js';
import basesettings from './settings/basesettings.js';

let experiment = OpticFlowExperiment;

var canvas = document.getElementById("space");

experiment.init(OpticFlowExperiment.parseSettings(basesettings), canvas);
let starsController = Object.create(StarsController);
starsController.initialize(document.getElementById('space'));

// BUTTONS -------------------

//document.getElementById('trace').addEventListener("click", function(e){
    //window.warp = window.warp == 1 ? 0 : 1;
    //starsController.initializeStars(document.getElementById('space'));
    //window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
//});

document.getElementById('random').addEventListener("click", function(e){

    starsController.initializeStars(document.getElementById('space'));
    starsController.setFlowDirection(starsController.OpticFlowSettings.CurrentFlowDirection += 1);
});

document.getElementById('arduino-connect-btn').addEventListener("click", function(e){
   arduinoController.connect();
})

document.getElementById('file-selector').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        var settings = OpticFlowExperiment.parseSettings(JSON.parse(reader.result));
        console.log(settings);
        experiment.init(settings, canvas);
    });
    reader.readAsText(file);
});
// initialization -----------

document['experiment'] = experiment;

//starsController.start();

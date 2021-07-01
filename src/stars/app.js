import { OpticFlowExperiment, ExperimentSettings, TrialSettings } from './experiment.js';
import { StarsController, FlowDirection } from './stars.js';
import basesettings from './settings/basesettings.js';

let experiment = OpticFlowExperiment;
let starsController = Object.create(StarsController);

var canvas = document.getElementById("space");
let setupWindow = document.getElementById("setup");
let experimentWindow = document.getElementById("experiment");
let setupInfo = document.getElementById("setup-info");

// BUTTONS -------------------

//document.getElementById('trace').addEventListener("click", function(e){
    //window.warp = window.warp == 1 ? 0 : 1;
    //starsController.initializeStars(document.getElementById('space'));
    //window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
//});

document.getElementById('btn-start-experiment').addEventListener("click", function(e){
    if(!experiment.isInitialized()){
        alert("Experiment not initialized. Load settings first");
        return;
    }
    setupWindow.style.display = "none";
    experimentWindow.style.display = "block";
});


document.getElementById('btn-start-pause').addEventListener("click", function(e){
    experiment.startExperiment();
    return;
    starsController.initializeStars(document.getElementById('space'));
    starsController.setFlowDirection(starsController.OpticFlowSettings.CurrentFlowDirection += 1);
})

document.getElementById('btn-back').addEventListener("click", function(e){
    experiment.startExperiment();
    return;
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
        setupInfo.innerHTML += "Experiment settings loaded: ";
        setupInfo.innerHTML += experiment.settings.name + "(";
        setupInfo.innerHTML += experiment.settings.version + ")";
    });
    reader.readAsText(file);
});


// initialization -----------
experiment.init(OpticFlowExperiment.parseSettings(basesettings), canvas);
starsController.initialize(document.getElementById('space'));

document['experiment'] = experiment;
experimentWindow.style.display = "none";

//starsController.start();
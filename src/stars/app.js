import { OpticFlowExperiment, ExperimentSettings, TrialSettings } from './experiment.js';
import { StarsController, FlowDirection } from './stars.js';
import basesettings from './settings/basesettings.js';

let experiment = OpticFlowExperiment;
let starsController = Object.create(StarsController);

var canvas = document.getElementById("space");
let setupWindow = document.getElementById("setup");
let experimentWindow = document.getElementById("experiment");
let setupInfo = document.getElementById("setup-info");

let fileDropdown = document.getElementById("dropdown-save-files")

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
    goBackToMenu();
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
        setInfoText(setupInfo, experiment);
    });
    reader.readAsText(file);
});

fileDropdown.addEventListener('change', (e) => {
    console.log(e.target.value);
    var data = experiment.logger.getExperimentData(e.target.value);
    var txt = '';
    if(data != undefined){
       txt = JSON.stringify(data.data);
    }
    document.getElementById("p-log-content").innerHTML = txt;
});

document.getElementById("btn-save-log").addEventListener('click', (e) => {
    if(fileDropdown.selectedIndex == 0){
        alert("select something first");
        return;
    }
    var data = experiment.logger.getExperimentData(fileDropdown.value);
    if(data == undefined){
        alert('Something went wrong');
        return;
    }
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "trialData.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

document.getElementById("btn-clear-logs").addEventListener('click', (e) => {
    experiment.logger.clearStorage();
    populateDrowpdown();
});

// FUNCTIONS ---------------
function setInfoText(setupInfo, experiment){
    let txt = "";
    if(experiment.isInitialized()){
    txt += "Experiment settings loaded: ";
    txt += experiment.settings.name + "(";
    txt += experiment.settings.version + ")"
    } else {
        txt += "Expeirment settings not loaded";
    }
    // add arduino info

    // add other info
    setupInfo.innerHTML = txt;
}

function populateDrowpdown(){
    fileDropdown[0] = new Option('', '');
    const data = experiment.logger.getStorageData();
    console.log(data)
    let i = 1;
    Object.keys(data).forEach((e) => {
        fileDropdown[i] = new Option(Date(e).toString(), e);
        i++; 
    });
}

function goBackToMenu(){
    populateDrowpdown();
    setupWindow.style.display = "block";
    experimentWindow.style.display = "none";
}

// INITIALIZATION -----------
experiment.init(OpticFlowExperiment.parseSettings(basesettings), canvas);
starsController.initialize(document.getElementById('space'));

document['experiment'] = experiment;
experimentWindow.style.display = "none";

setInfoText(setupInfo, experiment);
populateDrowpdown();
//starsController.start();
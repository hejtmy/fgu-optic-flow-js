import { OpticFlowExperiment, ExperimentSettings, TrialSettings } from './experiment.js';
import basesettings from './settings/basesettings.js';
import serial from './../serial.js';

const arduinoController = new serial.ArduinoController();
let experiment = OpticFlowExperiment;

var canvas = document.getElementById("space");
let setupWindow = document.getElementById("setup");
let experimentWindow = document.getElementById("experiment");
let setupInfo = document.getElementById("setup-info");
let fileDropdown = document.getElementById("dropdown-save-files");
let neuroduinoStatus = document.getElementById("neuroduino-status-info")
let btnNeuroduinoBlink = document.getElementById("btn-neuroduino-blink")

// BUTTONS -------------------

window.addEventListener('resize', function(event) {
    experiment.resize();
}, true);

document.getElementById('btn-start-experiment').addEventListener("click", function(e){
    tryStartExperiment();
});

document.getElementById('btn-start-pause').addEventListener("click", function(e){
    experiment.startExperiment(finishExperiment);
    document.getElementById("experiment-buttons").style.display = "none";
    return;
})

document.getElementById('btn-back').addEventListener("click", function(e){
    goBackToMenu();
});

document.getElementById('arduino-connect-btn').addEventListener("click", function(e){
    connectNeuroduino();
})

btnNeuroduinoBlink.addEventListener("click", () => {
    neuroduinoBlink();
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

document.addEventListener('keydown', handleKey);

// FUNCTIONS ---------------
function handleKey(key){
    experiment.handleKey(key);
}

function tryStartExperiment(){
    if(!experiment.isInitialized()){
        alert("Experiment not initialized. Load settings first");
        return;
    }
    if(arduinoController.connected){
        experiment.initNeuroduino(arduinoController);
    }
    setupWindow.style.display = "none";
    experimentWindow.style.display = "block";
}

async function connectNeuroduino(){
   neuroduinoStatus.innerHTML = "Neuroduino is connecting";
   let connected = await arduinoController.connect();
   console.log(connected);
   let txt = `Neuroduino connected: ${connected}`;
   neuroduinoStatus.innerHTML = txt;
   btnNeuroduinoBlink.disabled = !connected;
}

async function neuroduinoBlink(){
    arduinoController.blink();
}

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
    if(data == null) return;
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

function finishExperiment(){
    document.getElementById("experiment-buttons").style.display = "block";
}

// INITIALIZATION -----------
experiment.init(OpticFlowExperiment.parseSettings(basesettings), canvas);

document['experiment'] = experiment;
experimentWindow.style.display = "none";

setInfoText(setupInfo, experiment);
populateDrowpdown();
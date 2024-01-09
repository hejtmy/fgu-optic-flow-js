import { OpticFlowExperiment } from '../stars/experiment.js';
import basesettings from '../stars/settings/basesettings.js';
import serial from '../serial.js';

const arduinoController = new serial.ArduinoController();
let experiment = OpticFlowExperiment;

var canvas = document.getElementById("space");
let setupWindow = document.getElementById("setup");
let experimentWindow = document.getElementById("experiment");
let setupInfo = document.getElementById("setup-info");
let settingsInfo = document.getElementById("settings-info");
let fileDropdown = document.getElementById('dropdown-save-files');
let neuroduinoStatus = document.getElementById("neuroduino-status-info")
let settingsStorage = window.localStorage;

// MAIN PAGE BUTTONS -------------------
window.addEventListener('resize', function(event) {
    experiment.resize();
}, true);

document.getElementById('btn-start-experiment').addEventListener("click", function(e){
    tryStartExperiment();
});

// EXPERIMENT BUTTONS -------------------------
// Start pause button 
document.getElementById('btn-start-pause').addEventListener("click", function(e){
    experiment.startExperiment(finishExperiment);
    document.getElementById("experiment-buttons").style.display = "none";
    return;
})

document.getElementById('btn-back').addEventListener("click", function(e){
    goBackToMenu();
});

// NEURODUINO CONTROLS ------------------
document.getElementById('arduino-connect-btn').addEventListener("click", function(e){
    connectNeuroduino(neuroduinoStatus,
        document.getElementById('btn-neuroduino-blink'),
        document.getElementById('btn-neuroduino-sendPulse'),);
})

document.getElementById("btn-neuroduino-blink").addEventListener("click", () => {
    neuroduinoBlink();
})

document.getElementById("btn-neuroduino-sendPulse").addEventListener("click", () => {
    neuroduinoSendPulse();
})

// SETTINGS SELECTOR -----------------------
document.getElementById("file-selector").addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        experiment = loadSettings(reader.result, experiment);
    });
    reader.readAsText(file);
});

// LOG FILES HANDELING ---------------------
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
    let filename = new Date(parseInt(fileDropdown.value)).toISOString() + "_opticflow.json";
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

document.getElementById("btn-clear-logs").addEventListener('click', (e) => {
    let confirmAction = confirm("Are you sure to delete all logs?");
    if(!confirmAction) return; 
    experiment.logger.clearStorage();
    populateDrowpdown();
});

document.getElementById("btn-clear-settings").addEventListener('click', (e) => {
    settingsStorage.removeItem("opticflowSettings");
    loadAndSetSettings(experiment);
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

    let arduinoConfirmed = arduinoController.connected || !experiment.settings.requireArduino || confirm("Arduino not connected, do you want to continue?");

    if (arduinoController.connected) {
        experiment.initNeuroduino(arduinoController);
    }
    if(arduinoConfirmed) ActivateExperimentCanvas();
}

function ActivateExperimentCanvas(){
    setupWindow.style.display = "none";
    experimentWindow.style.display = "block";
}

async function connectNeuroduino(status, blinkBtn, sendPulseBtn){
   status.innerHTML = "Neuroduino is connecting";
   let connected = await arduinoController.connect();
   console.log(connected);
   let txt = `Neuroduino connected: ${connected}`;
   status.innerHTML = txt;
   blinkBtn.disabled = !connected;
   sendPulseBtn.disabled = !connected;
}

async function neuroduinoBlink(){
    arduinoController.blink();
}

async function neuroduinoSendPulse() {
    arduinoController.sendPulse();
}

function loadSettings(data, experiment) {
    var settings = OpticFlowExperiment.parseSettings(JSON.parse(data));
    console.log(settings);
    experiment.init(settings, canvas);
    setInfoTexts(setupInfo, settingsInfo, experiment, "Experiment settings successufully loaded");
    settingsStorage.setItem("opticflowSettings", data);
    return experiment;
}

function setInfoTexts(setupInfo, settingsInfo, experiment, setupMessage){
    setupInfo.innerHTML = setupMessage;
    let txt = "Experiment settings: ";
    txt += experiment.settings.name + "(";
    txt += experiment.settings.version + ")"
    settingsInfo.innerHTML = txt;
    // add arduino info

    // add other info
}

function populateDrowpdown(){
    fileDropdown[0] = new Option('', '');
    const data = experiment.logger.getStorageData();
    if(data == null) return;
    Object.keys(data).forEach((e, i) => {
        let date = new Date(parseInt(e)).toLocaleString("cs-CZ");
        fileDropdown[i+1] = new Option(date, e);
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

function loadAndSetSettings(experiment) {
    let storedSettings = settingsStorage.getItem("opticflowSettings");
    if(storedSettings != null) {
        console.log("Settings found in local storage")
        experiment.init(OpticFlowExperiment.parseSettings(JSON.parse(storedSettings)), canvas);
        setInfoTexts(setupInfo, settingsInfo, experiment, "Settings loaded from previous sessions");
    } else {
        experiment.init(OpticFlowExperiment.parseSettings(basesettings), canvas);
        setInfoTexts(setupInfo, settingsInfo, experiment, "No loaded settings found, using default settings");
    }
}
loadAndSetSettings(experiment);

// INITIALIZATION -----------
document['experiment'] = experiment;
experimentWindow.style.display = "none";
populateDrowpdown();
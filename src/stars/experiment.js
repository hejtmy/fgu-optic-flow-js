import { StarsController, FlowDirection } from "./stars.js";
import Logger from "./logger.js";

const ExpeirimentState = Object.freeze({
    "none":-1,
    "initialized": 0,
    "running": 1,
    "paused": 2,
    "finished": 3,
})

const TrialSettings = {
    duration: 1000,
    movementType: 0,
}

const ExperimentSettings = {
    name: "NULL",
    version: "1.0",
    duration: 1000,
    canvasSize: {x:300, y:300},
    trials: [],
}

const OpticFlowExperiment = {
    starsControler: null,
    iTrial: 0,
    settings: null,
    currentTrial: null,
    trialTimeout: null,
    running: false,
    logger: null,
    initialized: false,
    finishCallback: null,
    canvas: null,
    state: ExpeirimentState.none,
    
    init: function(settingsObj, canvas){
        this.settings = this.parseSettings(settingsObj);
        this.starsControler = Object.create(StarsController);
        this.starsControler.initialize(canvas, window);
        this.starsControler.OpticFlowSettings.showCross = this.settings.showCross;
        this.starsControler.OpticFlowSettings.showSquare = this.settings.showSquare;
        
        this.logger = Object.create(Logger);
        this.logger.init(window);
        this.initialized = true;
        this.canvas = canvas;
        this.resize(this.canvas);

        this.state = ExpeirimentState.initialized;
    },

    resize: function(){
        this.starsControler.resize();
    },

    isInitialized: function(){
        if (this.settings == null) return false;
        return this.initialized;
    },

    parseSettings: function(settings){
        var settings = Object.assign(ExperimentSettings, settings);
        // This doesn't work, it only copies over the fist element :/
        //settings.trials = settings.trials.map((element) => Object.assign(TrialSettings, element));
        return settings;
    },
    
    loadSettings: function(){
        console.warn("The method is not implemented");
    },

    startExperiment: function(finishCallback = null){
        this.logger.startLogging();
        this.iTrial = -1;
        this.starsControler.start();
        this.running = true;
        this.logger.logMessage("experimentStarted;0");
        this.nextTrial();
        this.finishCallback = finishCallback;
        this.state = ExpeirimentState.running;
    },

    pause: function(){
        this.state = ExpeirimentState.paused;        
    },

    resume: function(){
        this.state = ExpeirimentState.running;        
    },

    finishExperiment: function(){
        this.running = false;
        this.starsControler.stop();
        this.logger.logMessage("experimentFinished");
        if(this.finishCallback != null) this.finishCallback();
    },

    nextTrial: function(){
        this.iTrial += 1;
        this.currentTrial = this.settings.trials[this.iTrial];
        this.startTrial();
    },

    startTrial: function(){
        console.log("trial starting" + this.iTrial);
        console.log(this.currentTrial.movementType);
        //setup stars controller
        this.starsControler.setFlowDirection(this.currentTrial.movementType);
        this.logger.logMessage(`trialStarted;${this.iTrial}`);
        this.trialTimeout = setTimeout(this.finishTrial.bind(this), this.currentTrial.duration);
    },

    finishTrial: function(){
        this.logger.logMessage(`trialFinished;${this.iTrial}`);
        if(this.checkLastTrial(this.iTrial, this.settings)){
            this.finishExperiment();
            return;
        }
        this.nextTrial();
    },

    checkLastTrial: function(iTrial){
        return this.iTrial >= this.settings.trials.length - 1;
    },

    handleKey: function(key){
        if(this.state != ExpeirimentState.running) return;
        console.log(key.code);
        this.logger.logMessage(`keypress;${key.code}`);
    }
}

export {OpticFlowExperiment, ExperimentSettings, TrialSettings};
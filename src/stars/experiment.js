import { StarsController, FlowDirection } from "./stars.js";
import Logger from "./logger.js";

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
    
    init: function(settingsObj, canvas){
        this.settings = this.parseSettings(settingsObj);
        this.starsControler = Object.create(StarsController);
        this.starsControler.initialize(canvas);
        this.logger = Object.create(Logger);
        this.logger.init(window);
        this.initialized = true;
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
        this.settings
    },

    startExperiment: function(){
        this.iTrial = -1;
        this.starsControler.start();
        this.running = true;
        this.nextTrial();
        this.logger.logMessage("experimentStarted");
    },

    pause: function(){
        
    },

    finishExperiment: function(){
        this.running = false;
        this.starsControler.stop();
        this.logger.logMessage("experimentFinished");
    },

    nextTrial: function(){
        this.iTrial += 1;
        this.currentTrial = this.settings.trials[this.iTrial];
        this.startTrial();
    },

    startTrial: function(){
        console.log("trial starting" + this.iTrial);
        console.log(this.currentTrial.movementType);
        //setup stars copntroller
        this.starsControler.setFlowDirection(this.currentTrial.movementType);
        this.logger.logMessage(`trialStarted;${this.iTrial}`);
        // add timeout
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
    }
}

export {OpticFlowExperiment, ExperimentSettings, TrialSettings};
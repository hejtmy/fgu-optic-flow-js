import { StarsController, FlowDirection } from "./stars.js";
import Logger from "./logger.js";
import {TrialData, ExperimentData} from "./results.js";

const PauseData = {
    TrialNumber: 666,
    TotalTrials: 666,
    Correct: 999,
    Incorrect: 999,
    RatioCorrect: 999,
    AverageReactionTime: 999,
    MinimalReactionTime: 999,
    MaximalReactionTime: 999,
}

const ExpeirimentState = Object.freeze({
    "none": -1,
    "initialized": 0,
    "running": 1,
    "paused": 2,
    "finished": 3,
})

const TrialSettings = {
    duration: 2000,
    movementType: 0,
    isPause: false,
    automaticContinue: true
}

const PauseTrialSettings = {
    isPause: true,
    // available terms
    // TrialNumber, TotalTrials
    // correct, incorrect, ratio_correct, average_rt, min_rt, max_rt
}

const ExperimentSettings = {
    name: "NULL",
    version: "1.0",
    duration: 3000,
    canvasSize: {x:300, y:300},
    blinkDuration: 200,
    blinkInterTrial: [800, 1200],
    pauseSettings: {
        msg: "Toto je pauza <br>. Máte za sebou {TrialNumber} z {TotalTrials}.",
    },
    trials: [],
}

const OpticFlowExperiment = {
    starsControler: null,
    iTrial: 0,
    settings: null,
    currentTrial: null,
    trialTimeout: null,
    blinkTimeout: null,
    neuroduinoTimeout: null,
    neuroduino: null,
    running: false,
    logger: null,
    initialized: false,
    finishCallback: null,
    canvas: null,
    state: ExpeirimentState.none,
    currentTrialData: null,
    data: null,
    
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

        this.data = Object.create(ExperimentData);
        this.state = ExpeirimentState.initialized;
    },

    initLogger: function(){
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

    startExperiment: function(finishCallback = () => {}){
        this.logger.addSettings(this.settings);
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
        this.clearTimeouts();
        this.starsControler.hide();
        let pauseData = this.getPauseData();
        let inject = (str, obj) => str.replace(/{(.*?)}/g, (x, g) => obj[g]);
        let msg = inject(this.setttings.pauseSettings.message, pauseData);
        console.log(msg);
        this.starsControler.showMessage(msg); 
    },

    getPauseData: function(){
        let trialStats = this.data.calculateStats();
        let pauseData = Object.create(PauseData);
        pauseData.TrialNumber = this.iTrial;
        pauseData.TotalTrials = this.settings.trials.length;
        pauseData.Correct = trialStats.correct;
        pauseData.Incorrect = trialStats.incorrect;
        pauseData.RatioCorrect = trialStats.ratio_correct;
        pauseData.AverageReactionTime = trialStats.average_rt;
        pauseData.MinimalReactionTime = trialStats.min_rt;
        pauseData.MaximalReactionTime = trialStats.max_rt;
        return pauseData;
    },

    resume: function(){
        this.state = ExpeirimentState.running;
        this.starsControler.show();
    },

    finishExperiment: function(){
        this.running = false;
        this.starsControler.stop();
        this.logger.logMessage("experimentFinished");
        this.clearTimeouts();
        if(this.finishCallback != null) this.finishCallback();

        this.starsControler.hide();
        this.starsControler.showMessage("Konec experimentu. Dekujeme vas cas.");
    },

    nextTrial: function(){
        this.iTrial += 1;
        this.currentTrial = this.settings.trials[this.iTrial];
        this.startTrial();
    },

    startTrial: function(){
        console.log("trial starting" + this.iTrial);
        this.clearTimeouts();
        this.currentTrialData = Object.create(TrialData);
        
        if(this.currentTrial.isPause){
            this.startPauseTrial();
            return;
        }
        
        //setup stars controller
        this.starsControler.setFlowDirection(this.currentTrial.movementType);
        this.logger.logMessage(`trialStarted;${this.iTrial}`);
        this.trialTimeout = setTimeout(() => {
            this.finishTrial();
        }, this.currentTrial.duration);

        this.setNextBlink();
        this.neuroduinoPulse();
    },

    startPauseTrial: function(){
        this.pause();
        this.logger.logMessage(`trialStarted;${this.iTrial}`);
        if(this.currentTrial.automaticContinue) {
            this.trialTimeout = setTimeout(() => {
                this.resumePauseTrial();
            }, this.currentTrial.duration);
        }
    },

    resumePauseTrial: function(){
        // if we escaped with a key
        this.resume();
        this.finishTrial();
    },

    finishTrial: function(){
        this.logger.logMessage(`trialFinished;${this.iTrial}`);
        if(this.checkLastTrial(this.iTrial, this.settings)){
            this.finishExperiment();
            return;
        }
        this.clearTimeouts();
        this.nextTrial();
    },
    
    clearTimeouts: function(){
        if(this.trialTimeout != null) clearTimeout(this.trialTimeout);
        if(this.blinkTimeout != null) clearTimeout(this.blinkTimeout);
    },

    checkLastTrial: function(iTrial){
        return this.iTrial >= this.settings.trials.length - 1;
    },

    // MESSAGES -------------------------------
    showMessage: function(message){

    },

    // NEURODUINO ---------------------------
    initNeuroduino: function(neuroduino){
        if(!neuroduino.connected){
            console.warn("the neuroduino needs to be connected");
            return;
        }
        this.neuroduino = neuroduino;
        this.neuroduino.startReading((value) => {this.neuroduinoHandleMessage(value)});
    },

    neuroduinoPulse: function(){
        if(this.neuroduino == null) return;
        this.logger.logMessage(`neuroduino;pulseUp`);
        this.neuroduino.pulseUp();
        this.neuroduinoTimeout = setTimeout(() => {
            this.logger.logMessage(`neuroduino;pulseDown`);
            this.neuroduino.pulseDown();
        }, 200);
    },

    neuroduinoHandleMessage: function(value){
        this.logger.logMessage(`neuroduinoMessage;${value}`);
    },

    // BLINKING ----------------------------------
    blink: function(finishCallback = () => {}){
        this.starsControler.blink(this.settings.blinkDuration, () => {
            this.finishBlink();
            finishCallback();
        });
        this.logger.logMessage(`blinkStarted;`);
    },
    
    finishBlink: function(){
        //log blink
        this.logger.logMessage(`blinkFinished;`);
    },

    setNextBlink: function(){
        // 1+ is there because random is 1 exclusive, so we need to add one
        if(!("shouldBlink" in this.currentTrial)) return;
        if(!this.currentTrial.shouldBlink) return;
        let time = this.settings.blinkInterTrial[0] + 
            Math.round(Math.random() * (1 + this.settings.blinkInterTrial[1] - this.settings.blinkInterTrial[0]));
        if("blinkTime" in this.currentTrial){
            time = this.currentTrial.blinkTime;
        }
        this.blinkTimeout = setTimeout(() => {
            this.blink();
        }, time);
    },

    handleKey: function(key){
        if(this.state < ExpeirimentState.running | 
            this.state >= ExperimentSettings.finished) return;
        console.log(key.code);

        // Logging ---------------------------
        this.logger.logMessage(`keypress;${key.code}`);

        // Handles Pause
        if(key.code == 'Escape'){
            //this.pause();
            return;
        }

        // Handles resuming trials with a spacebar ------------

        if(this.currentTrial.isPause){
            if(key.code == 'Space'){
                this.tryUnpause();
                return;
            }
        }
    },

    tryUnpause: function(){
        this.resumePauseTrial();
    }

}

export {OpticFlowExperiment, ExperimentSettings, TrialSettings, PauseData};
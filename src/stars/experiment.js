import Logger from "./logger.js";
import { StarsController, FlowDirection } from "./stars.js";
import { TrialData, ExperimentData } from "./results.js";
import { injectMessage } from "../utils.js";

const PauseData = {
    TrialNumber: 999,
    TotalTrials: 999,
    ExperimentProgress: 999,
    Correct: 999,
    Incorrect: 999,
    CorrectBlink: 999,
    IncorrectBlink: 999,
    RatioCorrect: 0.999,
    AvgReactionTimeMs: 999,
    AvgReactionTimeSec: 9.99,
    MinReactionTimeMs: 999,
    MinReactionTimeSec: 9.99,
    MaxReactionTimeMs: 999,
    MaxReactionTimeSec: 9.99,
    PercentCorrect: 99,
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
    automaticContinue: true,
}

const PauseTrialSettings = {
    isPause: true,
    wipeBufferedData: false
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
    pauseMessage: "Máte za sebou {TrialNumber} z {TotalTrials}.",
    finalMessage: "Konec experimentu. Dekujeme za váš čas.",
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
        this.starsControler.OpticFlowSettings.canvasSize = this.settings.canvasSize;

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
        let pauseMessage = "message" in this.currentTrial ?
            this.currentTrial.message : this.settings.pauseMessage;
        let msg = injectMessage(pauseMessage, pauseData);
        this.starsControler.showMessage(msg); 
    },

    getPauseData: function(){
        let trialStats = this.data.calculateStats();
        let pauseData =  Object.create(PauseData);
        pauseData.TrialNumber = this.iTrial;
        pauseData.TotalTrials = this.settings.trials.length;
        pauseData.ExperimentProgress = Math.round(this.iTrial*100 / this.settings.trials.length);
        pauseData.Correct = trialStats.correct;
        pauseData.Incorrect = trialStats.incorrect;
        pauseData.CorrectBlink = trialStats.correct_blink;
        pauseData.IncorrectBlink = trialStats.incorrect_blink;
        pauseData.RatioCorrect = trialStats.ratio_correct;
        pauseData.PercentCorrect = Math.round(trialStats.ratio_correct * 100);
        pauseData.AvgReactionTimeMs = Math.round(trialStats.average_rt);
        pauseData.AvgReactionTimeSec = Math.round(trialStats.average_rt * 100) / 100;
        pauseData.MinReactionTimeMs = Math.round(trialStats.min_rt);
        pauseData.MinReactionTimeSec = Math.round(trialStats.min_rt * 100) / 100;
        pauseData.MaxReactionTimeMs = Math.round(trialStats.max_rt);
        pauseData.MaxReactionTimeSec = Math.round(trialStats.max_rt * 100) / 100;
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
        let finalMesasge = this.settings.finalMessage;
        let msg = injectMessage(finalMesasge, this.getPauseData());
        this.starsControler.showMessage(msg);
    },

    nextTrial: function() {
        this.iTrial += 1;
        this.setCurrentTrialSettings(this.iTrial);
        this.startTrial();
    },

    setCurrentTrialSettings: function(iTrial){
        this.currentTrial = this.settings.trials[iTrial];
        if(!("duration" in this.currentTrial)) {
            this.currentTrial.duration = this.settings.duration;
        }
    },

    startTrial: function(){
        console.log("trial starting" + this.iTrial);
        this.clearTimeouts();
        this.currentTrialData = Object.create(TrialData);
        this.currentTrialData.trialNumber = this.iTrial;

        if(this.currentTrial.isPause){
            this.currentTrialData.isPause = true;
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
        // else continues with a spacebar
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
        this.data.addTrialData(this.currentTrialData);
        this.logger.logMessage(`trialFinished;${this.iTrial}`);
        if(this.currentTrial.wipeBufferedData){
            this.data.wipeData();
        }
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

    tryUnpause: function(){
        this.resumePauseTrial();
    },

    // MESSAGES -------------------------------
    showMessage: function(message){
        this.starsControler.showMessage(message);
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
        this.currentTrialData.didBlink = true;
        this.currentTrialData.blinkStartedTime = this.logger.getTime();
    },
    
    finishBlink: function(){
        this.logger.logMessage(`blinkFinished;`);
        this.currentTrialData.blinkEndedTime = this.logger.getTime();
    },

    setNextBlink: function(){
        // 1+ is there because random is 1 exclusive, so we need to add one
        if(!("shouldBlink" in this.currentTrial)) return;
        if(!this.currentTrial.shouldBlink) return;
        let blinkTime = 0;
        if("blinkTime" in this.currentTrial){
            blinkTime = this.currentTrial.blinkTime;
        } else {
            blinkTime = this.settings.blinkInterTrial[0] + 
                Math.round(Math.random() * (1 + this.settings.blinkInterTrial[1] - this.settings.blinkInterTrial[0]));
        }
        this.blinkTimeout = setTimeout(() => {
            this.blink();
        }, blinkTime);
    },

    // key handling -----------------------------
    handleKey: function(key){
        if(this.state < ExpeirimentState.running | 
            this.state >= ExperimentSettings.finished) return;
        console.log(key.code);

        // Logging ---------------------------
        this.logger.logMessage(`keypress;${key.code}`);
        
        // Handles participant reaction with a spacebar -------------------
        this.handleTrialSpacebar(key);

        // Handles resuming trials with a spacebar ------------
        if(this.handlePauseKey(key)) return;
    },

    handlePauseKey: function(key){
        if(this.currentTrial.isPause){
            if(key.code == 'Space'){
                this.tryUnpause();
                return true;
            }
        }
        return false;
    },
    
    handleTrialSpacebar: function(key) {
        if(this.currentTrial.isPause) return false;
        if(key.code != 'Space') return false;
        this.currentTrialData.didRespond = true;
        this.currentTrialData.responseTime = this.logger.getTime();
    }
}

export {OpticFlowExperiment, ExperimentSettings, TrialSettings, PauseData};
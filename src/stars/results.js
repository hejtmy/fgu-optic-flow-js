
const TrialResults = {
    trialNumber: null,
    responseCorrect: null,
    reactionTime: null,
    result: null // falsePositive, falseNegative, truePositive, trueNegative
}

const TrialData = {
    trialNumber: null,
    blinkStartedTime: null,
    blinkEndedTime: null,
    didBlink: false,
    didRespond: false,
    isPause: false,
    responseTime: null,
}

const ExperimentResults = {
    correct: null,
    incorrect: null,
    ratio_correct: null,
    ratio_correct_blink: null,
    average_rt: null,
    min_rt: null,
    max_rt: null
}

const ExperimentData = {
    TrialsResults: [],
    TrialsData: [],

    getNumberOfTrials: function(){
        return this.TriaslData.length;
    },

    addTrialData: function(data){
        // validate
        // check if any of the following fields are null (trialNumber)
        if(data.trialNumber == null){
            throw new Error("Trial number is null");
        }
        if (data.didBlink && (data.blinkStartedTime == null || data.blinkEndedTime == null)){
            throw new Error("Blink started or ended time is null");
        }
        this.TrialsData.push(data);
        this.addTrialResults(data);
    },

    wipeData: function(){
        this.TrialsData = [];
        this.TrialsResults = [];
    },

    addTrialResults: function(data) {
        let results = Object.create(TrialResults);
        results.trialNumber = data.trialNumber;
        if(data.didBlink && data.didRespond){
            results.result = "truePositive";
            results.reactionTime = data.responseTime - data.blinkStartedTime;
        }
        if((!data.didBlink) && !(data.didRespond)) results.result = "trueNegative";
        if((!data.didBlink) && data.didRespond) results.result = "falsePositive";
        if(data.didBlink && !(data.didRespond)) results.result = "falseNegative";
        results.responseCorrect = results.result == "truePositive" || results.result == "trueNegative"
        this.TrialsResults.push(results);
    },

    calculateStats: function(){
        let results = Object.create(ExperimentResults);
        if(TrialResults.length == 0) return results;
        // for each trial where blink was detected calculate reaction time
        let correctTrials = this.TrialsResults.filter((e) => e.result == "truePositive" || e.result == "trueNegative")
        let correctBlinkTrials = this.TrialsResults.filter((e) => e.result == "truePositive")
        let incorrectTrials = this.TrialsResults.filter((e) => e.result == "falsePositive" || e.result == "falseNegative")
        // for each trial where blink was not detected calculate reaction time
        // get reactionTime from all correctTrials
        if(correctBlinkTrials.length > 0) {
            results["average_rt"] = math.mean(correctBlinkTrials.map((e) => e.reactionTime));
            results["min_rt"] = math.min(correctBlinkTrials.map((e) => e.reactionTime));
            results["max_rt"] = math.max(correctBlinkTrials.map((e) => e.reactionTime));
        }

        let nTrials = this.TrialsResults.length;
        results["correct"] = correctTrials.length;
        results["ratio_correct"] = results["correct"] / nTrials;
        results["incorrect"] = incorrectTrials.length;

        return results;
    }
}

export {
    ExperimentData, TrialData
}
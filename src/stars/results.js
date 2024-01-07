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
        //calculate results
        this.addTrialResults(data);
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
        return {
            correct: 666,
            incorrect: 666,
            ratio_correct: 666,
            average_rt: 666,
            min_rt: 666,
            max_rt: 666
        }
    }
}

export {
    ExperimentData, TrialData
}
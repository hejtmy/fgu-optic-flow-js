const TrialData = {
    blinkStartedTime: 0,
    blinkEndedTime: 0,
    didBlink: false,
    responseCorrect: false,
    responseTime: 0,
}

const ExperimentData = {
    Trials: [],

    getNumberOfTrials: function(){
        return this.Trials.length;
    },

    addTrialData: function(blinkTime, didBlink, responseCorrect, responseTime){
        this.Trials.push({
            blinkTime: blinkTime,
            didBlink: didBlink,
            responseCorrect: responseCorrect,
            responseTime: responseTime,
        });
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

export default {
    ExperimentData, TrialData
}
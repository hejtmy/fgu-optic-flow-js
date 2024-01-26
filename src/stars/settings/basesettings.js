export default {
    "name":"Base",
    "duration":1000,
    "canvasSize":{"x":500, "y":500},
    "showSquare":false,
    "showCross":true,
    "requireArduino":false,
    "pauseMessage": "You have completed {TrialNumber} out of {TotalTrials}. Press Spacebar to continue", //message to be displayed. See below for formatting
    "trials":[
        {
            "duration": 1500,
            "shouldBlink": true,
            "blinkTime": 500,
            "movementType": 0
        },
        {
            "movementType": 1
        },
        {
            "isPause": true,
            "message": "This will auto continue after 3 seconds",
            "automaticContinue": true,
            "duration": 3000
        },
        {
            "duration": 1500,
            "shouldBlink": true,
            "blinkTime": 400,
            "movementType": 2
        },
        {
            "duration": 1500,
            "movementType": 3
        },
        {
            "isPause": true,
            "wipeBufferedData": true,
            "message": "This will not autocontinue. Press space to continue. This is trial {TrialNumber}. Success rate is {RatioCorrect}. Wiping results."
        },

        {
            "duration": 1500,
            "movementType": 4,
            "shouldBlink": true
        },
        {
            "duration": 2000,
            "movementType": 0,
        },
        {
            "isPause": true,
            "wipeBufferedData": true,
            "message": "This is trial {TrialNumber}. Success rate is {RatioCorrect}. Press space to continue."
        },
        {
            "duration": 1500,
            "movementType": 5
        },
        {
            "duration": 1500,
            "movementType": 1
        },
        {
            "duration": 1500,
            "movementType": 0
        }
    ]
}

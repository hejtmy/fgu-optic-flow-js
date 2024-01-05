export default {
    "name":"Base",
    "duration":1000,
    "canvasSize":{"x":500, "y":500},
    "showSquare":false,
    "showCross":true,
    "requireArduino":false,
    "pauseSettings": { //settings for pause trials
        "message": "Press spacebar to continue", //message to be displayed. See below for formatting
    },
    "trials":[
        {
            "duration": 1500,
            "shouldBlink": true,
            "blinkTime": 500,
            "movementType": 0
        },
        {
            "duration": 1500,
            "movementType": 1
        },
        {
            "isPause": true,
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
            "duration": 1500,
            "movementType": 4
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

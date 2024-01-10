# fgu-optic-flow-js
Javascript experiment for optic flow. 

Basic JS and CSS taken from the codepan here https://codepen.io/hfer/pen/VQyqLg. Added random elements.

# Requirements

The experiment is delivered as a self contained HTML file. It requires a browser that supports Web Serial API (Chrome, Edge, Opera, Brave, Vivaldi). It also requires an Arduino with a button connected to pin 1. The Arduino needs to be flashed with the neuroduino sketch [https://github.com/hejtmy/neuroduino](https://github.com/hejtmy/neuroduino).

The serial interface is ONLY available when in secure context (therefore https, or loaded from localhost). So serving it from hejtmy.com does not work

https://groups.google.com/a/chromium.org/g/chromium-dev/c/pjTmHImvymw

## Arduino
Web browser with experimental features and Web Serial API enabled.
chrome://flags/#enable-experimental-web-platform-features
chrome://flags/#enable-web-serial-api

## Controls
Any valid keypress is Spacebar. It reacts to keys and unpauses the experiemnt during pause section. 

## Settings 
```json
{
    "name":"Base", //name for posteriority
    "duration":1000, //trial duration in ms
    "blinkDuration": 200, //duration of blink in ms
    "canvasSize":{"x":500, "y":500}, //size of the canvas in px
    "showSquare": true, //should there be a black square in the middle of all the time
    "blinkInterTrial": [800, 1200], // Defines in ms how long from the start should the blink start. It is a random number between the two values. This can be overriden in individual trials using a fixed value
    "showCross": true, //should there be a fixation cross at all time
    "requireArduino": true, //if user is warned if arduino is not present. Can still continue, false just disables the warning
    "pauseMessage": "Press spacebar to continue", //message to be displayed. See below for formatting and options to 
    "finalMessage": "Thank you for your time", //message at the end of the experiment. allows same formatting as pauseMessage
    },
    "trials":[
        {
            // this is a blinking trial
            "duration": 1500, //duration in ms. Overrides base duration
            "movementType": 0, //type of movement, see below
            "shouldBlink":true, // if true, this trial will blink
            "blinkTime": 400 // in ms, when the blink should start. only accept a single number, not a range like in blinkInterTrial
        },
        {
            // this trial will not blink
            "duration": 1200,
            "movementType": 1
        }
        {
            "isPause": true, // if true, starts pause trial,
            "automaticContinue": true,// if true, will automatically continue after 5time determined in "duration"
            "duration": 6000 // duration in ms. Only applied if automatic continues is set to true
        },

    ]
}
```

**Inheritance** Any top level settings (showSquare, showCross, duration etc.) are defaults and do not need to be set individually in each trial. If trial has duration 1500 it will override the default value set int the duration

**Timings** All times are in milliseconds. Reported times and timing uses `Date.getTime()` function.

**Blinking** If the trial should blink, it needs to set property "shouldBlink" to true. If blink should occur at designated time, "blinkTime" in ms should be set. DO NOT forget to set blink duration. If trial is 1000ms long and blink time 200, do NOT start blink later than 750ms or so, otherwise the blink might be cut short etc.. At this point, 

**Recordingkeypresses** All keypresses ar recorder. Only SPACE works as a blink reaction.

**Pause** 

### Movement types

Movement types are defined using numbers. You can visualise various movement types in the [Will fill this later]()

- 0: radial in
- 1: radial out
- 2: horizontal left
- 3: horizontal right
- 4: random
- 5: none (still)

### Pause settings

If the trial is to be pause trial, it needs to set "isPause" to true. Pauses are unpaused with spacebar or automatically continued if "automaticContinue" is set to true. If automatic continue is set to true, the pause will be unpaused after the time set in "duration" in ms.

## Message formatting
During pauses and after the experiment a message can be shown. It is defined in the settings in the "pauseMessage" and "finalMessage" properties.



These message allow for injecting some information about the state of the experiment to customize the message for each participant. The string is constructed using javascript handlebars syntax `{variable name}` to insert variables (do not use basic javascript interpolation (using `${variable name}`), it will not work).

```json
{
    "pauseMessage": "Press spacebar to continue. Trial {TrialNumber} of {TotalTrials}."
}
```

This message will be displayed as "Press spacebar to continue. Trial 1 of 10." if the experiment is on the first trial of 10. 

The available variables which can be injected during each message are:
- TrialNumber: Current trial number
- TotalTrials: Number of total trials
- ExperimentProgress: Number from 1 to 100 determining completion of the procedure
- Correct: Number of correct trials
- Incorrect: Number of incorrect trials
- RatioCorrect: Ratio of correct trials from all trials excluding pauses
- AverageReactionTime, MinimalReactionTime, MaximalReactionTime : Average, minimal and maximal reaction time for correct blink trials

## Tuorials for setup

https://github.com/UnJavaScripter/web-serial-example/blob/master/src/app.ts

https://codelabs.developers.google.com/codelabs/web-serial#2

https://wicg.github.io/serial/

https://web.dev/serial/

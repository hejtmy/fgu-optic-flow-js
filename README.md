# fgu-optic-flow-js
Javascript demonstration of the optic flow

Basic JS and CSS taken from the codepan here https://codepen.io/hfer/pen/VQyqLg. Added random elements.

# Requirements
Chrome with experimental features enabled
chrome://flags/#enable-experimental-web-platform-features

The serial interface is ONLY available when in secure context (therefore https, or loaded from localhost). So serving it from hejtmy.com does not work
https://groups.google.com/a/chromium.org/g/chromium-dev/c/pjTmHImvymw

## Controls
Any valid keypress is Spacebar. It reacts to keys and unpauses the experiemnt during pause section.

## Settings 
```json
{
    "name":"Base", //name for posteriority
    "duration":1000, //trial duration in ms
    "blinkDuration": 200, //duration of blink in ms
    "canvasSize":{"x":500, "y":500}, //size of the canvas in px
    "showSquare": true,
    "blinkInterTrial": [800, 1200], // in case we want blink trials to be randomized
    "showCross": true, //should there be a fixation cross at all time
    "requireArduino": true, //if user is warned if arduino is not present. Can still continue, false just disables the warning
    "pauseMessage": "Press spacebar to continue", //message to be displayed. See below for formatting and options to 
    "finalMessage": "Thank you for your time", //message at the end of the experiment. allows same formatting as pauseMessage
    },
    "trials":[
        {
            "duration": 1500, //duration in ms. Overrides base duration
            "movementType": 0, //type of movement, see below
            "shouldBlink":true, // if true, this trial will blink
            "blinkTime": 400 // in ms, when the blink should start
        },
        {
            "isPause": true // if true, starts pause trial,
        },
        {
            // this trial will not blink
            "duration": 1200,
            "movementType": 1
        }
    ]
}
```

**Inheritance** Any top level settings (showSquare, showCross, duration etc.) are defaults and do not need to be set individually in each trial.  If trial has duration 1500 it will override the default. 
**Timings** Duration determines trial duration, blinkDuration the time of the blink. All times are in milliseconds. 
**Blinking** If the trial should blink, it needs to set property "shouldBlink" to true. If blink should occur at designated time, "blinkTime" in ms should be set. DO NOT forget blink duration. If trial is 1000ms long and blink time 200, do NOT start blink later than 750ms or so, otherwise the blink might be cut short etc.. Keypress is not linked to any specific blink,

**Pause** If the trial is to be pause trial, it needs to set "isPause" to true. Pauses are unpaused with spacebar.

Movement type

- 0: radial in
- 1: radial out
- 2: horizontal left
- 3: horizontal right
- 4: random
- 5: none (still)

### Pause settings

Pause settings allow for customization of the message. It allows display of concurent trial stats by string interpolation/comprehension. The string is constructed using Html formatting (<br>, <p> should work) and `{variable name}` to insert variables (do not use basic javascript interpolation (using `${variable name}`), it will not work).

The available variables are:
- TrialNumber: Current trial number
- TotalTrials: Number of total trials
Correct: 999,
    Incorrect: 999,
    RatioCorrect: 999,
    AverageReactionTime: 999,
    MinimalReactionTime: 999,
    MaximalReactionTime: 999,


```json
{
    "msg": "Press spacebar to continue. Trial ${trial} of ${totalTrials}."
}
```

## Tuts
https://dev.to/unjavascripter/the-amazing-powers-of-the-web-web-serial-api-3ilc

https://github.com/UnJavaScripter/web-serial-example/blob/master/src/app.ts

https://codelabs.developers.google.com/codelabs/web-serial#2

https://wicg.github.io/serial/

https://web.dev/serial/

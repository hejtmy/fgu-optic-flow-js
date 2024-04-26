# fgu-optic-flow-js
Javascript experiment for optic flow. 

Basic JS and CSS taken from the codepan here https://codepen.io/hfer/pen/VQyqLg. Added random elements.

# Requirements

The experiment has been tried on Brave (chrome based) and Safari. It can be administered

## Arduino requirements
The experiment is delivered as a self contained HTML file. It requires a browser that supports Web Serial API (Chrome, Edge, Opera, Brave, Vivaldi). It also requires an Arduino with a button connected to pin 1. The Arduino needs to be flashed with the neuroduino sketch [https://github.com/hejtmy/neuroduino](https://github.com/hejtmy/neuroduino).

To make the arduino work, you need a web browser with experimental features and Web Serial API enabled. If on chrome, you can enable it by going to `chrome://flags/#enable-experimental-web-platform-features` and `chrome://flags/#enable-web-serial-api` and enabling both.

```
chrome://flags/#enable-experimental-web-platform-features
chrome://flags/#enable-web-serial-api
```
The serial interface is ONLY available when in secure context (therefore https, or loaded from localhost). Serving it from hejtmy.com seems to work so far, but there were troubles in the past.

# Website description 
You can test the functionality by going to https://hejtmy.com/fgu-optic-flow-js

There are 4 parts to the website.
- The experiment itself
- Testing starts visualisation: https://hejtmy.com/fgu-optic-flow-js/public/stars-visualiser.html
- Testing arduino connection: https://hejtmy.com/fgu-optic-flow-js/public/serial-test.html
- Deprecated 3dimensional path integration experiment: https://hejtmy.com/fgu-optic-flow-js/public/3d.html

## Testing stars visualisation
This is a simple visualisation of the stars. It is used to test if the browser supports the required features, how different modes of movememnt work, test out blinking, hiding etc.

It is also used to test message comprehension used in the experiment in pause and final messages. You can format the message using handlebars syntax and see how it will look. See below for more information about message formatting.

## Testing arduino connection
This is a simple test of the arduino connection. It allows you to connect to the board and test out blinking and pulses. It also allows you to send custom messages and show last message received from the board.


# Experiment

The experiment is a simple task where the participant is asked to press a spacebar when the cross in the middle of the screen blinks. The experiemnt can be administered from the online website: https://hejtmy.com/fgu-optic-flow-js/public/experiment.html or downloaded and run locally from https://github.com/hejtmy/fgu-optic-flow-js/tags. You simply save the folder somewhere and open the `index.html` file in your browser.

## Data recording

The experiment saves all settings and data in the context in which it is loaded on your machine. If you run it from localhost from the provided index.html file, it will save the data in your browser's local storage tied to the local file. If you run it from the website, it will save the data in the browser's local storage but this data will NOT show in the local settings. Please backup the data as soon as possible.

Please be aware that the experiment records all keypresses. It is not anonymised and the data is not encrypted. It is stored in the browser's local storage. If you want to use this experiment for research, you need to be aware of the implications of this.

## Settings 

The experiment is defined in a JSON file. If no json is provided it will use the default settings. The default settings are defined in `public/js/settings.js`. If you want to change the default settings, you can do so in a custom json file and load it using the button on the website. The settings are saved in the browser's local storage and will be loaded automatically next time you open the website.

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

**Recording keypresses** All keypresses ar recorded. Only SPACE works as a blink reaction.

### Experiment settings parameters

All are written in the `parameter (type: default value)` format

- name (string): name for posteriority
- version (string: "1.0"): name of the version
- duration (int: 1000): trial duration in ms.
- blinkDuration (int: 200): duration of blink in ms
- canvasSize (dict{"x"(int: 500), "y"(int: 500)}): size of the canvas in px
- showSquare (bool: true): should there be a black square in the middle of all the time
- blinkInterTrial [int: 800, int:1200]: Defines in ms how long from the start should the blink start. It is a random number between the two values. This can be overriden in individual trials using a fixed value
- showCross (bool: true): should there be a fixation cross at all time
- requireArduino (bool: true): //if user is warned if arduino is not present. Can still continue, false just disables the warning
- pauseMessage (string: "Press space to continue"): message to be displayed. See below for formatting and options. Can be overriden in individual trials (see pause specific settings)
- finalMessage (string: "Thank you for your time"): message at the end of the experiment. allows same formatting as pauseMessage ("Thank you for your time")

### Trial settings parameters

**Regular trial specific settings**
- duration (int: 1500): duration in ms. Overrides base duration
- movementType (int: 0): type of movement, see below
- shouldBlink (bool: true): if true, this trial will blink
- blinkTime (int: 400): in ms, when the blink should start.

**Movement Types**
Movement types are defined using numbers. You can visualise various movement types in the [Will fill this later]()

- 0: radial in
- 1: radial out
- 2: horizontal left
- 3: horizontal right
- 4: random
- 5: none (still)

**Pause specific settings**

If the trial is to be pause trial, it needs to set "isPause" to true. Pauses are unpaused with spacebar or automatically continued if "automaticContinue" is set to true. If automatic continue is set to true, the pause will be unpaused after the time set in "duration" in ms.

- isPause (bool: false): if true, starts pause trial
- automaticContinue (bool: false): if true, will automatically continue after 5time determined in "duration"
- duration (int: 1000): if automatic continue is set, duration determines when it will happen
- wipeBufferedData (bool: false): If true, wipes data
- message (string: null): message to be displayed. Overwrites pauseMessage See below for formatting and options

## Controls
Any valid keypress is Spacebar. It reacts to keys and unpauses the experiemnt during pause section. 

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
- Correct, CorrectBlink: Number of correct trials (true negatives and true positives) or only correct blink trials (only true positives)
- Incorrect, IncorrectBlink: Number of incorrect trials (false negatives and false positives) or only false negatives (missed) blink trials
- RatioCorrect: Ratio of correct trials from all trials excluding pauses
- PercentageCorrect: Percentage of correct trials from all trials excluding pauses
- AvgReactionTimeMs, MinReactionTimeMs, MaxReactionTimeMax : Average, minimal and maximal reaction time for correct blink trials in miliseconds. Rounded to whole numbers
- AvgReactionTimeSec, MinReactionTimeSec, MaxReactionTimeSec : Average, minimal and maximal reaction time for correct blink trials in seconds. Rounded to 2 decimal places

## Tuorials for setup

https://github.com/UnJavaScripter/web-serial-example/blob/master/src/app.ts

https://codelabs.developers.google.com/codelabs/web-serial#2

https://wicg.github.io/serial/

https://web.dev/serial/

https://groups.google.com/a/chromium.org/g/chromium-dev/c/pjTmHImvymw
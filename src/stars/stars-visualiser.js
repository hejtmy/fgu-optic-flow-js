import { StarsController } from './stars.js';
import basesettings from './settings/basesettings.js';

let starsController = Object.create(StarsController);

var canvas = document.getElementById("space");
let experimentWindow = document.getElementById("experiment");

// BUTTONS -------------------

window.addEventListener('resize', function(event) {

}, true);

// FUNCTIONS ---------------

// INITIALIZATION -----------

document['starsController'] = starsController;

starsController.initialize(canvas);
starsController.start();
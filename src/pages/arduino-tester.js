import serial from '../serial.js';

const arduinoController = new serial.ArduinoController();
const getSerialMessages = document.getElementById('get-serial-messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit-button');
const connectButton = document.getElementById('connect-btn');
const serialMessagesContainer = document.getElementById('serial-messages-container');

messageForm.addEventListener('submit', event => {
    event.preventDefault();
    arduinoController.serialController.write(event.target.firstElementChild.value);
    getSerialMessage();
});

getSerialMessages.addEventListener('pointerdown', async () => {
    getSerialMessage();
});

document.getElementById('blink-btn').addEventListener('click', async () => {
    arduinoController.blink();
});

document.getElementById('pulseup-btn').addEventListener('click', async () => {
    let timestamp = new Date().getTime();
    console.log(timestamp);
    arduinoController.pulseUp();
});

document.getElementById('pulsedown-btn').addEventListener('click', async () => {
    arduinoController.pulseDown();
});

async function getSerialMessage() {
    await arduinoController.serialController.read() + '\n';
    serialMessagesContainer.innerText += arduinoController.serialController.lastValue + "\n";
}

connectButton.addEventListener('click', async () => {
    var connected = await arduinoController.connect();
    console.log(connected);
    if(connected){
        connectButton.innerHTML = "Disconnect";
        serialMessagesContainer.removeAttribute('disabled');
        messageInput.removeAttribute('disabled');
        submitButton.removeAttribute('disabled');
    }
})
class LineBreakTransformer {
  constructor() {
    this.container = '';
  }

  transform(chunk, controller) {
    this.container += chunk;
    const lines = this.container.split('\r\n');
    this.container = lines.pop();
    lines.forEach(line => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.container);
  }
}

class ArduinoController {
    serialController;
    connected;
    messageCallback;

    constructor(){
        this.serialController = new SerialController();
    }

    async connect(){
        await this.serialController.init();
        if(this.connected) return;
        // Necessary for Arduino to "get its footing"
        await new Promise(resolve => setTimeout(resolve, 2000));
        // add timeout for the effort to conenct
        this.serialController.write("WHO!");
        await this.serialController.read((value) => {
            console.log("value came " + value);
            if(value == "NEURODUINO"){
                this.serialController.stopReading();
                this.serialController.write("DONE!");
                this.connected = true;
            }
        })
        return this.connected;
    }

    startReading(callback = (value) => {}){
        this.serialController.messageCallback = callback;
        this.read();
    }

    stopReading(){
        this.serialController.stopReading();
    }

    blink(){
        if(!this.connected) return;
        this.serialController.write("BLINK!");
    }

    async pulseUp(callback = () => {}){
        if(!this.connected) return;
        this.serialController.write("PULSE+0001!");
    }

    async pulseDown(callback = () => {}){
        if(!this.connected) return;
        this.serialController.write("PULSE-!");
    }
}

class SerialController {
    reader;
    writer;
    encoder = new TextEncoder();
    lastValue;
    port;
    isReading;
    messageCallback = (val) => {};

    async init() {
        if(this.port != null) return;
        if ('serial' in navigator) {
            try {
                this.port = await navigator.serial.requestPort();
                await this.port.open({ baudRate: 9600 });
                //this.reader = this.port.readable.getReader();
                this.writer = this.port.writable.getWriter();
                await this.port.setSignals({ dataTerminalReady: true, requestToSend: true});
                let signals = await this.port.getSignals();
                console.log(signals)
            } catch(err) {
                console.error('There was an error opening the serial port:', err);
            }
        } else {
            console.error('Web serial doesn\'t seem to be enabled in your browser. Try enabling it by visiting:')
            console.error('chrome://flags/#enable-experimental-web-platform-features');
            console.error('opera://flags/#enable-experimental-web-platform-features');
            console.error('edge://flags/#enable-experimental-web-platform-features');
        }
    }

    async write(data) {
        this.keepReading = false;
        const dataArrayBuffer = this.encoder.encode(data);
        return await this.writer.write(dataArrayBuffer);
    }

    stopReading(){
        this.isReading = false;
    }

    async read(onMessage = (val) => {}, onFinished = () => {}){
        if(this.isReading) return;
        let keepReading = true;
        while (this.port.readable && keepReading) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
            const decodingReader = textDecoder.readable
                .pipeThrough(new TransformStream(new LineBreakTransformer()))
                .getReader();
            this.isReading = true;
            try{
                while(this.isReading){
                    const { value, done } = await decodingReader.read();
                    if (done) {
                        decodingReader.releaseLock();
                        break;
                    }
                    // Shoot an event
                    this.lastValue = value;
                    console.log(value);
                    onMessage(value);
                    this.messageCallback(value);
                    if(value == "DONE" || value == "TIME IS UP"){
                        break;
                    }
                }
            } finally {
                keepReading = false;
                this.isReading = false;
                onFinished();
                decodingReader.cancel();
                decodingReader.releaseLock();
                await readableStreamClosed.catch(() => { /* Ignore the error */ });
            }
        }
    }
}
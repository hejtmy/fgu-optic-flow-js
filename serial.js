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

class SerialController {
  reader;
  writer;
  encoder = new TextEncoder();
  value;
  port;
  isReading;

    async init() {
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
        const dataArrayBuffer = this.encoder.encode(data);
        return await this.writer.write(dataArrayBuffer);
    }

    async connect(){
        //await this.read
    }

    async read(){
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
                    this.value += value + "\n";
                    console.log(value);
                    if(value == "DONE" || value == "TIME IS UP"){
                        break;
                    }
                }
            } finally {
                keepReading = false;
                decodingReader.cancel();
                await readableStreamClosed.catch(() => { /* Ignore the error */ });
            }
        }
    }
}

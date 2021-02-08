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

    async init() {
        if ('serial' in navigator) {
            try {
                this.port = await navigator.serial.requestPort();
                await this.port.open({ baudRate: 9600 });
                this.reader = this.port.readable.getReader();
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

    async read(){
        const decoder = new TextDecoder();
        try {
          const readerData = await this.reader.read();
          return decoder.decode(readerData.value);
        } catch (err) {
          const errorMessage = `error reading data: ${err}`;
          console.error(errorMessage);
          return errorMessage;
        }
      }
}

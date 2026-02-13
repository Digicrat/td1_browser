export class SerialManager {
  constructor({ baudRate = 115200, onLine = null, onStatus = null } = {}) {
    this.baudRate = baudRate;
    this.onLine = onLine;
    this.onStatus = onStatus;

    this.port = null;
    this.reader = null;
    this.keepReading = false;

    this.lineBuffer = "";
  }

  status(msg) {
    console.log("[Serial]", msg);
    if (this.onStatus) this.onStatus(msg);
  }

  async connect() {
    try {
      this.port = await navigator.serial.requestPort();

      await this.port.open({ baudRate: this.baudRate });

      const decoder = new TextDecoderStream();
      this.port.readable.pipeTo(decoder.writable);

      this.reader = decoder.readable.getReader();

      this.keepReading = true;

      this.status("Connected");

      this.readLoop();

    } catch (err) {
      this.status("Connect error: " + err);
      throw err;
    }
  }

  async disconnect() {
    try {
      this.keepReading = false;

      if (this.reader) {
        await this.reader.cancel();
        this.reader.releaseLock();
        this.reader = null;
      }

      if (this.port) {
        await this.port.close();
        this.port = null;
      }

      this.status("Disconnected");

    } catch (err) {
      this.status("Disconnect error: " + err);
    }
  }

  async readLoop() {
    try {
      while (this.keepReading) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) this.processChunk(value);
      }
    } catch (err) {
      this.status("Read error: " + err);
    }
  }

  processChunk(text) {
    this.lineBuffer += text;

    while (true) {
      const idx = this.lineBuffer.indexOf("\n");
      if (idx < 0) break;

      let line = this.lineBuffer.slice(0, idx);
      this.lineBuffer = this.lineBuffer.slice(idx + 1);

      line = line.replace(/\r$/, "");

      if (this.onLine) this.onLine(line);
    }
  }
}

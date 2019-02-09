import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private source: AudioBufferSourceNode;
  private analyser: AnalyserNode;
  private s: number;
  private dataArray: Uint8Array;
  private callback: Function;
  private req: number;

  constructor() {
  }

  async setup(url) {
    const context = new AudioContext();

    const response = await fetch(url);
    const audioBuffer = await context.decodeAudioData(await response.arrayBuffer());

    this.source = context.createBufferSource();
    this.source.buffer = audioBuffer;

    this.analyser = context.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;

    const bufferLength = this.analyser.frequencyBinCount;
    console.log('bufferLength: ', bufferLength);
    this.dataArray = new Uint8Array(bufferLength);
    this.s = bufferLength / 3;
    this.source.connect(this.analyser);
    this.analyser.connect(context.destination);
  }

  process() {
    this.req = requestAnimationFrame(this.process.bind(this));
    this.analyser.getByteFrequencyData(this.dataArray);
    this.callback([0, 1, 2].map(i => {
      const slice1 = this.dataArray.slice(this.s * i, this.s * (i + 1));
      return Math.round(avg(slice1));
    }))
    // mins[i] = Math.min(mins[i], mean);
    // maxs[i] = Math.max(maxs[i], mean);
  }


  start(callback) {
    this.callback = callback;
    this.process();
    this.source.start();
  }

  stop() {
    this.source.stop();
    cancelAnimationFrame(this.req)
  }
}

function avg(arr) {
  let sum = 0;
  for (let x of arr) {
    sum += x
  }
  return sum / arr.length;
}

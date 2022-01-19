import SpeedMeasurator from "speed-measurator";
import { ReadableStream } from 'node:stream/web';

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

const sm = new SpeedMeasurator()

const rstream = new ReadableStream({
  value: 100,
  pull(controller) {
      controller.enqueue(this.value)
      sm.addHistory(this.value) // add history 100 value

      return delay(100) // delay 0.1 sec
  }
})

for await (const v of rstream) {
  console.log(v, sm.getSpeed(), '/sec');
}

// 100 100 /sec
// 100 200 /sec
// 100 300 /sec
// 100 400 /sec
// 100 500 /sec
// 100 600 /sec
// 100 700 /sec
// 100 800 /sec
// 100 900 /sec
// 100 1000 /sec
// 100 1000 /sec
// 100 1000 /sec
// 100 1000 /sec
// ...

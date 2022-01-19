import SpeedMeasurator from "speed-measurator";
import { ReadableStream } from 'node:stream/web';

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

const sm = new SpeedMeasurator()

sm.setOnSpeedChange((speed, historys) => {
  console.log(speed, '/sec');
})

const rstream = new ReadableStream({
  value: 100,
  pull(controller) {
      controller.enqueue(this.value)
      sm.addHistory(this.value)

      return delay(100)
  }
})

for await (const v of rstream) {
}
// 100 /sec
// 200 /sec
// 300 /sec
// 400 /sec
// 500 /sec
// 600 /sec
// 700 /sec
// 800 /sec
// 900 /sec
// 1000 /sec
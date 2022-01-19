# speed-measurator

> This object internally stores a second of history and measures the current speed.

## Getting Started

### Installation

```bash
npm install speed-measurator
```

### usage

* add history and get speed
```js
import SpeedMeasurator from "speed-measurator";

const sm = new SpeedMeasurator()

sm.addHistory(100)
sm.addHistory(100)
sm.addHistory(100)

console.log(sm.getSpeed(), '/sec') 
// 300 /sec
```

* with async generator
> It sends 100 data every 300 ms.
```js
import SpeedMeasurator from "speed-measurator";

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

async function *gen() {
  for(let i=0; i<10; i++) {
    await delay(300)
    yield 100
  }
}

const sm = new SpeedMeasurator()

const start = new Date()

for await(const v of gen()) {
  sm.addHistory(100)
  console.log(new Date() - start, sm.getSpeed(), '/sec')
}

// 303 100 /sec
// 615 200 /sec
// 917 300 /sec
// 1217 400 /sec
// 1519 400 /sec
// 1820 400 /sec
// 2122 400 /sec
// 2424 400 /sec
// 2725 400 /sec
// 3027 400 /sec
```

* with stream
> It sends 100 data every 100 ms.
```js
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
```

* onAddHistory, onSpeedChange
```js
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
```

# API

## d.ts
```ts
export interface history {
    value: number;
    date: number;
}

export declare type OnSpeedChange = (speed: number, historys: ReadonlyArray<history>) => void;
export declare type OnAddHistory = (speed: number, historys: ReadonlyArray<history>) => void;

export default class SpeedMeasurator {
    private historys;
    private lastSpeed;
    private onSpeedChange;
    private onAddHistory;
    private cuttingOverTime;
    private measurSpeed;
    private runOnSpeedChange;
    private setLastSpeed;
    private checkSpeedChange;
    private runOnAddHistory;
    getSpeed(): number;
    setOnSpeedChange(fn: OnSpeedChange | null): void;
    setOnAddHistory(fn: OnAddHistory | null): void;
    addHistory(value: number, date?: number): void;
}
```

## `SpeedMeasurator.getSpeed(): number`
> Calculate the speed of 1 second from the current time.

## `SpeedMeasurator.setOnSpeedChange(fn: OnSpeedChange | null): void`
> It stores a function to be called whenever the speed of a second changes.

**NOTE**
For your information, stored functions are called only when the 
speed is calculated (when the getSpeed method or addHistory method is called).

## `SpeedMeasurator.setOnAddHistory(fn: OnAddHistory | null): void;`
> Saved functions are called when the addHistory method is called.

## `SpeedMeasurator.addHistory(value: number, date?: number): void;`
> Add value to history.
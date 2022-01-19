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
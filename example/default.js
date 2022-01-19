import SpeedMeasurator from "speed-measurator";

const sm = new SpeedMeasurator()

sm.addHistory(100)
sm.addHistory(100)
sm.addHistory(100)

console.log(sm.getSpeed(), '/sec') 
// 300 /sec
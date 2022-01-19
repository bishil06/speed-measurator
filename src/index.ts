export interface history {
  value: number,
  date: number
}

export type OnSpeedChange = (speed: number, historys: ReadonlyArray<history>) => void;
export type OnAddHistory = (speed: number, historys: ReadonlyArray<history>) => void;

export default class SpeedMeasurator {
  private historys: history[] = []
  private lastSpeed: number = 0
  private onSpeedChange: OnSpeedChange | null = null
  private onAddHistory: OnAddHistory | null = null

  private cuttingOverTime(now: number) {
    const index = this.historys.findIndex((h) => (now - h.date) < 1000)
    this.historys = index > -1 ? this.historys.slice(index) : []
  }

  private measurSpeed() {
    return this.historys.reduce((total, h) => total+h.value, 0)
  }

  private runOnSpeedChange(newSpeed: number) {
    if (this.onSpeedChange !== null) {
      this.onSpeedChange(newSpeed, this.historys)
    }
  }

  private setLastSpeed(newSpeed: number) {
    this.lastSpeed = newSpeed

    this.runOnSpeedChange(newSpeed)
  }

  private checkSpeedChange(newSpeed: number) {
    const result = this.lastSpeed !== newSpeed

    return result
  }

  private runOnAddHistory(newSpeed: number) {
    if (this.onAddHistory !== null) {
      this.onAddHistory(newSpeed, this.historys)
    }
  }

  getSpeed() {
    this.cuttingOverTime(Date.now())

    const newSpeed = this.measurSpeed()

    if (this.checkSpeedChange(newSpeed)) {
      this.setLastSpeed(newSpeed)
    }

    return newSpeed
  }

  setOnSpeedChange(fn: OnSpeedChange | null) {
    this.onSpeedChange = fn
  }

  setOnAddHistory(fn: OnAddHistory | null) {
    this.onAddHistory = fn
  }

  addHistory(value: number, date = Date.now()) {
    this.cuttingOverTime(date)
    this.historys.push({ value, date })

    const newSpeed = this.measurSpeed()

    if (this.checkSpeedChange(newSpeed)) {
      this.setLastSpeed(newSpeed)
    }

    this.runOnAddHistory(newSpeed)
  }
}
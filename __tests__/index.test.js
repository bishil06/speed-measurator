const SpeedMeasurator = require('../dist/index.cjs')

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

describe('SpeedMeasurator', () => {
  test('defined', () => {
    expect(SpeedMeasurator).toBeDefined()
  })

  test('new', () => {
    expect(new SpeedMeasurator()).toBeInstanceOf(SpeedMeasurator)
  })

  test('add', () => {
    const sm = new SpeedMeasurator()

    sm.addHistory(100)
    sm.addHistory(100)
    sm.addHistory(100)

    expect(sm.getSpeed()).toBe(300)
  })

  test('add after 1sec + 0.5sec', async () => {
    const sm = new SpeedMeasurator()

    sm.addHistory(100)
    expect(sm.getSpeed()).toBe(100)
    sm.addHistory(100)
    expect(sm.getSpeed()).toBe(200)
    sm.addHistory(100)
    expect(sm.getSpeed()).toBe(300)

    await delay(1000)
    expect(sm.getSpeed()).toBe(0)

    sm.addHistory(100)
    await delay(500)
    expect(sm.getSpeed()).toBe(100)
  })

  test('onAddHistory, onSpeedChange after 1sec + 0.5sec + 0.5sec', async () => {
    const mockFn = jest.fn()
    const mockFn2 = jest.fn()

    const sm = new SpeedMeasurator()

    sm.setOnAddHistory(mockFn)
    sm.setOnSpeedChange(mockFn2)

    sm.addHistory(100)
    expect(sm.getSpeed()).toBe(100)
    expect(mockFn).toBeCalledTimes(1)
    expect(mockFn2).toBeCalledTimes(1)

    sm.addHistory(100)
    expect(sm.getSpeed()).toBe(200)
    expect(mockFn).toBeCalledTimes(2)
    expect(mockFn2).toBeCalledTimes(2)

    sm.addHistory(100)
    expect(sm.getSpeed()).toBe(300)
    expect(mockFn).toBeCalledTimes(3)
    expect(mockFn2).toBeCalledTimes(3)

    await delay(1000)
    expect(sm.getSpeed()).toBe(0)
    expect(mockFn).toBeCalledTimes(3)
    expect(mockFn2).toBeCalledTimes(4)

    sm.addHistory(100)
    expect(mockFn).toBeCalledTimes(4)
    expect(mockFn2).toBeCalledTimes(5)

    await delay(500)
    expect(sm.getSpeed()).toBe(100)
    expect(mockFn2).toBeCalledTimes(5)

    await delay(500)
    expect(sm.getSpeed()).toBe(0)
    expect(mockFn2).toBeCalledTimes(6)
  })
})
export const engine = (speed: number, frameCallback?: Function, complete?:Function) => {
  let raf: number
  let start: number
  function play() {
    raf = requestAnimationFrame(step)
  }
  function step(t: number) {
    if (!start) {
      start = t
    }
    const run = t - start
    const progress = Math.min(run / speed, 1)
    frameCallback && frameCallback(progress)
    if (run <= speed) {
      play()
    } else {
      complete && complete()
      cancelAnimationFrame(raf)
    }
  }
  return play
}
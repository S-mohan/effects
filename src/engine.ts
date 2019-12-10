import { Tween, TweenHandler } from './tween'

export interface AnimateHandler {
  (progress: number): void
}

export interface EngineHandler extends Function {
  cancel: Function
}


/**
 * engine
 * @param handler 
 * @param duration 
 * @param easing 
 * @param complete 
 * @return EngineHandler
 */
export const engine = (handler: AnimateHandler, duration: number, easing: TweenHandler = Tween.linear, complete?: Function): EngineHandler => {
  const start = performance.now()
  let raf: number

  const play:EngineHandler = () => raf = requestAnimationFrame(step)
  play.cancel = () => {
    raf && cancelAnimationFrame(raf)
  }

  const step = (time: number) => {
    const fraction = (time - start) / duration
    if (fraction < 0) {
      return play()
    }
    if (fraction > 1) {
      handler(1)
      complete && complete()
      play.cancel()
    }
    else {
      const progress = easing(fraction)
      handler(progress)
      play()
    }
  }

  return play
}


export default engine
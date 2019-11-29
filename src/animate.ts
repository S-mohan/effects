import { Tween, TweenHandler } from './tween'

export interface animateHandler {
  (progress: number): void
}

/**
 * animate
 * @param handler 
 * @param duration 
 * @param easing 
 * @param complete 
 * @return Function
 */
export const animate = (handler: animateHandler, duration: number, easing: TweenHandler = Tween.linear, complete?: Function): Function => {
  const start = performance.now()
  let raf: number
  const play = () => {
    raf = requestAnimationFrame(step)
  }
  const step = (time: number) => {
    const fraction = (time - start) / duration
    if (fraction > 1) {
      handler(1)
      complete && complete()
      cancelAnimationFrame(raf)
    }
    else {
      const progress = easing(fraction)
      handler(progress)
      play()
    }
  }

  return play
}


export default animate
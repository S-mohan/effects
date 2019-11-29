export interface TweenHandler {
  (t:number):number
}

export class Tween {
  static linear (t:number):number {
    return t
  }

  static quadraticIn (t: number):number {
    return t * t
  }

  static quadraticOut (t: number): number {
    return t * (2 - t)
  }

  static quadraticInOut (t: number): number {
    if ((t *= 2) < 1) {
      return t * t * .5
    }

    return - 0.5 * (--t * (t - 2) - 1)
  }

}

export default Tween
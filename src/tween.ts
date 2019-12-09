// https://github.com/tweenjs/tween.js/blob/master/src/Tween.js

export interface TweenHandler {
  (t: number): number
}

export class Tween {
  static linear(t: number): number {
    return t
  }

  static quadraticIn(t: number): number {
    return t * t
  }

  static quadraticOut(t: number): number {
    return t * (2 - t)
  }

  static quadraticInOut(t: number): number {
    if ((t *= 2) < 1) {
      return t * t * .5
    }
    return - 0.5 * (--t * (t - 2) - 1)
  }

  static cubicIn(t: number): number {
    return t * t * t
  }

  static cubicOut(t: number): number {
    return --t * t * t + 1
  }

  static cubicInOut(t: number): number {
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t
    }
    return 0.5 * ((t -= 2) * t * t + 2)
  }

  static quarticIn(t: number): number {
    return t * t * t * t
  }

  static quarticOut(t: number): number {
    return 1 - (--t * t * t * t)
  }

  static quarticInOut(t: number): number {
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t * t
    }

    return - 0.5 * ((t -= 2) * t * t * t - 2)
  }

  static circularIn(t: number): number {
    return 1 - Math.sqrt(1 - t * t)
  }

  static circularOut(t: number): number {
    return Math.sqrt(1 - (--t * t))
  }

  static circularInOut(t: number): number {
    if ((t *= 2) < 1) {
      return - 0.5 * (Math.sqrt(1 - t * t) - 1)
    }
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
  }

  static elasticIn(t: number): number {
    if (t === 0) {
      return 0
    }

    if (t === 1) {
      return 1
    }

    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
  }

  static elasticOut(t: number): number {
    if (t === 0) {
      return 0
    }

    if (t === 1) {
      return 1
    }

    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
  }

  static elasticInOut(t: number): number {
    if (t === 0) {
      return 0
    }

    if (t === 1) {
      return 1
    }

    t *= 2

    if (t < 1) {
      return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
    }

    return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1
  }

  static bounceIn(t: number): number {
    return 1 - Tween.bounceOut(1 - t)
  }

  static bounceOut(t: number): number {
    if (t < (1 / 2.75)) {
      return 7.5625 * t * t
    } else if (t < (2 / 2.75)) {
      return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75
    } else if (t < (2.5 / 2.75)) {
      return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375
    } else {
      return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375
    }
  }

  static bounceInOut(t: number): number {
    if (t < 0.5) {
      return Tween.bounceIn(t * 2) * 0.5
    }
    return Tween.bounceOut(t * 2 - 1) * 0.5 + 0.5
  }

}

export default Tween
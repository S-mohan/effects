import { engine } from './engine'
import { TweenHandler } from './tween'
export interface AnimateProps {
  $el: HTMLElement
  img: HTMLImageElement
  width: number
  height: number
  duration: number
  type?: string
  easing?: TweenHandler
}

export interface AnimateCallback {
  (): void
}


const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1

const PRESS_RATIO = 15
const UNCOVER_SIZE = 30
const TOOTH_COUNT = 8

const getRatioSize = (width: number, height: number) => {
  const ratio = DEVICE_PIXEL_RATIO / 1
  return {
    RW: (width * ratio) | 0,
    RH: (height * ratio) | 0
  }
}


const createCanvas = (width: number, height: number, img?: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const { RW, RH } = getRatioSize(width, height)
  canvas.width = RW
  canvas.height = RH
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  if (img) {
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, RW, RH)
  }
  return canvas
}


export const fillCanvasBeforePlay = ($el: HTMLElement, width: number, height: number, img?: HTMLImageElement): HTMLCanvasElement => {
  const canvas = createCanvas(width, height, img)
  $el.innerHTML = ''
  $el.appendChild(canvas)
  return canvas
}

const getRevertImageData = (source: ImageData, target: ImageData) => {
  for (let i = 0, h = source.height; i < h; i++) {
    for (let j = 0, w = source.width; j < w; j++) {
      target.data[i * w * 4 + j * 4 + 0] = source.data[(h - i) * w * 4 + j * 4 + 0]
      target.data[i * w * 4 + j * 4 + 1] = source.data[(h - i) * w * 4 + j * 4 + 1]
      target.data[i * w * 4 + j * 4 + 2] = source.data[(h - i) * w * 4 + j * 4 + 2]
      target.data[i * w * 4 + j * 4 + 3] = source.data[(h - i) * w * 4 + j * 4 + 3]
    }
  }
  return target
}


const getTransformCssText = (type: string, progress: number, width: number, height: number) => {
  let transform = 'left top'
  let origin
  switch (type) {
    case 'PullInUp':
      origin = 'left bottom'
      transform = `scale(1, ${progress})`
      break
    case 'PullInDown':
      origin = 'left top'
      transform = `scale(1, ${progress})`
      break
    case 'PullInLeft':
      origin = 'right top'
      transform = `scale(${progress}, 1)`
      break
    case 'PullInRight':
      origin = 'left top'
      transform = `scale(${progress}, 1)`
      break
    case 'ZoomIn':
      origin = 'center center'
      transform = `scale(${progress})`
      break
    case 'ZommInX':
      origin = 'center center'
      transform = `scale(${progress}, 1)`
      break
    case 'ZoomInY':
      origin = 'center center'
      transform = `scale(1, ${progress})`
      break
    case 'SlideInUp':
      origin = 'left top'
      transform = `translate(0, ${(1 - progress) * height}px)`
      break
    case 'SlideInDown':
      origin = 'left top'
      transform = `translate(0, ${(1 - progress) * -1 * height}px)`
      break
    case 'SlideInRight':
      origin = 'left top'
      transform = `translate(${(1 - progress) * -1 * width}px, 0)`
      break
    case 'SlideInLeft':
      origin = 'left top'
      transform = `translate(${(1 - progress) * width}px, 0)`
      break
    case 'PressInUp':
      origin = 'top left'
      transform = `scale(1, ${1 + PRESS_RATIO * (1 - progress)})`
      break
    case 'PressInDown':
      origin = 'bottom left'
      transform = `scale(1, ${1 + PRESS_RATIO * (1 - progress)})`
      break
    case 'PressInLeft':
      origin = 'top left'
      transform = `scale(${1 + PRESS_RATIO * (1 - progress)}, 1)`
      break
    case 'PressInRight':
      origin = 'top right'
      transform = `scale(${1 + PRESS_RATIO * (1 - progress)}, 1)`
      break
    case 'PressInX':
      origin = 'center center'
      transform = `scale(${1 + PRESS_RATIO * (1 - progress)}, 1)`
      break
    case 'PressInY':
      origin = 'center center'
      transform = `scale(1, ${1 + PRESS_RATIO * (1 - progress)})`
      break
  }

  return `transform-origin:${origin}; transform:${transform};`
}

// pull/slider
export const animatePullAndSlider = (props: AnimateProps): Function => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height, img)
  canvas.style.cssText += getTransformCssText(type, 0, width, height)
  const handler = (progress: number) => canvas.style.cssText += getTransformCssText(type, progress, width, height)
  return engine(handler, duration, easing)
}


// fade
export const animateFade = (props: AnimateProps): Function => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height, img)
  const fadeIn = type === 'FadeIn'
  canvas.style.opacity = fadeIn ? '0' : '1'
  const handler = (progress: number) => canvas.style.opacity =  fadeIn ? `${progress}` : `${1 - progress}`
  return engine(handler, duration, easing, () => {
    canvas.style.opacity = ''
  })
}

export const animateShutter = (props: AnimateProps): Function => {
  return
}

// 卷轴
export const animateUncover = (props: AnimateProps): Function => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height, img)
  const ctx = canvas.getContext('2d')
  let helper = createCanvas(width, height, img)
  let helperCtx = helper.getContext('2d')
  let helper2 = createCanvas(width, height)
  let helper2Ctx = helper2.getContext('2d')
  const { RW, RH } = getRatioSize(width, height)
  const sourceData = helperCtx.getImageData(0, 0, RW, RH)
  const targetData = helperCtx.getImageData(0, 0, RW, RH)
  const vImageData = getRevertImageData(sourceData, targetData)
  helper2Ctx.putImageData(vImageData, 0, 0)
  const isFromTop = type === 'UncoverFromTop'

  const handler = (progress: number) => {
    ctx.clearRect(0, 0, RW, RH)
    const h = progress * RH
    let y1 = isFromTop ? (RH - h - UNCOVER_SIZE) : (h + UNCOVER_SIZE)
    y1 = Math.max(0, Math.min(y1, RH - UNCOVER_SIZE))
    const imageData = helper2Ctx.getImageData(0, y1, RW, UNCOVER_SIZE)
    ctx.putImageData(imageData, 0, isFromTop ? h - 1 : RH - h - UNCOVER_SIZE)
    if (h >= 1) {
      const mainData = helperCtx.getImageData(0, isFromTop ? 0 : RH - h, RW, h)
      ctx.putImageData(mainData, 0, isFromTop ? 0 : RH - h)
    }
  }

  return engine(handler, duration, easing, () => {
    helper = null
    helperCtx = null
    helper2 = null
    helper2Ctx = null
  })
}

// 滚轮
export const animateWheel = (props: AnimateProps): Function => {
  const { $el, width, height, img, duration, easing } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let helper = createCanvas(width, height, img)
  const pattern = ctx.createPattern(helper, 'no-repeat')
  const { RW, RH } = getRatioSize(width, height)
  // 对角线作为直径
  const radius = Math.sqrt((Math.pow(RW, 2) + Math.pow(RH, 2))) / 2
  ctx.fillStyle = pattern
  const PI2 = Math.PI * 2
  const sAngle = Math.PI / -2
  const handler = (progress: number) => {
    ctx.clearRect(0, 0, RW, RH)
    ctx.beginPath()
    ctx.moveTo(RW / 2, RH / 2)
    const eAngle = PI2 * progress - Math.PI / 2
    ctx.arc(RW / 2, RH / 2, radius, sAngle, eAngle, false)
    ctx.fill()
  }

  return engine(handler, duration, easing, () => {
    helper = null
  })
}

// 咬合
export const animateTooth = (props: AnimateProps): Function => {
  const { $el, width, height, img, duration, easing } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let helper = createCanvas(width, height, img)
  let helperCtx = helper.getContext('2d')
  const { RW, RH } = getRatioSize(width, height)
  const perWidth = Math.ceil(RW / TOOTH_COUNT)

  const handler = (progress: number) => {
    ctx.clearRect(0, 0, RW, RH)
    if (progress === 0) {
      return
    }
    for (let i = 0; i < TOOTH_COUNT; i++) {
      const x = i * perWidth
      const h = progress * RH
      if (h < 1) {
        continue
      }
      let getY
      let y
      // 下半部分
      if (i % 2 === 0) {
        getY = 0
        y = RH - h
      }
      // 上半部分
      else {
        getY = RH - h
        y = 0
      }
      const imageData = helperCtx.getImageData(x, getY, perWidth, h)
      ctx.putImageData(imageData, x, y)
    }
  }

  return engine(handler, duration, easing, () => {
    helper = null
    helperCtx = null
  })
}

// 变焦全屏
export const animateZoomFullScreen = (props: AnimateProps): Function => {
  const { $el, width, height, img, duration, easing } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let helper = createCanvas(width, height, img)
  let helperCtx = helper.getContext('2d')
  const { RW, RH } = getRatioSize(width, height)
  const helfWidth = RW / 2
  const handler = (progress: number) => {
    ctx.clearRect(0, 0, RW, RH)
    const w = progress * helfWidth
    const h = RH * progress
    if (h < 1) {
      return
    }
    // 右边的，右上角开始
    const rightX = helfWidth
    const rightY = RH - h
    const rightImageData = helperCtx.getImageData(RW - w, 0, w + 1, h + 1)
    ctx.putImageData(rightImageData, rightX, rightY)
    // 左边的, 左上角开始
    const leftX = helfWidth - progress * helfWidth
    const leftY = RH - h
    const leftImageData = helperCtx.getImageData(0, 0, w + 1, h + 1)
    ctx.putImageData(leftImageData, leftX, leftY)
  }
  return engine(handler, duration, easing, () => {
    helper = null
    helperCtx = null
  })
}

// 堆积
export const animateStackIn = (props: AnimateProps): Function => {

  return
}
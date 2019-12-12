import { WithCustormPropsElement } from './'
import { engine, EngineHandler } from './engine'
import { TweenHandler } from './tween'
export interface AnimateProps {
  $el: WithCustormPropsElement
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
const UNCOVER_SIZE = 30 * DEVICE_PIXEL_RATIO | 0
const TOOTH_COUNT = 8
const STACK_SCALE = 4
const SHUTTER_COUNT = 16
const LASER_SCALE = 60
// Mac电脑超过20000会有卡顿，这里设置个最大的阈值，并且和设备分辨率关联
const MAX_RESOLUTION_RATIO  = 40000 / DEVICE_PIXEL_RATIO | 0

/**
 * 获取真实物理像素，解决高清屏模糊
 * @param width 
 * @param height 
 */
const getRatioSize = (width: number, height: number) => {
  const ratio = DEVICE_PIXEL_RATIO / 1
  return {
    RW: (width * ratio) | 0,
    RH: (height * ratio) | 0
  }
}

/**
 * 创建canvas对象
 * @param width 
 * @param height 
 * @param img 
 */
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

/**
 * 在容器中填充canvas
 * @param $el 
 * @param width 
 * @param height 
 * @param img 
 */
export const fillCanvasBeforePlay = ($el: WithCustormPropsElement, width: number, height: number, img?: HTMLImageElement): HTMLCanvasElement => {
  const canvas = createCanvas(width, height, img)
  $el.innerHTML = ''
  $el.appendChild(canvas)
  $el.__playing__ = true
  return canvas
}

/**
 * 获取一个反转后的ImageData
 * @param source 
 * @param target 
 */
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

/**
 * 使用CSS动画的方式，
 * 获取即时的transform样式
 * @param type 
 * @param progress 
 * @param width 
 * @param height 
 */
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

// 扩展和平移(动画使用CSS)
export const animatePullAndSlider = (props: AnimateProps): EngineHandler => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height, img)
  canvas.style.cssText += getTransformCssText(type, 0, width, height)
  const handler = (progress: number) => canvas.style.cssText += getTransformCssText(type, progress, width, height)
  return engine(handler, duration, easing, () => $el.__playing__ = false)
}

// 渐隐渐现(动画使用CSS)
export const animateFade = (props: AnimateProps): EngineHandler => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height, img)
  const fadeIn = type === 'FadeIn'
  canvas.style.opacity = fadeIn ? '0' : '1'
  const handler = (progress: number) => canvas.style.opacity = fadeIn ? `${progress}` : `${1 - progress}`
  return engine(handler, duration, easing, () => {
    canvas.style.opacity = ''
    $el.__playing__ = false
  })
}

// 百叶窗
export const animateShutter = (props: AnimateProps): EngineHandler => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let helper = createCanvas(width, height, img)
  let helperCtx = helper.getContext('2d')
  const { RW, RH } = getRatioSize(width, height)

  const isX = type === 'ShutterX'
  const perSize = Math.ceil((isX ? RH : RW) / SHUTTER_COUNT)

  const handler = (progress: number) => {
    ctx.clearRect(0, 0, RW, RH)
    for (let i = 0; i < SHUTTER_COUNT; i++) {
      const pos = i * perSize
      const val = progress * perSize
      const x = isX ? 0 : pos
      const y = isX ? pos : 0
      const w = isX ? RW : val
      const h = isX ? val : RH
      if (val >= 1) {
        const imageData = helperCtx.getImageData(x, y, w, h)
        ctx.putImageData(imageData, x, y)
      }
    }
  }

  return engine(handler, duration, easing, () => {
    helper = null
    helperCtx = null
    $el.__playing__ = false
  })
}

// 卷轴
export const animateUncover = (props: AnimateProps): EngineHandler => {
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
    ctx.putImageData(imageData, 0, isFromTop ? h - 1 : RH - h - UNCOVER_SIZE + 1)
    if (h >= 1) {
      const mainData = helperCtx.getImageData(0, isFromTop ? 0 : RH - h, RW, h)
      ctx.putImageData(mainData, 0, isFromTop ? 0 : RH - h + 1)
    }
  }

  return engine(handler, duration, easing, () => {
    helper = null
    helperCtx = null
    helper2 = null
    helper2Ctx = null
    $el.__playing__ = false
  })
}

// 滚轮
export const animateWheel = (props: AnimateProps): EngineHandler => {
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
    $el.__playing__ = false
  })
}

// 咬合
export const animateTooth = (props: AnimateProps): EngineHandler => {
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
    $el.__playing__ = false
  })
}

// 变焦全屏
export const animateZoomFullScreen = (props: AnimateProps): EngineHandler => {
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
    $el.__playing__ = false
  })
}

// 堆积和镭射
export const animateStackIn = (props: AnimateProps): EngineHandler => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  const { RW, RH } = getRatioSize(width, height)
  let SW = width
  let SH = height
  switch (type) {
    case 'StackInTop':
    case 'StackInBottom':
      SH = RH * STACK_SCALE
      break
    case 'TopLaser':
    case 'BottomLaser':
      SH = RH * LASER_SCALE
      break
    case 'StackInLeft':
    case 'StackInRight':
      SW = RW * STACK_SCALE
      break
    case 'LeftLaser':
    case 'RightLaser':
      SW = RW * LASER_SCALE
      break
  }
  SW = Math.min(MAX_RESOLUTION_RATIO, SW)
  SH = Math.min(MAX_RESOLUTION_RATIO, SH)

  // 拉伸后的图
  let helper = createCanvas(SW, SH, img)
  let helperCtx = helper.getContext('2d')
  const fixedRect = getRatioSize(SW, SH)
  SW = fixedRect.RW
  SH = fixedRect.RH
  const isHorizontal = SW > RW
  const isVertical = SH > RH
  const handler = (progress: number) => {
    ctx.clearRect(0, 0, RW, RH)
    let sx, sy, sw, sh, dx, dy, dw, dh
    let isToLeft = false
    let isToTop = false
    if (progress === 0) {
      return
    }
    switch (type) {
      case 'StackInLeft':
      case 'RightLaser':
        sw = SW * progress
        dw = RW * progress
        sh = SH
        dh = RH
        sx = 0
        sy = 0
        dx = 0
        dy = 0
        isToLeft = true
        break
      case 'StackInRight':
      case 'LeftLaser':
        sw = SW * progress
        dw = RW * progress
        sh = SH
        dh = RH
        sx = SW - sw
        sy = 0
        dx = RW - dw
        dy = 0
        break
      case 'StackInTop':
      case 'BottomLaser':
        sw = SW
        dw = RW
        sh = SH * progress
        dh = RH * progress
        sx = 0
        sy = 0
        dx = 0
        dy = 0
        isToTop = true
        break
      case 'StackInBottom':
      case 'TopLaser':
        sw = SW
        dw = RW
        sh = SH * progress
        dh = RH * progress
        sx = 0
        sy = SH - sh
        dx = 0
        dy = RH - dh
        break
    }
    ctx.drawImage(helper, sx, sy, sw, sh, dx, dy, dw, dh)

    // 水平方向
    if (isHorizontal) {
      const pw = SW - sw
      const psx = isToLeft ? SW - pw : 0
      const pdx = isToLeft ? dw : (dx - sx)
      const imageData = helperCtx.getImageData(psx, 0, pw + 1, RH)
      ctx.putImageData(imageData, pdx, 0)
    }
    // 垂直方向
    else if (isVertical) {
      const ph = SH - sh
      const psy = isToTop ? SH - ph : 0
      const pdy = isToTop ? dh : (dy - sy)
      const imageData = helperCtx.getImageData(0, psy, RW, ph + 1)
      ctx.putImageData(imageData, 0, pdy)
    }
  }

  return engine(handler, duration, easing, () => {
    helper = null
    helperCtx = null
    $el.__playing__ = false
  })
}
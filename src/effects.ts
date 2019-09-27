import { engine } from './engine'

export interface AnimateProps {
  $el: HTMLElement
  img: HTMLImageElement
  width: number
  height: number
  speed: number
  type?: string
}

const SHUTTER_COUNT = 20
const UNCOVER_SIZE = 30
const TOOTH_COUNT = 8
const STACK_SCALE = 4

const fillImageBeforePlay = ($el: HTMLElement, img: HTMLImageElement, width: number, height: number) => {
  img.width = width
  img.height = height
  img.style.cssText = ''
  $el.innerHTML = ''
  $el.appendChild(img)
}


const fillCanvasBeforePlay = ($el: HTMLElement, width: number, height: number) => {
  $el.innerHTML = ''
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  $el.appendChild(canvas)
  return canvas
}


const getHelperCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return {
    canvas,
    ctx: canvas.getContext('2d')
  }
}


const getRevertImageData = (source: ImageData, target: ImageData, direction: string) => {
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


export const animateFadeIn = (props: AnimateProps) => {
  const { $el, width, height, img, speed } = props
  fillImageBeforePlay($el, img, width, height)
  const start = 0
  const end = (value: number) => $el.style.opacity = String(value)
  end(start)
  return engine(speed, (progress: number) => end(progress))
}


export const animateShutter = (props: AnimateProps) => {
  const { $el, width, height, img, speed } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let { ctx: helperCtx, canvas: helperCanvas } = getHelperCanvas(width, height)

  helperCtx.drawImage(img, 0, 0, width, height)
  const isX = props.type === 'ShutterX'
  const perSize = Math.ceil((isX ? height : width) / SHUTTER_COUNT)

  const end = (value: number) => {
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < SHUTTER_COUNT; i++) {
      const pos = i * perSize
      const val = value * perSize
      const x = isX ? 0 : pos
      const y = isX ? pos : 0
      const w = isX ? width : val
      const h = isX ? val : height
      if (val >= 1) {
        const imageData = helperCtx.getImageData(x, y, w, h)
        ctx.putImageData(imageData, x, y)
      }
    }
  }

  return engine(speed, (progress: number) => end(progress), () => { helperCanvas = helperCtx = null })
}


export const animateUncover = (props: AnimateProps) => {
  const { $el, width, height, img, speed } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let { ctx: helperCtx, canvas: helperCanvas } = getHelperCanvas(width, height)
  let { ctx: helperCtx2, canvas: helperCanvas2 } = getHelperCanvas(width, height)
  helperCtx.drawImage(img, 0, 0, width, height)
  const sourceImageData = helperCtx.getImageData(0, 0, width, height)
  const targetImageData = helperCtx.getImageData(0, 0, width, height)
  const vImageData = getRevertImageData(sourceImageData, targetImageData, 'y')
  helperCtx2.putImageData(vImageData, 0, 0)
  const isFromTop = props.type === 'UncoverFromTop'

  const end = (value: number) => {
    ctx.clearRect(0, 0, width, height)
    const h = value * height
    const y1 = isFromTop ? (height - h - UNCOVER_SIZE) : h + UNCOVER_SIZE
    const imageData = helperCtx2.getImageData(0, y1, width, UNCOVER_SIZE)
    ctx.putImageData(imageData, 0, isFromTop ? h : height - h - UNCOVER_SIZE)
    if (h > 1) {
      const H = (h + UNCOVER_SIZE + 1) >= height ? height : h
      const imageData = helperCtx.getImageData(0, isFromTop ? 0 : height - h, width, H)
      ctx.putImageData(imageData, 0, isFromTop ? 0 : height - h)
    }
  }

  return engine(speed, (progress: number) => end(progress), () => { helperCanvas = helperCanvas2 = helperCtx = helperCtx2 = null })
}


export const animateWheel = (props: AnimateProps) => {
  const { $el, width, height, img, speed } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let { ctx: helperCtx, canvas: helperCanvas } = getHelperCanvas(width, height)
  helperCtx.drawImage(img, 0, 0, width, height)
  const pattern = ctx.createPattern(helperCanvas, 'no-repeat')

  // 对角线作为直径
  const radius = Math.sqrt((Math.pow(width, 2) + Math.pow(height, 2))) / 2
  ctx.fillStyle = pattern

  const PI2 = Math.PI * 2
  const sAngle = Math.PI / -2

  const end = (value: number) => {
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.moveTo(width / 2, height / 2)
    const eAngle = PI2 * value - Math.PI / 2
    ctx.arc(width / 2, height / 2, radius, sAngle, eAngle, false)
    ctx.fill()
  }

  return engine(speed, (progress: number) => end(progress), () => { helperCanvas = helperCtx = null })
}


export const animateTooth = (props: AnimateProps) => {
  const { $el, width, height, img, speed } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let { ctx: helperCtx, canvas: helperCanvas } = getHelperCanvas(width, height)
  helperCtx.drawImage(img, 0, 0, width, height)
  const perWidth = Math.ceil(width / TOOTH_COUNT)

  const end = (value: number) => {
    ctx.clearRect(0, 0, width, height)
    if (value === 0) {
      return
    }
    for (let i = 0; i < TOOTH_COUNT; i++) {
      const x = i * perWidth
      const h = value * height
      let getY
      let y
      // 下半部分
      if (i % 2 === 0) {
        getY = 0
        y = height - h
      }
      // 上半部分
      else {
        getY = height - h
        y = 0
      }
      const imageData = helperCtx.getImageData(x, getY, perWidth, h)
      ctx.putImageData(imageData, x, y)
    }
  }

  return engine(speed, (progress: number) => end(progress), () => { helperCanvas = helperCtx = null })
}



export const animateZoomFullScreen = (props: AnimateProps) => {
  const { $el, width, height, img, speed } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let { ctx: helperCtx, canvas: helperCanvas } = getHelperCanvas(width, height)
  helperCtx.drawImage(img, 0, 0, width, height)
  const helfWidth = width / 2
  const end = (value: number) => {
    ctx.clearRect(0, 0, width, height)
    const w = value * helfWidth
    const h = height * value
    // 右边的，右上角开始
    const rightX = helfWidth
    const rightY = height - h
    const rightImageData = helperCtx.getImageData(width - w, 0, w + 1, h + 1)
    ctx.putImageData(rightImageData, rightX, rightY)
    // 左边的, 左上角开始
    const leftX = helfWidth - value * helfWidth
    const leftY = height - h
    const leftImageData = helperCtx.getImageData(0, 0, w + 1, h + 1)
    ctx.putImageData(leftImageData, leftX, leftY)
  }
  return engine(speed, (progress: number) => end(progress), () => { helperCanvas = helperCtx = null })
}


export const animateStackIn = (props: AnimateProps) => {
  const { $el, width, height, img, speed } = props
  const canvas = fillCanvasBeforePlay($el, width, height)
  const ctx = canvas.getContext('2d')
  let hw = width
  let hh = height

  switch (props.type) {
    case 'StackInTop':
    case 'StackInBottom':
      hh = height * STACK_SCALE
      break
    case 'StackInLeft':
    case 'StackInRight':
      hw = width * STACK_SCALE
      break
  }

  let { ctx: helperCtx, canvas: helperCanvas } = getHelperCanvas(hw, hh)
  helperCtx.drawImage(img, 0, 0, hw, hh)

  const end = (value: number) => {
    ctx.clearRect(0, 0, width, height)
    if (value === 0) {
      return
    }
    let sx, sy, sw, sh, dx, dy, dw, dh
    let isToLeft = false
    let isToTop = false
    switch (props.type) {
      case 'StackInTop':
        sw = width
        sh = hh * value
        sx = 0
        sy = 0
        dw = width
        dh = height * value
        dx = 0
        dy = 0
        isToTop = true
        break
      case 'StackInBottom':
        sw = width
        sh = hh * value
        sx = 0
        sy = hh - sh
        dw = width
        dh = height * value
        dx = 0
        dy = height - dh
        break
      case 'StackInLeft':
        sw = value * hw
        sh = height
        sx = 0
        sy = 0
        dw = width * value
        dh = height
        dx = 0
        dy = 0
        isToLeft = true
        break
      case 'StackInRight':
        sw = value * hw
        sh = height
        sx = hw - sw
        sy = 0
        dw = width * value
        dh = height
        dx = width - dw
        dy = 0
        break
    }

    ctx.drawImage(helperCanvas, sx, sy, sw, sh, dx, dy, dw, dh)

    // 左右
    if (hw > width) {
      const pw = hw - sw
      const psx = isToLeft ? hw - pw : 0
      const pdx = isToLeft ? dw : (dx - sx)
      const imageData = helperCtx.getImageData(psx, 0, pw + 1, height)
      ctx.putImageData(imageData, pdx, 0)
    }

    // 上下
    else if (hh > height) {
      const ph = hh - sh
      const psy = isToTop ? hh - ph : 0
      const pdy = isToTop ? dh : (dy - sy)
      const imageData = helperCtx.getImageData(0, psy, width, ph + 1)
      ctx.putImageData(imageData, 0, pdy)
    }
  }

  return engine(speed, (progress: number) => end(progress), () => { helperCanvas = helperCtx = null })
}
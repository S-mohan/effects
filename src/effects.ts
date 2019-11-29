import { engine } from './engine'
import { animate, animateHandler } from './animate'
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


const createCanvas = (width: number, height: number, img?: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const ratio = DEVICE_PIXEL_RATIO / 1
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  if (img) {
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width * ratio, height * ratio)
  }
  return canvas
}


export const fillCanvasBeforePlay = ($el: HTMLElement, width: number, height: number, img?: HTMLImageElement): HTMLCanvasElement => {
  const canvas = createCanvas(width, height, img)
  $el.innerHTML = ''
  $el.appendChild(canvas)
  return canvas
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
      transform = `scale(1, ${progress})`
      break
    case 'PullInLeft':
      origin = 'right top'
      transform = `scale(${progress}, 1)`
      break
    case 'PullInRight':
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
      transform = `translate(0, ${(1 - progress) * height}px)`
      break
    case 'SlideInDown':
      transform = `translate(0, ${(1 - progress) * -1 * height}px)`
      break
    case 'SlideInRight':
      transform = `translate(${(1 - progress) * -1 * width}px, 0)`
      break
    case 'SlideInLeft':
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


export const animatePullAndSlider = (props: AnimateProps): Function => {
  const { $el, width, height, img, duration, easing, type } = props
  const canvas = fillCanvasBeforePlay($el, width, height, img)
  canvas.style.cssText += getTransformCssText(type, 0, width, height)
  const handler = (progress: number) => canvas.style.cssText += getTransformCssText(type, progress, width, height)
  return animate(handler, duration, easing)
}


export const animateFade = (props: AnimateProps): Function => {

  return
}
export const animateShutter = (props: AnimateProps): Function => {

  return
}
export const animateUncover = (props: AnimateProps): Function => {

  return
}
export const animateWheel = (props: AnimateProps): Function => {

  return
}
export const animateTooth = (props: AnimateProps): Function => {

  return
}
export const animateZoomFullScreen = (props: AnimateProps): Function => {

  return
}
export const animateStackIn = (props: AnimateProps): Function => {

  return
}
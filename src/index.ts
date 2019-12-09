import { engine } from './engine'
import Tween, { TweenHandler } from './tween'
import { AnimateProps, animateFade, animateShutter, animateUncover, animateWheel, animateTooth, animateZoomFullScreen, animateStackIn, animatePullAndSlider } from './effects'

type EffectType =
  'Random' |
  // [扩展] 上下左右/中间向外/水平/垂直
  'PullInUp' |
  'PullInDown' |
  'PullInLeft' |
  'PullInRight' |
  'ZoomIn' |
  'ZommInX' |
  'ZoomInY' |
  // [平移] 上下左右
  'SlideInUp' |
  'SlideInDown' |
  'SlideInLeft' |
  'SlideInRight' |
  // [挤压] 上下左右 
  'PressInUp' |
  'PressInDown' |
  'PressInLeft' |
  'PressInRight' |
  // 水平挤压
  'PressInX' |
  // 垂直挤压
  'PressInY' |
  // 向下展开卷轴
  'UncoverFromTop' |
  // 向上展开卷轴
  'UncoverFromBottom' |
  // 水平百叶窗
  'ShutterX' |
  // 垂直百叶窗
  'ShutterY' |
  // 变焦全屏
  'ZoomFullScreen' |
  // 轮子
  'Wheel' |
  // 上下齿合
  'Tooth' |
  // 淡入淡出
  'FadeIn' |
  'FadeOut' |
  // [堆积] 上下左右 
  'StackInTop' |
  'StackInBottom' |
  'StackInLeft' |
  'StackInRight' |
  // [镭射] 上下左右
  'TopLaser' |
  'BottomLaser' |
  'RightLaser' |
  'LeftLaser'


const EffectsList: Array<EffectType> = [
  'PullInUp',
  'PullInDown',
  'PullInLeft',
  'PullInRight',
  'ZoomIn',
  'ZommInX',
  'ZoomInY',
  'SlideInUp',
  'SlideInDown',
  'SlideInLeft',
  'SlideInRight',
  'PressInUp',
  'PressInDown',
  'PressInLeft',
  'PressInRight',
  'PressInX',
  'PressInY',
  'UncoverFromTop',
  'UncoverFromBottom',
  'ShutterX',
  'ShutterY',
  'ZoomFullScreen',
  'Wheel',
  'Tooth',
  'FadeIn',
  'FadeOut',
  'StackInTop',
  'StackInBottom',
  'StackInLeft',
  'StackInRight',
  'TopLaser',
  'BottomLaser',
  'RightLaser',
  'LeftLaser'
]


export interface Props {
  // 动画类型
  type: EffectType
  // 特效时长
  duration: number
  // 尺寸
  width?: number
  height?: number
  easing?: TweenHandler
}


const defaults: Props = {
  type: 'FadeIn',
  duration: 0,
  width: 500,
  height: 500,
  easing: Tween.linear
}

interface WithCustormPropsElement extends HTMLElement {
  __effect_wrap__?: HTMLElement
}


const createWrap = (el: WithCustormPropsElement, width?: number, height?: number, options?: Props): WithCustormPropsElement => {
  if (width === void 0) {
    width = el.offsetWidth
  }
  if (height === void 0) {
    height = el.offsetHeight
  }
  options.width = width
  options.height = height
  let $wrap = el.__effect_wrap__
  if (!$wrap) {
    $wrap = el.__effect_wrap__ = document.createElement('figure')
    el.appendChild($wrap)
  }
  $wrap.style.cssText += `display:block;width:${width}px;height:${height}px;position:relative;margin:0;padding:0;overflow:hidden;`
  return $wrap
}


const loadImage = (image: string | HTMLImageElement | File): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement| null>(resolve => {
    if (typeof image === 'string') {
      const img = new Image()
      img.crossOrigin = ''
      img.src = image
      img.onload = function () {
        resolve(this as HTMLImageElement)
      }
      img.onerror = () => resolve(null) // 或者默认图片
    }
    else if (image instanceof File) {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = function(event){
        const img = new Image()
        img.src = event.target.result as string
        resolve(img)
      }
    }
    else {
      resolve(image)
    }
  })
}

const animate = function ($wrap: WithCustormPropsElement, image: HTMLImageElement, options: Props) {
  let { type, width, height, duration, easing } = options

  // 随机
  if (type === 'Random' || !EffectsList.includes(type)) {
    type = EffectsList[Math.floor(Math.random() * EffectsList.length)]
  }

  const animateProps: AnimateProps = {
    $el: $wrap,
    img: image,
    width,
    height,
    duration,
    type,
    easing: typeof easing === 'string' && Tween[easing] ? Tween[easing] : Tween.linear,
  }

  let play

  switch (type) {
    case 'PullInUp':
    case 'PullInDown':
    case 'PullInLeft':
    case 'PullInRight':
    case 'ZoomIn':
    case 'ZommInX':
    case 'ZoomInY':
    case 'SlideInUp':
    case 'SlideInDown':
    case 'SlideInLeft':
    case 'SlideInRight':
    case 'PressInUp':
    case 'PressInDown':
    case 'PressInLeft':
    case 'PressInRight':
    case 'PressInX':
    case 'PressInY':
      play = animatePullAndSlider(animateProps)
      break
    case 'UncoverFromTop':
    case 'UncoverFromBottom':
      play = animateUncover(animateProps)
      break
    case 'ShutterX':
    case 'ShutterY':
      play = animateShutter(animateProps)
      break
    case 'ZoomFullScreen':
      play = animateZoomFullScreen(animateProps)
      break
    case 'Wheel':
      play = animateWheel(animateProps)
      break
    case 'Tooth':
      play = animateTooth(animateProps)
      break
    case 'FadeIn':
    case 'FadeOut':
      play = animateFade(animateProps)
      break
    case 'StackInTop':
    case 'StackInBottom':
    case 'StackInLeft':
    case 'StackInRight':
    case 'TopLaser':
    case 'BottomLaser':
    case 'RightLaser':
    case 'LeftLaser':
      play = animateStackIn(animateProps)
      break
  }

  play && play()
}


export class Effect {

  static animate(el: HTMLElement, img: string | HTMLImageElement | File, options: Props = defaults) {
    options = Object.assign({}, defaults, options)
    const $wrap = createWrap(el, options.width, options.height, options)
    loadImage(img)
      .then(image => {
        animate($wrap, image, options)
      })
  }

  static engine = engine
  static Tween = Tween
}

export default Effect

// const effect = new Effect(
//   {
//     el: document.getElementById('demo'),
//     type: 'StackInRight',
//     speed: 3000,
//     duration: 60 * 1000,
//     images: ['https://smohan.oss-cn-beijing.aliyuncs.com/test/boy-child-cute-35537.jpg']
//   }
// )

// effect.animate()

// const $types = document.getElementById('effect-types') as HTMLSelectElement
// $types.addEventListener('change', function () {
//   effect.animate(this.value as EffectType)
// })

// document.getElementById('retry').addEventListener('click', function () {
//   effect.animate($types.value as EffectType)
// })
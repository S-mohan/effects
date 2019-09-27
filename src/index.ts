
// type EffectType = 'LEFT_EXPAND_IN' | 'TOP_EXPAND_IN' | 'RIGHT_EXPAND_IN' | 'BOTTOM_EXPAND_IN' | 'MIDDLE_EXPAND' | 'MIDDLE_TO_HORIZONTAL_EXPAND' | 'MIDDLE_TO_VERTICAL_EXPAND' | 'LEFT_MOVE_IN' | 'TOP_MOVE_IN' | 'RIGHT_MOVE_IN' | 'BOTTOM_MOVE_IN' | 'LEFT_SHRINK_IN' | 'TOP_SHRINK_IN' | 'RIGHT_SHRINK_IN' | 'BOTTOM_SHRINK_IN' | 'VERTICAL_SHRINK' | 'HORIZONTAL_SHRINK_IN' | 'SCROLL_UNROLLING_FROM_UP' | 'SCROLL_UNROLLING_FROM_BOTTOM' | 'SHUTTER_DOWN' | 'SHUTTER_RIGHT' | 'SPECIAL_ZOOM' | 'RADAR' | 'VERTICAL_CROSS_MERGE' | 'FADE_IN' | 'FADE_OUT' | 'STACKING_FROM_LEFT' | 'STACKING_FROM_UP' | 'STACKING_FROM_RIGHT' | 'STACKING_FROM_DOWN' | 'LASER_LEFT' | 'LASER_TOP' | 'LASER_RIGHT' | 'LASER_BOTTOM' | 'REVEAL_RENDER_TO_BOTTOM' | 'REVEAL_RENDER_TO_UP' | 'REVEAL_RENDER_MIDDLE_TO_VERTICAL' | 'REVEAL_RENDER_VERTICAL_TO_MIDDLE'

// const EXPAND_EFFECTS = ['LEFT_EXPAND_IN' , 'TOP_EXPAND_IN' , 'RIGHT_EXPAND_IN' , 'BOTTOM_EXPAND_IN' , 'MIDDLE_EXPAND' , 'MIDDLE_TO_HORIZONTAL_EXPAND' , 'MIDDLE_TO_VERTICAL_EXPAND']

// const MOVE_EFFECTS = ['LEFT_MOVE_IN' , 'TOP_MOVE_IN' , 'RIGHT_MOVE_IN' , 'BOTTOM_MOVE_IN']

// export interface Props {
//   // 容器
//   el: HTMLElement
//   // 动画类型
//   type: EffectType
//   // 播放速度 ms
//   speed: number
//   // 播放总时长
//   duration: number
//   // 图片集
//   images: Array<string> | string
//   // 每页播放时长
//   // 如果播放的是个图片集，则需要给每一项都设置播放时长
//   perPageDuration?: number | number
// }

// interface AnimateProps{
//   $wrap: HTMLElement
//   width: number
//   height: number
//   imgs: Array<HTMLImageElement>
//   options: Props
// }


// const createWrap = (el:HTMLElement, width:number, height:number):HTMLElement => {
//   const $wrap = document.createElement('figure')
//   $wrap.style.cssText += `display:block;width:${width}px;height:${height}px;position:relative;margin:0;padding:0;overflow:hidden;`
//   el.appendChild($wrap)
//   return $wrap
// }


// const loadImage = (image:string):Promise<HTMLImageElement | null> => {
//   return new Promise<HTMLImageElement | null>(resolve => {
//     const img = new Image()
//     img.src = image
//     img.onload = () => resolve(img)
//     img.onerror = () => resolve(null) // 或者默认图片
//   })
// }

// const loadImages = (images:Array<string>) => {

//   const promises:Array<Promise<HTMLImageElement>> = []
//   for (let i = 0, len = images.length; i < len; i++) {
//     promises.push(loadImage(images[i]))
//   }

//   return Promise.all(promises)
// }


// const engine = (speed:number, frameCallback?:Function) => {

//   let raf:number
//   let start:number
//   function play() {
//     raf = requestAnimationFrame(step)
//   }

//   function step (t:number) {
//     if (!start) {
//       start = t
//     }
//     const run = t - start
//     const progress = Math.min(run / speed, 1)
//     frameCallback && frameCallback(progress)
//     // console.log(progress)
//     if (run <= speed) {
//       play()
//     } else {
//       cancelAnimationFrame(raf)
//     }
//   }

//   return play
// }


// const animateMove = (img:HTMLImageElement, type:EffectType, speed:number) => {
//   let start:string
//   let end:Function

//   switch (type) {
//     case 'LEFT_MOVE_IN':
//       start = 'translateX(-100%)'
//       end = (progress:number) => {
//         const value = (progress - 1) * 100 + '%'
//         return `translateX(${value})`
//       }
//       break
//     case 'RIGHT_MOVE_IN':
//       start = 'translateX(100%)'
//       end = (progress:number) => {
//         const value = (1 - progress) * 100 + '%'
//         return `translateX(${value})`
//       }
//       break
//     case 'TOP_MOVE_IN':
//       start = 'translateY(-100%)'
//       end = (progress:number) => {
//         const value = (progress - 1) * 100 + '%'
//         return `translateY(${value})`
//       }
//       break
//     case 'BOTTOM_MOVE_IN':
//         start = 'translateY(100%)'
//         end = (progress:number) => {
//           const value = (1 - progress) * 100 + '%'
//           return `translateY(${value})`
//         }
//       break
//   }

//   img.style.transformOrigin = 'center'
//   img.style.transform = start

//   const play = engine(speed, (progress:number) => img.style.transform = end(progress))
//   play()
// }


// const animateExpand = (img:HTMLImageElement, type:EffectType, speed:number) => {
//   let origin:string
//   let start:string
//   let end:string

//   switch (type) {
//     case 'LEFT_EXPAND_IN':
//       origin = 'top right'
//       start = 'scaleX(0)'
//       end = 'scaleX(value)'
//       break
//     case 'RIGHT_EXPAND_IN':
//       origin = 'top left'
//       start = 'scaleX(0)'
//       end = 'scaleX(value)'
//       break
//     case 'TOP_EXPAND_IN':
//       origin = 'bottom left'
//       start = 'scaleY(0)'
//       end = 'scaleY(value)'
//       break
//     case 'BOTTOM_EXPAND_IN':
//       origin = 'top left'
//       start = 'scaleY(0)'
//       end = 'scaleY(value)'
//       break
//     case 'MIDDLE_EXPAND':
//       origin = 'center'
//       start = 'scale(0)'
//       end = 'scale(value)'
//       break
//     case 'MIDDLE_TO_HORIZONTAL_EXPAND':
//       origin = 'center'
//       start = 'scaleX(0)'
//       end = 'scaleX(value)'
//       break
//     case 'MIDDLE_TO_VERTICAL_EXPAND':
//       origin = 'center'
//       start = 'scaleY(0)'
//       end = 'scaleY(value)'
//       break
//   }

//   img.style.transformOrigin = origin
//   img.style.transform = start

//   const play = engine(speed, (progress:number) => img.style.transform = end.replace('value', String(progress)))
//   play()
// }


// const animateTransform = () => {
//   let from:string
//   let to:Function
//   let origin:string = 'center'





// }



// const animate = (props:AnimateProps) => {
//   const { options, $wrap, imgs, width, height } = props
//   const img = imgs[0]
//   img.width = width
//   img.height = height
//   $wrap.appendChild(img)
//   if (EXPAND_EFFECTS.includes(options.type)) {
//     animateExpand(img, options.type, options.speed)
//   }
//   else if (MOVE_EFFECTS.includes(options.type)) {
//     animateMove(img, options.type, options.speed)
//   }
// }

// export const effects = (options: Props) => {
//   const { el, images } = options
//   const { offsetWidth: width, offsetHeight: height } = el
//   const $wrap = createWrap(el, width, height)
//   loadImages(images as Array<string>)
//     .then((imgs:Array<HTMLImageElement>) => animate({
//       width,
//       height,
//       $wrap,
//       imgs,
//       options
//     }))
// }

// export default effects


// effects({
//   el: document.getElementById('demo'),
//   type: 'LEFT_EXPAND_IN',
//   speed: 1000,
//   duration: 60 * 1000,
//   images: ['https://novacloud-dev.oss-cn-hangzhou.aliyuncs.com/wangxy/media/%E7%B3%BB%E7%BB%9F%E6%96%87%E4%BB%B6%E5%A4%B9/232%5B27536-1%5D.jpg?OSSAccessKeyId=eMYWoIbIam9NsYRC&Expires=1569404346&Signature=w%2BZ2AO2axsdT944%2F9gvFFKp4EL0%3D']
// })

// NoneRandomPush from leftPush from topPush from rightPush from bottomZoom inSplit (vertical out)Split (horizontal out)Pan from leftPan from topPan from rightPan from bottomIndent from leftIndent from topIndent from rightIndent from bottomIndent (vertical in)Indent (horizontal in)Uncover from topUncover from bottomHorizontal blindsVertical blindsSplit and expand from bottomWheelComb (vertical)Fade inFADE_OUTStack from leftStack from topStack from rightStack from bottomLeft laserTop laserRight laserBottom laserCover from topCover from bottomCover (vertical out)Cover (vertical in)

import { engine } from './engine'
import { AnimateProps, animateFadeIn, animateShutter, animateUncover, animateWheel, animateTooth, animateZoomFullScreen, animateStackIn } from './effects'

type EffectType =
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
  // 淡入
  'FadeIn' |
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

type Status = 'PENDING' | 'FULFILLED'

export interface Props {
  // 容器
  el: HTMLElement
  // 动画类型
  type: EffectType
  // 播放速度 ms
  speed: number
  // 播放总时长
  duration: number
  // 图片集
  images: Array<string> | string
  // 每页播放时长
  // 如果播放的是个图片集，则需要给每一项都设置播放时长
  perPageDuration?: number | number
  width?: number
  height?: number
}


interface States {
  $wrap: HTMLElement
  status: Status
  imgs?: Array<HTMLImageElement>
  index?: number
}


const defaults: Props = {
  el: null,
  type: 'FadeIn',
  speed: 0,
  duration: 0,
  images: null,
}



const createWrap = (el: HTMLElement, width?: number, height?: number, options?: Props): HTMLElement => {
  if (width === void 0) {
    width = el.offsetWidth
  }
  if (height === void 0) {
    height = el.offsetHeight
  }
  options.width = width
  options.height = height
  const $wrap = document.createElement('figure')
  $wrap.style.cssText += `display:block;width:${width}px;height:${height}px;position:relative;margin:0;padding:0;overflow:hidden;`
  el.appendChild($wrap)
  return $wrap
}


const loadImage = (image: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement | null>(resolve => {
    const img = new Image()
    img.crossOrigin = ''
    img.src = image
    img.onload = function () {
      resolve(this as HTMLImageElement)
    }
    img.onerror = () => resolve(null) // 或者默认图片
  })
}

const loadImages = (images: Array<string>) => {
  const promises: Array<Promise<HTMLImageElement>> = []
  for (let i = 0, len = images.length; i < len; i++) {
    promises.push(loadImage(images[i]))
  }
  return Promise.all(promises)
}


const getImages = function (this: Effect): Promise<Array<HTMLImageElement>> {
  return new Promise(resolve => {
    if (this.states.status === 'FULFILLED') {
      resolve(this.states.imgs)
    } else {
      const images = this.props.images as Array<string>
      loadImages(images)
        .then(imgs => {
          this.states.imgs = imgs
          this.states.status = 'FULFILLED'
          resolve(imgs)
        })
    }
  })
}

const animate = function (this: Effect, type?: EffectType) {
  const { states, props } = this
  type = type || props.type

  const animateProps: AnimateProps = {
    $el: states.$wrap,
    img: states.imgs[states.index],
    width: props.width,
    height: props.height,
    speed: props.speed,
    type
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
      break
    case 'SlideInUp':
    case 'SlideInDown':
    case 'SlideInLeft':
    case 'SlideInRight':
      break
    case 'PressInUp':
    case 'PressInDown':
    case 'PressInLeft':
    case 'PressInRight':
      break
    case 'PressInX':
    case 'PressInY':
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
      play = animateFadeIn(animateProps)
      break
    case 'StackInTop':
    case 'StackInBottom':
    case 'StackInLeft':
    case 'StackInRight':
      play = animateStackIn(animateProps)
      break
    case 'TopLaser':
    case 'BottomLaser':
    case 'RightLaser':
    case 'LeftLaser':
      break
  }

  play && play()
}


export class Effect {
  props: Props
  states: States
  constructor(options: Props) {
    const props = this.props = Object.assign({}, defaults, options || {})
    this.states = {
      $wrap: createWrap(props.el, props.width, props.height, props),
      status: 'PENDING',
      index: 0
    }
    if (typeof props.images === 'string') {
      props.images = [props.images]
    }
  }

  animate(type?: EffectType, index?: number) {
    index = index !== void 0 ? index : this.states.index
    getImages.call(this)
      .then((imgs: Array<HTMLImageElement>) => {
        if (imgs.length === 0) {
          return
        }
        if (imgs[index] === void 0) {
          index = 0
        }
        this.states.index = index
        animate.call(this, type)
      })
  }

  static engine = engine
}


const effect = new Effect(
  {
    el: document.getElementById('demo'),
    type: 'FadeIn',
    speed: 5000,
    duration: 60 * 1000,
    images: ['https://smohan.oss-cn-beijing.aliyuncs.com/test/boy-child-cute-35537.jpg']
  }
)

effect.animate()

const $types = document.getElementById('effect-types') as HTMLSelectElement
$types.addEventListener('change', function () {
  effect.animate(this.value as EffectType)
})

document.getElementById('retry').addEventListener('click', function () {
  effect.animate($types.value as EffectType)
})
# Effects

> 基于canvas实现的包括卷轴，激光镭射，百叶窗，齿合，堆积等40余种图片转场过渡效果集合。

### 支持效果

- Random 随机
- PullInUp 向上扩展
- PullInDown 向下扩展
- PullInLeft 向左扩展
- PullInRight 向右扩展
- ZoomIn 中间向外扩展
- ZommInX 左右扩展
- ZoomInY 上下扩展
- SlideInUp 向上平移
- SlideInDown 向下平移
- SlideInLeft 向左平移
- SlideInRight 向右平移
- PressInUp 向上压缩
- PressInDown 向下压缩
- PressInLeft 向左压缩
- PressInRight 向右压缩
- PressInX 左右压缩
- PressInY 上下压缩
- UncoverFromTop 向下展开卷轴
- UncoverFromBottom 向上展开卷轴
- ShutterX 水平百叶窗
- ShutterY 垂直百叶窗
- ZoomFullScreen 变焦全屏
- Wheel 轮子
- Tooth 上下齿合
- FadeIn 淡入
- FadeOut 淡出
- StackInTop 向上堆积
- StackInBottom 向下堆积
- StackInLeft 向左堆积
- StackInRight 向右堆积
- TopLaser 上镭射
- BottomLaser 下镭射
- RightLaser 右镭射
- LeftLaser 左镭射

### 如何使用
### Html
```html
<div id="canvas"></div>
<script src="dist/mo.effects.c79ef24.js"></script>
<script>
window.MoEffects.animate(document.getElementById('canvas'), 'https://smohan.oss-cn-beijing.aliyuncs.com/test/boy-child-cute-35537.jpg', {
 width: 500,
 height: 500,
 duration: 2000,
 easing: 'linear',
 type: 'UncoverFromTop'
})
</script>
```
### API
```typescript
animate(el: HTMLElement, img: string | HTMLImageElement | File, options?: Props)
```
### Options
```typescript
{
  // 动画类型
  type: EffectType
  // 特效时长, 单位毫秒
  duration: number
  // 容器宽度
  width?: number
  // 容器高度
  height?: number
  // 缓动类型
  easing?: TweenHandler
}
```

## Example
#### [https://s-mohan.github.io/effects/index.html](https://s-mohan.github.io/effects/index.html)

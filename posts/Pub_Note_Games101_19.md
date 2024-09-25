---
title: Games101 19.Cameras, Lenses and Light Fields
---

## Imaging

![Alt text](image.png)

- 成像 = 合成 + 捕捉
- 合成：光栅化成像 + 光线追踪成像
- 捕捉：把真实世界中的东西变成照片，有各种成像方法。当然最简单的是用相机。比如还有研究光在极短时间内的传播，就能看到光传播的一个过程（transient imagine），这块主要是叫计算摄影学（computational photography）。

我们从相机开始，相机内部发生了什么呢？
![Alt text](image-1.png)

- 各种部件：镜头、棱镜、机身、感光元件、快门

小孔成像：
![Alt text](image-2.png)

- 只有刚好通过小孔的光线不会被挡住，在后面形成倒立的像。
- 这个原理有真正对应的相机，叫针孔相机。

相机的各个部件：

![Alt text](image-3.png)

- 快门（shutter）：控制光线进入的时间

![Alt text](image-4.png)

- 传感器（sensor）：把光记录下来，或者说也叫成像，记录的是 irradiance

![Alt text](image-5.png)

- 如果没有棱镜，会收到各个方向的光，会糊掉。
- 也有人在研究一些传感器，可以记录不同方向的光，这样就能记录 radiance，而不是 irradiance。

我们来分析一下小孔成像：

![Alt text](image-6.png)
![Alt text](image-7.png)

- 可以用这个小孔来拍照，得到这样的结果
- 针孔相机拍出来的东西是没有景深的，任何地方都是清楚的，不会是虚的。

## Field of View

![Alt text](image-8.png)

- 影响我们能看到多大的范围
- 广角镜头就是 FOV 更大
- 这里就是一个简单的相似三角形的计算。

![Alt text](image-9.png)

- 通常以 35mm 格式的胶片为基准，所以传感器大小是一定的。
- 所以我们用焦距来定义 field of view。
- 比如 17mm 对应广角镜头。
- 比如手机可能就是 28mm，不过需要注意的是手机那么薄肯定没有 28mm 的焦距，这里的焦距是等效焦距，就是相当于 35mm 胶片的焦距。（手机的传感器比较小，所以焦距也小）

下面是不同焦距的镜头拍出来的效果：
![Alt text](image-10.png)

如果我们用不一样的胶片，那么传感器的大小也会不一样：
![Alt text](image-11.png)

- 小一些的传感器对应小的 FOV
- 传感器负责记录最后的 irradiance 有多大
- 每个像素最后的 Film 决定要把它存成什么样的图片格式
  ![Alt text](image-12.png)
  ![Alt text](image-13.png)
- 越大的传感器，分辨率越高
- 所以通常越大的相机越好

## Exposure

曝光到底是什么？

![Alt text](image-14.png)

- 由 irradiance 和 time 决定，曝光的时间越长，光线进入的越多，最后的结果就越亮。
- 除此之外，还有光圈的大小，光圈越大，进入的光线就越多，最后的结果也就越亮。

![Alt text](image-15.png)

- 光圈其实就是一个挡光的东西，它是一个仿生学的设计，仿照人的瞳孔，光线强的时候，瞳孔会缩小，光线弱的时候，瞳孔会放大。由 f-stop 控制。
- 快门，shutter speed 越快，光线进入的时间就越短，最后的结果就越暗。
- iso，感光度，它是一个后期处理，接受到多少光，最后再乘上一个 iso。

![Alt text](image-16.png)

- 5,6 是欧洲写法，其实就是 5.6。这个数越大光圈越小。
- 1/1000 秒就是快门开放的时间，1/1000 秒就是 1ms。
- 光圈用太大，照片看上去就很虚
- 如果人在跑步，快门时间长，就会看到一个模糊的东西
- 信号本身有噪声，如果放大信号，也会放大噪声，这就是为什么 iso 调高会有噪声的原因。
- 可以把光理解为光子，快门时间不够，进到感光元件部分的光子数就少，光子数少造成噪声。

ISO：
![Alt text](image-17.png)
![Alt text](image-18.png)

![Alt text](image-19.png)

- 也就是光圈直径的倒数

![Alt text](image-20.png)

- 快门升上去打开，然后再关上，它并不是一瞬间就打开的，有一个过程。

![Alt text](image-21.png)
![Alt text](image-22.png)

- 如果有个运动的物体，快门打开一段时间，这段时间传感器在不断的记录，所以就会有模糊的现象，这就是运动模糊。
- 其实也就是在时间上采样
  ![Alt text](image-23.png)
- 机械快门打开有个过程，会导致 rolling shutter（超高速运动的东西会造成扭曲）
- 不同的位置记录的是不同的时间，就会出现扭曲的现象

![Alt text](image-24.png)

- 大光圈会引起景深的问题，快门时间会引起运动模糊的问题，这两个事情需要权衡。

![Alt text](image-25.png)

- 高速摄影：快门时间短，要么用大光圈，要么用高 iso。但是高 iso 会有噪声，所以实际还是用大光圈。

![Alt text](image-26.png)

- 延时摄影：快门时间长，用小光圈慢慢拍。

## Lenes

![Alt text](image-27.png)

- 一般都是用棱镜组来成像

![Alt text](image-28.png)

- 实际的棱镜也没法把光聚到一块，会有 aberration（像差）

我们研究的棱镜呢是理想化的薄棱镜：
- 厚度忽略不计
- 能集中光线到焦点

![Alt text](image-29.png)
- 按照光路的可逆性，过焦点的光线会变成平行光。
- 棱镜组通过不同的组合，可以改变焦距。

Gauss’ Ray Diagrams：
![Alt text](image-30.png)
![Alt text](image-31.png)
![Alt text](image-32.png)
![Alt text](image-33.png)

### Defocus Blur

利用薄棱镜可以解释景深问题：
![Alt text](image-34.png)
- 根据前面的公式，$\frac{1}{f} = \frac{1}{z_i} + \frac{1}{z_o}$，我们可以算出成像的位置。
- Sensor 不在这个位置，一个点会被成像成一个圆，这个圆就是 circle of confusion，所以看上去会模糊。
- 公式中$z_s$这个距离是确定的，像距$z_i$是确定的，根据右边两个相似三角形，可以得到这么一个关系。所以发现 circle of confusion 和光圈大小成正比。

![Alt text](image-35.png)

### Revisiting F-Number/F-Stop

![Alt text](image-36.png)
![Alt text](image-37.png)
- 这样F-Number和焦距、光圈大小都关联起来了。

![Alt text](image-38.png)
- 这里的A也就是上边的D，表示光圈的直径。
- F-Number跟Circle of Confusion成反比，所以为了拍摄清晰的照片，我们需要用F-Number大（直径小）的光圈。

## Ray Tracing Ideal Thin Lenses

我们之前在光线追踪的时候是直接从相机位置往像素中心连线，这个其实是默认了一个小孔成像的模型。现在我们可以用薄透镜来模拟这个过程:

![alt text](image-39.png)
- 我们先定义sensor有一定的大小（也就是成像平面），然后定义透镜的属性，比如焦距和光圈大小。
- 再定义物距平面，也就是我们想要拍摄的物体的位置。

![alt text](image-40.png)
- x'是屏幕（胶片）像素上的点，然后从透镜上随机取一个点x''。然后会打到物距平面上的x'''（根据物距相距的关系，其实也就是跟平行线相交的点）。
- 这条光线的结果就会被记录到x'对应的像素上。

## Depth of Field（FYI）

我们来用defocus blur来定义景深：
![alt text](image-41.png)

![alt text](image-42.png)
- 在成像平面附近的一段区域内，这个区域内的circle of confusion都是足够小的。
- 一个像素不是一个点，而是有一定大小的，所以我们可以认为只要circle of confusion比像素小，我们就可以认为这个区域内的成像是清晰的。

![alt text](image-43.png)
- 根据前面的公式，我们可以算出在处于这个范围的物距

![Alt text](image-44.png)
- 可以在这个网页试试：https://graphics.stanford.edu/courses/cs178/applets/dof.html
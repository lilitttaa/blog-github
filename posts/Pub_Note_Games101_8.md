---
title: Games101 8.Shading 2(Shading, Pipeline and Texture Mapping)
---

## Blinn-Phong Reflectance Model

### Specular Term

从经验上来看，什么时候我们能看到高光呢？
![Alt text](image.png)

- 首先平面应该比较光滑
- 然后它的反射方向非常接近镜面反射的方向
- 最后是观察方向和反射方向足够接近

![Alt text](image-1.png)

- Blinn-Phong Model 中有一个很巧妙的做法，用半程向量（观察向量和入射方向的角平分线方向）和法线向量接近去表示观察方向和反射方向接近。
- 直接用观察方向和反射方向去算也可以，这个模型叫做 Phong Reflectance Model，但是计算量更大一些。
- 仍然是用点乘去衡量两个向量是否接近
- 用 ks 去表示镜面反射系数，通常高光是白色
- 最后我们用 p 去调整高光的大小

![Alt text](image-2.png)

- 向量之间夹角余弦确实能体现两个方向之间是不是足够接近，但是这个容忍度太高了。甚至在 45 度的时候仍然有一个较大的值。
- 通常 p 的值在 100-200 之间，64 还不够，通常高光是 3-5 度之外才看不到的。

不同系数下的高光效果：
![Alt text](image-3.png)

### Ambient Term

![Alt text](image-4.png)

- 环境光照来自于其他四面八方的间接光，在 Blind-Phong Model 中，我们做了一个假设，认为每个点接收到的环境光都是相同的，这个强度叫做 ia，环境光的颜色叫做 ka。
- 环境光不考虑光源的方向，也不考虑观察方向。ia 和 ka 都是常数。（当然这个假设在物理上肯定不成立，需要用到非常精细的计算，后面全局光照会讲到）

### Blinn-Phong Reflectance Model

最后我们三个部分加起来就是 Blinn-Phong Reflectance Model：
![Alt text](image-5.png)
我们遍历所有 shading point，然后对每个点做一次着色，然后就能看到整个场景。

### Questions

- 如果一个点凹下去，环境光应该暗一些？Blinn-Phong Model 处理不了这个问题。
- 磨砂表面是否没有高光？不完全是，取决于磨的程度。
- Diffuse 不考虑 point view 的距离？不考虑，也不考虑物体到观察点的距离造成的能量损失。

## Shading Frequencies

![Alt text](image-6.png)

- 这三个球模型一样，但是着色出来的效果不一样，因为着色频率不同。
  着色频率分为三种，分别对应把着色应用在不同的地方：
  ![Alt text](image-7.png)
- Flat Shading：应用在每个面上。
- Gouraud Shading：应用在每个顶点上。
- Phong Shading：应用在每个像素上

### Flat Shading

![Alt text](image-8.png)

- 整个平面只做一次 shading，所以整个平面的颜色都是一样的。
- 三角形面的法线通过两个边的差积得到。

### Gouraud Shading

![Alt text](image-9.png)

- 每个顶点都算出一个法线
- 比如三个顶点围成一个三角形，三角形内部的点的颜色可以通过插值算出来

顶点的法线怎么求后面马上会讲到。

### Phong Shading

![Alt text](image-10.png)

- 对于每个三角形或者四边形顶点求出法线，然后对内部的每个像素进行插值，得到每个像素的法线。然后对每个像素进行一次 shading。
- Phong-shading model 和 Phong shading 是两个不同的概念，但是是同一个人发明的。

### Shading Frequencies

- 这三个 shading frequencies 的效果具体取决于模型，模型越密集 flat 和 gouraud shading 计算越大，效果越好。
- phong shading 通常效果更好，但是每个像素都要计算，所以计算量更大。

### Per-Vertex Normal Vectors

![Alt text](image-11.png)

- 最理想的方式就是用三角形表示的球，顶点法线直接就是从球心指向顶点的方向。
- 顶点的法线就认为是它相邻的这些面的法线，然后求个平均。这个效果不是最好的，但是还不错，所以一直为大家所用。
- 但如果有个三角形很大，一个很小，那么大的三角形应该贡献更多，所以我们可以用面积加权平均。
- 所有法线都是方向，所以求出来之后要给他规范化，保证长度都是相同的。

### Per-Pixel Normal Vectors

![Alt text](image-12.png)
等到介绍重心坐标的时候再说。

## Graphics Pipeline

![Alt text](image-13.png)

- 不做 msaa 的时候，一个像素对应一个 fragment
- 如果用了 msaa，那就是多个 fragment 合成一个像素
- 从三维场景到最后渲染出二维的一幅图的一个基本操作都是在 gpu 硬件层面写好的
- 三角形的顶点信息和索引信息是分开的，即便是转换到二维空间，索引信息也是不变的

关于 msaa 需要提一下：

- msaa 中一个三角形的覆盖像素的多个位置的任意一个，shading 就必须执行。
- 然而不管多少采样位置被覆盖，每个像素仅仅执行一次 shading，计算结果被应用在所有的多重采样位置中。
- 每个子像素都有自己的颜色、深度模板信息，并且每一个子采样点都是需要经过深度和模板测试才能决定最终是不是把像素的颜色得到到这个子采样点所在的位置，而不是简单的作一个覆盖测试就写入颜色。

这部分内容来源于：[深入剖析 MSAA 多重采样抗锯齿（multisample anti-aliasing）](https://blog.csdn.net/aoxuestudy/article/details/117952164)

Fragment Processing 这部分先进行 z-buffer 的可见性测试，然后再进行着色。

![Alt text](image-14.png)
![Alt text](image-15.png)

在整个管线着色部分很重要的就是顶点着色和像素着色，这两部分是可以编程的，这部分代码我们管它叫 shader。

![Alt text](image-16.png)
右边这幅图里边可以看到这样的纹理，也就是说三角形内部存在这样的一些变化，这个叫做纹理映射。

### Shader Program

![Alt text](image-17.png)

- shader 本质上是一些能在硬件上执行的语言，shader 是一个通用的一段程序，每个像素或者顶点都会执行。
- 如果写的是顶点操作，那这个 shader 就叫 vertex shader，叫顶点着色器。
- 如果写的是像素操作，那这个 shader 就叫 fragment 或者 pixel shader，叫像素着色器。

![Alt text](image-18.png)

- 比如像素着色器最后得写清楚它输出的颜色是什么。
- 这里是 opengl 的一个着色语言，简称 glsl
- uniform 就是全局变量，这里是一个纹理，还有一个光照方向

推荐一个网站叫做 shader toy，可以免去写 open gl 和 direct x 的一系列背后的东西，只用写着色器，顶点和像素如何着色。
![Alt text](image-19.png)

- 这里的蜗牛没有用三角形，而是通过数学方法定义的隐式几何形体。
- 还有各种阴影、半透明、动画效果。

![Alt text](image-20.png)

## GPU

![Alt text](image-21.png)

- gpu（graphics processing unit）是一个高度并行化的处理器，核心数量远远超过 cpu，适合做并行计算。
- 随着 gpu 的发展，有越来越多不同类型的着色器产生，比如 geometry shader 和 compute shader。

geometry shader 可以定义几何的操作，可以动态产生更多的三角形。

compute shader 可以做任何形式的计算，不仅仅是图形学内部的计算，也可以做通用的 gpu 计算，也就是所谓的 general purpose gpu（gp gpu）。

另外 gpu 分为集成显卡和独立显卡。
![Alt text](image-22.png)
GPU 的并行数远超 CPU 的几十个。

## Texture Mapping

![Alt text](image-23.png)
比如这里的五角星和地面上的木头纹理，我们希望在物体的不同位置定义一个不同的属性。这就引入了纹理映射的基本思路：
![Alt text](image-24.png)

- 首先这个属性定义在表面上
- 表面是二维的，可以理解为把三维物体的表面展开成一个平面
- 然后就可以把表面跟图片对应起来。纹理其实就是一张图片，我们可以把它撕开，拉伸，压缩，然后贴在三维物体的表面上。

一个三角形应该如何映射到一个纹理上，也就是说它在纹理空间上是哪儿：
![Alt text](image-25.png)

- 第一种是通过艺术家把模型展开，然后把它贴在纹理的不同位置，这是一个非常劳动密集的过程
- 第二种是一个自动化的过程，给一个模型，然后把它展开成一个平面，并且希望这个产生的三角形尽可能少扭曲，还希望它是一个完整的物体，无缝衔接，对应的颜色也是无缝衔接的。这个叫做 parameterization（参数化），这是几何上的一个很重要的研究方向。

纹理坐标：
![Alt text](image-26.png)

- 每个点都有一个坐标，我们叫它 uv 坐标
- uv 坐标是 0 到 1 的，方便处理。

三角形的三个顶点都有一个 uv 坐标
![Alt text](image-27.png)

下面表面的纹理坐标的情况：
![Alt text](image-29.png)
![Alt text](image-28.png)

![Alt text](image-30.png)
对于像地板、墙面这种重复的纹理，我们可以把它贴满整个物体，也就是说我们可以把纹理重复多次。这样的纹理上下左右都是无缝衔接的，叫做 tiled texture。这种纹理是需要算法生成的，其中有一种算法叫 wang tiling。

下节课介绍重心坐标和插值。

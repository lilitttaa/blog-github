---
title: Games101 11.Geometry 2 (Curves and Surfaces)
---

## Many Explicit Representations in Graphics

![Alt text](image.png)

### Point Cloud

![Alt text](image-1.png)

- 不考虑物体是一个表面，而是它表面上的一堆点
- 只要这些点表示的足够细，就看不到点与点之间的缝隙，就可以看到一个表面
- 通常做一些三维空间中的扫描，得到的输出是一堆点云
- 然后如何把它变成三角形面，是一个研究的问题。不过稀疏的部分，不容易画出来，所以平时大家不太会用原始的点云的数据。

### Polygon Mesh

![Alt text](image-2.png)

- 这是平时用的最多的一种表示方法，特别是用三角形或者四边形的面

![Alt text](image-3.png)

- 介绍一下平时图形学中如何表示这种用三角形面形成的物体
- 这个是一种特定的文件格式，叫做 Wavefront Object File，简称 Object File，或者它的后缀是`.obj`，和编译出来的`.obj`不是一回事。
- 这个文件描述了空间中的一堆点、法线和纹理坐标，然后组织成一个模型
- 这是个立方体的 obj 文件，按理来说应该只有 6 条法线，对应 6 个面。但是这里有 8 行，是因为自动建模的时候有很多冗余的地方。
- f 定义面，用哪三个顶点组成三角形，格式为 v/vt/vn，v 是顶点，vn 是法线，vt 是纹理坐标

## Curves

![Alt text](image-4.png)

- 相机沿着曲线运动

![Alt text](image-5.png)

- 动画中模型沿着法线去运动

![Alt text](image-6.png)

- 可以无限放大的字体

### Bezier Curve

![Alt text](image-7.png)

- 用一系列控制点定义曲线
- 起点是 p0，终点是 p3，起始切线是 p0 到 p1，结束切线是 p2 到 p3

我们怎么去生成这条曲线呢？
下面是 quadratic Bezier curve 的生成算法（de Casteljau's algorithm）：
![Alt text](image-8.png)
![Alt text](image-9.png)
![Alt text](image-11.png)
![Alt text](image-10.png)

- 贝塞尔曲线是通过参数 t 来定义的，t 是一个 0 到 1 之间的值
- 要画出一条完整的曲线，只要枚举所有可能的时间 t，就可以找到这条曲线

下面是 cube Bezier curve：
![Alt text](image-12.png)

- 通过递归的方式，不断地找到中间的点，最后找到曲线上的点

然后我们需要为这个生成算法找到一个代数的表示方法：
![Alt text](image-13.png)
![Alt text](image-14.png)
推广到一般形式：
![Alt text](image-15.png)

- 给定 n+1 个控制点，可以得到一个 n 阶的 Bezier 曲线
- 用这么一个伯恩斯坦多项式作为系数来进行线性组合
- $\binom{n}{i}$是二次项系数，它是一个组合数，等价于$\frac{n!}{i!(n-i)!}$

如果 n=3：
![Alt text](image-16.png)

关于伯恩斯坦多项式：
![Alt text](image-17.png)

- 任意一个时间点 t，画一条竖线，四个竖线的交点的值加起来等于 1。
- 然后这个曲线是对称的，b1 和 b2 是对称的，b0 和 b3 是对称的。这在组合数学上有解释，就是从 n 项中取 i 项的组合等于从 n 项中取 n-i 项的组合。

我们再来看一下 Bezier 曲线的性质：
![Alt text](image-18.png)

- 必须经过起点和终点，所以 t=0 时一定在起点，t=1 时一定在终点
- n 次贝塞尔有 n+1 个控制点
- 对贝塞尔曲线做仿射变换，只需要对控制点做仿射变换。（但仅限于仿射变换，比如投影就不行）
- 贝塞尔曲线一定是在控制点形成的凸包内

什么是凸包呢？
![Alt text](image-19.png)

- 能够包围一系列给定的几何形体的最小的凸多边形
- 用橡皮筋的例子来解释，橡皮筋拉到最大，然后松手，橡皮筋会收缩到这些物体形成的某一个外框上

按照上边的说法，任意给 10 个点，都可以画出一条贝塞尔曲线：
![Alt text](image-20.png)

- 当控制点多的时候，曲线不好控制，不太容易得到想要的形状

人们发明了 piecewise cubic 的方法来解决这个问题：
![Alt text](image-21.png)
![Alt text](image-22.png)

- piecewise 意思是逐段的
- 用低阶的贝塞尔曲线来逐段定义曲线，通常使用 piecewise cubic，即每四个控制点定义一条贝塞尔曲线
- 前一段的终点和后一段的起点是同一个点，这样就保证了曲线的连续性
- 要想前一段跟后一段连续，需要保证两段的切线方向一致，且长度一致

连续性的定义：
![Alt text](image-23.png)
C0 连续：两段曲线在连接点处连续
![Alt text](image-24.png)
C1 连续：两段曲线在连接点处连续，且切线也连续。（即一阶导数连续，更高阶的导数连续叫做曲率连续）
![Alt text](image-25.png)

### Splines

样条曲线（spline）：
![Alt text](image-26.png)

- 样条会穿过一系列的点，且满足一定的连续性

最常用的是 B-spline（Basis spline）：
![Alt text](image-27.png)

- 或者说叫做基函数样条，其中基函数可以理解为，用伯恩斯坦多项式在时间 t，它的几个不同的项，对控制点做了一个加权平均。
- 也可以理解为，用控制点的位置对伯恩斯坦多项式做一个加权求和
- 伯恩斯坦多项式就是一种基函数，由不同的函数通过不同的方式组合起来，可以形成别的函数
- B-spline 可以看作是贝塞尔曲线的一个扩展，它的能力更强，有更好的局部性。（修改一个点，只会影响到附近的曲线）

这节课不会谈论更多的 B-spline 和 NURBS，有兴趣的同学可以去看清华大学胡志明老师的课程。

## Surfaces

### Bézier Surfaces

![Alt text](image-28.png)

![Alt text](image-29.png)

- 像是用 16 个控制点把平面拽上去

![Alt text](image-30.png)

- 像这样，先对每一行应用贝塞尔曲线得到 4 个点，然后再对这 4 个点应用贝塞尔曲线，得到一个曲线。在这个曲线扫的过程中，得到的曲面。

![Alt text](image-31.png)

- 原本用一个 t 就能描述曲线，现在我们需要两个方向，所以这里使用 uv 来描述

![Alt text](image-32.png)

- 先用 u 来计算出 4 个点，然后再用 v 来计算出最终的点

![Alt text](image-33.png)

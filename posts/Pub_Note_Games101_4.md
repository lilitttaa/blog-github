---
title: Games101 4.Transformation Cont.
---

补充上节课的内容：
![Alt text](image.png)

- 如果我们逆时针旋转-theta 角度，会发现得到的矩阵刚好是旋转 theta 角度的转置矩阵。
- 即旋转矩阵的逆等于旋转矩阵的转置。
- 在数学上，我们把这样的矩阵叫做正交矩阵。

## 3D Transformations

用齐次坐标表示三维空间中的点或向量：
![Alt text](image-1.png)
![Alt text](image-2.png)
有一个问题是，在这样的矩阵表示下，我们是先应用线性变换还是先应用平移？
如果我们把变换展开就很清楚了：
$\begin{bmatrix} x' \\ y' \\ z' \end{bmatrix} = \begin{bmatrix} s_x & 0 & 0 \\ 0 & s_y & 0 \\ 0 & 0 & s_z\end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} + \begin{bmatrix} t_x \\ t_y \\ t_z \end{bmatrix}$
是先应用线性变换，再加上平移量。

![Alt text](image-3.png)

绕任意轴的旋转矩阵很难写，但是我们可以先从简单的开始，绕 x, y, z 轴的旋转矩阵：
![Alt text](image-4.png)

- 绕哪个轴旋转，哪个轴对应的坐标就应该是不变的
- 除去这个特殊的行和列，剩下部分其实就是一个二维的旋转矩阵

为什么$R_y$的矩阵和$R_x$和$R_z$的矩阵不一样？

- 如果你尝试像之前二维旋转矩阵推导的图应用在这些平面上，xoz 平面、yoz 平面、xoy 平面，你会发现只有 xoz 平面是按顺时针旋转的，其他两个是逆时针旋转的。
- 或者从叉乘的角度来看，$x \times y = z$，$y \times z = x$，$z \times x = y$，其中$ z \times x = y$，这个顺序跟坐标的顺序是反的。

![Alt text](image-5.png)

- 把复杂的旋转分解成绕 x, y, z 轴的旋转
- 绕 x、y、z 轴的角度分别叫做 pitch($\alpha$)、yaw($\beta$)、roll($\gamma$)角，这三个角叫做欧拉角。

### Rodrigues' Rotation Formula

![Alt text](image-6.png)

- 罗德里格斯公式根据旋转轴和旋转角度来计算旋转矩阵。
- 其中旋转轴通过一个向量来定义，那么存在一个问题，一个向量只能定义一个方向，但是旋转轴的起点在哪里呢？
  实际上，我们默认旋转轴是过原点的，如果旋转轴不过原点，我们可以先把旋转轴平移到原点，然后再旋转，最后再平移回去。

另外一个值得注意的点是最右边的矩阵跟叉乘里边的 dual matrix 是一样的。

推导：
![Alt text](image-7.png)
![Alt text](image-8.png)
![Alt text](image-9.png)

这门课不会谈论四元数，在这里简单的说一下：图形学中四元数主要是用来解决旋转插值的问题。

## Viewing Transformation

### View/Camera Transformation

![Alt text](image-10.png)

现实中怎么拍一张照片：

- 找一个好的地方，把所有人都集合在那里摆好 pose（模型变换）
- 找一个好的角度，或者说找一个好的位置，把这个相机放好，往某一个角度去看（视图变换）
- 拍照（投影变换）

图形学中也是这样的，拆分为三个变换模型：mvp（model view projection）

首先来看一下 view transformation：
怎么定义 view 的角度：
![Alt text](image-11.png)

- 一方面是向哪个方向看，即 look at
- 另一方面确定有没有一个自身的旋转，我们用 up direction 来定义

就像在摄影棚一样，把相机固定在一个位置和角度，在图形学中我们总是希望把相机放在原点，往负 z 方向看，y 轴向上。
![Alt text](image-12.png)
具体怎么做呢：
![Alt text](image-13.png)
y 跟 z 对齐了，x 自然而然也就对上了

表示为矩阵形式：
![Alt text](image-14.png)

- 把标准轴转到特定的轴简单，但反回来就很难，所以我们先求逆变换
- 旋转矩阵是正交矩阵，所以逆变换就是转置

关于模型变换和视图变换：

- 视图变换操作的是相机，然后其他物体跟着变换。
- 因为它们两都是对物体的变换，所以经常一起称为模型视图变换。

## Projection Transformation

有两种不同的投影方式：

- 正交投影（orthographic）
- 透视投影（perspective）

![Alt text](image-15.png)

- 左边正交投影的平行线还是平行的
- 但右边透视投影的就不是了，延长后会相交在一个点上
- 正交投影更多用于工程制图

![Alt text](image-16.png)

### Orthographic Projection

用一种简单的方式来描述：
![Alt text](image-17.png)

- 正交投影相当于是物体不管远近都被挤到一个平面上
- 直接去掉 z 坐标
- 然后不管 x 和 y 的范围有多大，都被挤到-1 到 1 的矩形上（一个约定俗成的做法，方便后面计算）

图形学中更正式的说法：
![Alt text](image-18.png)

把 xyz3 个轴的范围都映射到-1 到 1 的立方体上，这个立方体叫做 canonical cube。

![Alt text](image-19.png)

- 正式的作法，我们先做平移，然后再缩放

把这个变换写成矩阵形式：
![Alt text](image-20.png)

- 首先是从将中点平移到原点
- 然后缩放到-1 到 1 的范围，就是 2

![Alt text](image-21.png)

- 因为我们是往负 z 方向看，所以远的物体 z 值更小，这是右手坐标系导致的一个问题
- 所以像 OpenGL 这样的 API 会默认用左手系，因为左手系在这一点上会相对方便一些。但是会导致别的问题，比如 x 乘 y 不等于 z

### Perspective Projection

![Alt text](image-22.png)
![Alt text](image-23.png)

- 欧式几何里平行线永不相交，但在透视投影里会相交，这是为什么？难道欧拉错了？
- 欧式几何指的是在同一个平面里，但是在透视投影里涉及到不同的平面和角度

在具体说透视投影之前，我们需要回顾齐次坐标，这个对于透视投影很重要：
![Alt text](image-24.png)

怎么做透视投影呢：
![Alt text](image-25.png)

- 需要把视锥体（frustum）“挤压”成一个长方体，然后再做正交投影。
- 首先对应的这些经过挤压之后得保持对应，近平面的点都不变
- 然后远平面的 z 值不变
- 远平面的中心挤压后还是中心

挤压怎么做：
![Alt text](image-26.png)

- 可以根据侧面图的相似三角形得到高度跟深度的一个比例的关系
- 对于 x 也是同样的道理

那么现在我们给定任意一个 x y z，我们都能得到它的新的坐标 x' y'，只是 z 还不知道：
![Alt text](image-27.png)
![Alt text](image-28.png)
目标是算出左边的矩阵是什么。

![Alt text](image-29.png)

- 近平面上的点都不变
- 远平面上的点的 z 轴不变（远平面上的中心点的 z 值不变）

![Alt text](image-30.png)

近平面上的点变换后不变，仍然表示为 $\begin{bmatrix} x \ y \ n \ 1\end{bmatrix}^T$，然后在齐次坐标系下等价于 $\begin{bmatrix} nx \ ny \ n^2 \ n\end{bmatrix}^T$，对照前面相似三角形中的$\begin{bmatrix} nx \ ny \ ? \ n\end{bmatrix}^T$，我们可以列出一个方程。

这样至少我们知道了前两个数是 0

![Alt text](image-31.png)

远平面上的中点变换后不变，仍然表示为 $\begin{bmatrix} 0 \ 0 \ f \ 1\end{bmatrix}^T$，然后在齐次坐标系下等价于 $\begin{bmatrix} 0 \ 0 \ f^2 \ f\end{bmatrix}^T$，在前面乘上$\begin{bmatrix} 0 \ 0 \ A \ B\end{bmatrix}^T$，同样可以列出一个方程。

![Alt text](image-32.png)

最后有一个问题是，中间的点的 z 会变小还是变大还是不变呢？

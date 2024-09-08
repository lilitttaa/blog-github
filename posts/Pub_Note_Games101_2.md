---
title: Games101 2.Review of Linear Algebra
---

## Graphics' Dependencies

![Alt text](image.png)

- 图形学的发展越来越看重更高深的物理学知识，如波动光学，光作为一种光波如何与物体表面材质作用，得到不同的外观
- 信号处理：解决走样问题，反走样技术
- 数值分析：很多情况下，图形学是在解一些复杂的数学计算，比如整个渲染过程是在解一个递归定义的积分。模拟和仿真很多时候是在解一些有限元问题，或者各种扩散方程。

![Alt text](image-1.png)

## Vectors

### Vector

![Alt text](image-2.png)

### Vector Normalization

![Alt text](image-3.png)
$\hat{a}$ 读作 a hat，表示单位向量

### Vector Addition

平行四边形法则和三角形法则：
![Alt text](image-4.png)

### Cartesian Coordinates

![alt text](image-5.png)

- 图形学上默认是列向量, 转置变成行向量
- 表示为坐标系的形式，有助于计算向量长度

### Vector Multiplication

#### Dot Product

![alt text](image-6.png)

两个向量的点乘是一个数

![alt text](image-7.png)

在笛卡尔坐标系下，点乘的运算会更加简单，看作对应元素相乘再相加：
![alt text](image-8.png)

在图形学中，点乘用于：

- 找到两个向量或者两个方向之间的夹角
- 求向量之间的投影（在光照模型中，光从哪个方向进来，物体表面的法线是什么样的，我们从哪个方向去看，这些方向之间互相的夹角的计算都是通过点乘来运算的）
  ![alt text](image-9.png)
- 投影算出来有一个好处，可以把一个向量分解成两个向量，其中一个方向平行于某方向，另一个方向垂直于某方向
  ![alt text](image-10.png)
- 还可以计算两个向量或者两个方向有多么接近（例如在金属的反射中，如果观测方向处于反射方向的周围，就可以看到高光）
- 以及判断两个向量的方向性，基本一致、基本相反、垂直
  ![alt text](image-11.png)

#### Cross Product

![Alt text](image-12.png)

- 新的向量 c 和原本的两个向量 a 和 b 垂直，即 c 垂直于 a 和 b 所在的平面
- 新向量的长度$|\vec{c}| = |\vec{a}\times\vec{b}| = |\vec{a}||\vec{b}|sin\theta$
- 可以按照右手螺旋定则来确定 c 的方向
- 如果要交换两个向量的叉乘的顺序，那么必须得加上一个负号
- 叉乘可以用来建立一个三维空间中的直角坐标系

![Alt text](image-13.png)

- 我们的课程里边考虑的都是右手系，但是在 OpenGL 或者别的什么的 API 中，可能使用的是左手系，这样$\vec{x}\times\vec{y} = -\vec{z}$，不是很方便。
- 叉乘的结果一定是向量，所以即便是自己和自己叉乘，也会得到一个零向量，而不是零
- 叉乘满足分配率和结合率，但是不满足交换率

在代数上，叉乘的计算如下：
![Alt text](image-14.png)

- 向量的叉乘可以表示成矩阵形式

叉乘在图形学中到底有什么用呢？
![Alt text](image-15.png)
![Alt text](image-16.png)

- 向量左右的判断：如果 b 在 a 的左侧，那么 a 叉乘 b 的结果是正的
- 内外的判断：
  - $\vec{AB}\times\vec{AP}$的结果是正的代表 P 在$\vec{AB}$的左边。然后我们按照逆时针，如果 P 在$\vec{BC}$、$\vec{CA}$的左边，那么 P 就在三角形 ABC 的内部。
  - 这里边有一个前提，就是不管是按照逆时针还是顺时针，必须是有这样一个顺序的。
  - 内外的判断是光栅化的基础
  - 如果叉乘的结果是零，在图形学中这个叫 corner case，自己决定是内部还是外部

#### Orthonormal bases and coordinate frames（正交基和坐标系）

![Alt text](image-17.png)

![Alt text](image-18.png)

我们可以定义 u v w 这样的一个坐标系，定义这个有什么好处呢？可以把任意一个向量都给分解到这三个轴上去。

因为 u v w 都是单位向量，通过点乘可以直接得到投影长度

## Matrices

![Alt text](image-19.png)

### What is a matrix?

![Alt text](image-20.png)

变换是矩阵最大的应用，可以用来做旋转、缩放、错切等操作

### Matrix-Matrix Multiplication

![Alt text](image-22.png)

- 矩阵乘法是矩阵最有用的操作，必须满足 m x n 乘以 n x p，结果是 m x p，中间的 n 必须相同

- 结果中每个元素的值都可以看作是两个矩阵的行和列的点乘，比如：第 i 行第 j 列的元素，就是第一个矩阵的第 i 行和第二个矩阵的第 j 列的点乘

![Alt text](image-21.png)

矩阵乘积有一个非常重要的性质：

- 不满足交换律
- 满足结合律和分配律

其中结合律非常有用，比如 a b c 这个放在一块乘，可以先乘 a b 再乘 c，或者先乘 bc 再乘 a，只要不涉及到把它顺序对调就可以

### Matrix-Vector Multiplication

![Alt text](image-23.png)

- 矩阵和向量相乘其实就是变换的核心
- 比如说用这样一个矩阵乘以一个向量，就可以得到一个新的向量，新向量跟原来的向量按 y 轴对称。

### Transpose of a Matrix

![Alt text](image-24.png)

### Identity Matrix and Inverses

![Alt text](image-25.png)

- 单位矩阵是一个特殊的矩阵，对角线上全都是 1，其他地方都是 0，然后它的维度或者大小是 n x n
- 单位矩阵的作用是不做任何操作
- 但是可以定义一个矩阵的逆，如果一个矩阵和它的逆相乘得到的结果是单位矩阵，那么这两个矩阵是互逆的

### Vector multiplication in Matrix form

![Alt text](image-26.png)

- 点乘可以看作是一个向量的转置和另一个向量的乘积
- 叉乘的矩阵形式：把 a 向量重新组织一下，写成 A*这么一个矩阵，然后乘以 b 向量，得到的结果就是叉乘的结果。其中 A*叫做 dual matrix。（在后面的旋转的推导中会看到这个东西）

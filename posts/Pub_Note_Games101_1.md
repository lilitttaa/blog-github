---
title: Games101 1.Overview of Computer Graphics
---

## What is Computer Graphics?

![Alt text](image-19.png)

## Why Study Computer Graphics?

### Applications

- Video Games
  ![Alt text](image.png)
  - 从技术的角度上来说什么是好的画面呢，给一个简单的标准：直接看这个画面啊是不是足够亮。（如果全局光照做得好那么整个画面就会亮）
  - 图形学中的问题：卡通在是如何进行表述的？
- Movies
  ![Alt text](image-1.png)
  特效平时见不到所以做起来不困难，最困难的东西往往是日常生活中大家常见的一些东西
  ![Alt text](image-2.png)
  图形学中的问题：面部和动作捕捉是如何做到的
- Animations
  ![Alt text](image-5.png)
  图形学中的问题：毛发是怎么渲染的？如何表述复杂的几何形体？计算光线在这些几何形体这个之间这种传播方式？
  ![Alt text](image-3.png)
  图形学中的问题：粒子的模拟（风吹头发，头发碰撞）
- Design
  ![Alt text](image-6.png)
  CAD：可以看到车在不同的光照下的效果、还可以让车进行模拟碰撞
  ![Alt text](image-4.png)
  计算机生成的室内设计
- Visualization
  ![Alt text](image-7.png)
  - 人体经过一系列扫描得到三维空间中的信息，然后通过一定的办法把它变成视觉信息
  - 以及展示美国的雇佣增长率
  - 婴儿成像
- Virtual Reality/Augmented Reality
  ![Alt text](image-8.png)
  虚拟现实：看不到现实，全都是电脑生成的
  ![Alt text](image-9.png)
  增强现实：看到现实中的一些东西，然后在这之后你还可以看到有一些新的东西带进去了
- Digital Illustration
  ![Alt text](image-20.png)
  - 数字绘画：直接在电脑上画画
  - 图形学的应用：Adobe Photoshop
  - 图形学的问题：如何去描述曲线？如何去做差值？将不同的颜色覆盖在一块儿应该展示成什么颜色？
- Simulation
  ![Alt text](image-11.png)
  - 模拟可以体现在特效：沙子怎么飞舞，怎么推倒房屋，房屋为什么会被打成一块一块的，木板中间会怎么锻炼，沙子落到水里长什么样，黑洞是如何模拟的
- Graphic User Interface
  ![Alt text](image-12.png)
  - 图形用户接口：不同的设计，Windows 磁贴风格，Mac 各种设计
- Typography
  ![Alt text](image-13.png)
  - 字体设计：字体放大之后会变模糊，但是字母放大之后还是清晰的，为什么？字体是如何表示的？和图像有什么区别？为什么图像放大之后会变模糊？（涉及到点阵和矢量是不同的概念）
  - 字体测试：The quick brown fox jumps over the lazy dog，包含了 26 个字母，用来测试字体的完整性。（通常会出现两次，一次全大写，一次全小写）

### Why Study Computer Graphics?

![Alt text](image-14.png)
![Alt text](image-15.png)
![Alt text](image-16.png)

## Course Topics

- Rasterization
- Curves and Meshes
- Ray Tracing
- Animation/Simulation

计算机图形学包括了很多东西 opengl 仅仅是图形学中间的一个 API

### Rasterization

![Alt text](image-18.png)

- 把这个三维空间的几何形体显示在屏幕上就是光栅化
- 每秒钟能够能够生成 30 帧（30FPS）就叫实时，否则叫离线
- 光栅化主要是做投影

### Curves and Meshes

![Alt text](image-17.png)
涉及到，例如：

- 如何表示一条光滑的曲线？
- 如何表示曲面？
- 如何用简单的曲面通过细分得到更复杂的曲面？
- 当形状发生变化时，这些面要如何变化？
- 如何保持住物体的拓扑结构？

### Ray Tracing

![Alt text](image-21.png)

- 光线追踪主要在电影和动画中使用，因为它慢
- 但它能生成非常真实的画面
- trade off：为了达成某一个目标，不得不牺牲一些其他的目标
- 实时光线追踪：既像光栅化一样快，又能达到光线追踪的效果

### Animation/Simulation

![Alt text](image-22.png)

- 弹性球落在地上，怎么去挤压，以及怎么弹起来再落下去
- 布料模拟

## Course Logistics

GAMES101 is NOT about：
![Alt text](image-23.png)
![Alt text](image-24.png)
![Alt text](image-25.png)

- 需要猜测的内容基本都是计算机视觉的内容，比如左下角这张图要识别出哪些地方是人，哪些地方是路面，哪些地方是不同的障碍物。
- 分析理解这一系列就是计算机视觉在做的事

CG 与 CV 的区别：
![Alt text](image-26.png)

- 这些明显的边界已经越来越模糊了，图形学里边也应用深度神经网络
- AR、VR 等应用也涉及到 CV 和 CG 的结合

## Others

![Alt text](image-27.png)

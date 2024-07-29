---
title: Introduction To Character Animation
---

## 3D Computer Animation

![alt text](image-3.png)
电影中的一个个运动的角色涉及到三个领域：
![alt text](image.png)

1. 建模
2. 动画
3. 渲染

动画描述了一帧到下一帧是该怎么生成的这样的一个关系

基本上可以分为两类：
![alt text](image-1.png)

1. Simulation：主要是关注物理客观的一些现象，比如刚体、软体、流体的仿真，以及烟、火等……可以通过精确的数学描述把仿真的现象给建立起来。
2. Character Animation：是行为上的建模，比如人的动作、动物的动作等……通常还是找各种统计的方法把模型给建立起来。

![alt text](image-2.png)
它们之间的关系可以看作，Simutation + Control = Character Animation

## 为什么研究角色动画

角色动画的创建是一个劳动密集型的过程，而角色动画的研究目的就是把这样一个过程变成计算密集型：
![alt text](image-4.png)

## 角色动画 Pipeline

![alt text](image-5.png)
模型绑定到骨骼上，然后通过蒙皮，让骨骼带动模型或者说皮套进行形变。

## 现实中动作是怎么生成的

![alt text](image-6.png)
神经信号 -> 肌肉纤维的收缩 -> 受物理约束 -> 身体姿态

根据是否使用物理，角色动画分为两类：

1. Keyframe-based Animation
   ![alt text](image-7.png)
   忽略上面的部分，直接去更新角色的姿态。
2. Physics-based Animation
   ![alt text](image-8.png)
   忽略神经和肌肉的部分，通过物理仿真的方式来生成动作。

- Low-level control：直接控制每个关节
  ![alt text](image-9.png)
- High-level control：移动到某个位置
  ![alt text](image-10.png)

![alt text](image-11.png)

## Keyframe Animation

![alt text](image-12.png)
Keyframe Animation 在过去很长的一段时间都是靠动画师一帧一帧画出来的
参考：[Disney’s 12 Principles of Animation](https://the12principles.tumblr.com/)

而到了计算机图形学的时代，3D 动画的制作则是在关键帧上去调整角色姿态，然后通过插值的方式去生成中间的帧。参考：[How to Animate 3D Characters in 1 Minute](https://www.youtube.com/watch?v=TjJLIuFKA20)
![alt text](image-13.png)

里边涉及到的一些概念：

- Forward Kinematics：给定每个关节的旋转，计算出末端的位置
- Inverse Kinematics：给定末端的位置，计算出每个关节的旋转

## Motion Capture

动捕需要使用专业的设备，通过一些方法来捕捉动作，例如在身上贴标记点、惯性动捕、视觉动捕等……
![alt text](image-14.png)

## Motion Retargeting

有时我们需要把一个角色的动作应用到另一个角色上，这就需要 Motion Retargeting
![alt text](image-15.png)

## Motion Graphs/State Machines

使用 Motion Graphs 可以根据不同的控制输入在不同的动作状态间切换：
![alt text](image-16.png)
还可以训练一个 AI 在 MotionGraphs 里选择合适的边进行切换：
![alt text](image-17.png)
但 Motion Graphs 会随着动作的增多变得非常复杂
![alt text](image-18.png)

## Motion Matching

Motion Graphs 本质上是在动作这个层面进行切换，而 Motion Matching 把动作进一步的切片，在每一帧上去做匹配。每帧结束的时候去搜索一个新的姿态，既要满足控制输入的目标，又要尽量保持连续性。因此很大程度上是一个工程上的实现，即怎么去设计这样一个函数。参考：[https://www.gdcvault.com/play/1023280/Motion-Matching-and-The-Road](https://www.gdcvault.com/play/1023280/Motion-Matching-and-The-Road)
![alt text](image-19.png)

## Generative Model

用大量的动作数据去训练一个模型，比如可以录一两个小时的动作，然后直接丢给模型，而 Motion Matching 在动作库很大的情况下效果是会变差的。
![alt text](image-20.png)
参考：[[SIGGRAPH 2020] Local Motion Phases for Learning Multi-Contact Character Movements](https://www.youtube.com/watch?v=Rzj3k3yerDk)

## Cross-Modal Motion Synthesis

根据 Music、Speech、Text 等不同的输入去生成动作：
![alt text](image-21.png)

## Problems of Kinematic Methods

像前面说的这种 Keyframe-based/kinematic approach，它的问题在于：

- 物理合理性差
- 不能很好的处理与环境的交互

## Others

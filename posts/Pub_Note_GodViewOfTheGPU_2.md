---
title: 上帝视角看GPU（2）：逻辑上的模块划分
---

随着时代的发展，新的需求逐渐出现。这一节来看看如何从基本的图形流水线逐步扩充成现在的样子。

这是我们上一节过后得到的基本流水线：
![alt text](image.png)

- vertex shader 和 pixel shader，都是单入单出结构。
- 如果我们要处理的单元不是顶点或像素，而是图元，那就做不了了。

![alt text](image-1.png)

- 这个需求催生了一个新的 shader，叫 geometry shader。

![alt text](image-2.png)

- 相当于把 primitive assembler 给拆开了。vertex shader 输出处理后的顶点之后，整个 primitive 先被送入 geometry shader，处理后往下做 primitive assembler 的剩余事情。
- geometry shader 和前两种 shader 相比，有个很大的特点是，单入多出。一个 primitive 进入 geometry shader，可以输出多个 primitive。
- 通过它我们可以把整个三角形移动位置，或者一个三角形切成多个。
- 除此之外，它还使得 GPU 可以做到非均匀输出：例如，第一个三角形输出 1 个，第二个三角形输出 5 个，第三个三角形输出 3 个。

![Alt text](image-13.png)

- vertex shader 和 pixel shader 都是必须的。但 geometry shader 是可选的。不指定就表示直接往后连。

![alt text](image-3.png)

- Geometry shader 输出的 primitive，还可以把数据直接输出到内存，这个过程称为 stream output。

![Alt text](image-14.png)

- 甚至也可以不指定 geometry shader，从 vertex shader 直接输出。
- 这就给了从流水线中间直接导出数据的能力。
- 有时候我们把 vertex buffer 里的顶点处理一遍，存出去，之后反复多次使用，以减少重复计算。

![Alt text](image-15.png)

- geometry shader 看起来灵活，但是性能非常低。正是因为它的灵活性，硬件无法做各种假设来优化性能，只能实现得非常保守。
- 尤其是把一个三角形切成多个的情况，本来是个算法固定的操作，但如果全面弄成可编程，硬件在执行之前甚至不知道你是要细分三角形，更没办法优化。

![alt text](image-4.png)

- 因此，随着三角形细分这个需求逐步增加，GPU 的流水线又加入了专门的 tessellation 。
- 它包含三个单元：hull shader、tessellator 和 domain shader。
- 其中 hull shader，里边可以指定每个图元需要被如何细分，比如内部分成多少个，每条边分成多少段。
  ![alt text](image-5.png)
- tessellator 是个固定流水线的单元，用固定的算法来执行细分。
- domain shader 根据细分的参数负责计算细分后的每个顶点信息，也是可选的。

![alt text](image-6.png)

- 既然 GPU 有这样强大的计算能力，那除了图形渲染，是不是还可以用做更加通用的并行计算。
- 最早的做法是，渲染一个覆盖屏幕的大三角形，在 pixel shader 里做通用并行计算。相当于每个 pixel 是一个线程。
- 这样虽然能解决一些问题，但单入单出的限制仍然存在。
- 并且仍然需要让数据通过 vertex shader、rasterizer 等整条流水线，还是存在浪费。
- 再加上，这使得开发人员必须学习图形流水线，提高了门槛。
- 这个发展起来的方向被称为 GPGPU，用 GPU 做通用计算。

![alt text](image-7.png)

![alt text](image-8.png)

- 这个需求，进一步催生了有硬件支持的 GPGPU，这种 shader 叫做 compute shader。
- 可以多入多出，可以任意读取，可以任意写入。
- 不再需要经过那些固定流水线的单元，直接利用 GPU 上的计算单元进行并行计算。

![alt text](image-9.png)

- compute shader 独立于图形流水线单独存在，输入输出都是内存。
- 整条计算流水线只有一步，使得开发难度和程序构成门槛低了很多。

![Alt text](image-16.png)

- 至此，GPU 的流水线已经非常接近现在的了，但现在仍然存在一个问题，要渲染更复杂的物体，就得输入更复杂的数据。
- 要解决这个问题，就必须在少量甚至没有输入数据的情况下，让 GPU 自己生成大量复杂的数据。

![Alt text](image-17.png)

- compute shader 的任意读写能做这件事情，但它不能接入 rasterizer。

![alt text](image-10.png)
![alt text](image-11.png)

- 这个需求催生了 amplification shader 和 mesh shader。
- amplification shader 负责指定执行多少次 mesh shader。
- mesh shader 负责产生几何体。

![alt text](image-12.png)

- 这时候渲染的单元就不再是图元，而是一小块网格，称为 meshlet。
- 当一个 meshlet 送到 amplification shader，它可以决定这个 meshlet 是否需要进一步处理。如果要的话，就往下送到 mesh shader，产生带有丰富细节的一堆图元。
- 不过这两个 shader 支持的 GPU 和使用它们的程序并不多。在现在的 GPU 里，它们仍是和原先的流水线并存。

![Alt text](image-18.png)

- 这些年来游戏用了各种方法，提高真实感的体验。这些方法往往互相冲突，或者用了各种限制很大的 hack。
- 另一方面，光追这个古老但通用的技术一直没法很好地在 GPU 上应用，因为它不但计算量大，还跟基于光栅化的渲染方法有着完全不一样的流程。

![Alt text](image-19.png)

- 随着这样的需求，GPU 发展除了提供光追的能力，出现了一条独立的流水线。
- 包含多个新类型的 shader：
  - ray generation shader：负责生成光线
  - intersection shader：负责判定光线与物体是否相交
  - any hit shader：在光线打到物体的时候判定是否要继续往前走
  - closest hit shader：在光线打到物体的最近点计算颜色
  - miss shader：负责当光线没打到任何物体的时候计算颜色
  - 与它们配合使用的 callable shader，可以进行动态调用。

![Alt text](image-20.png)
根据这样的思路，GPU 可以用在更多的领域，比如：

- 加入了计算神经网络专用的 tensor 计算模块
- 视频编码解码专用的模块

都是独立的流水线。

![Alt text](image-21.png)

- 这也是 CPU 和 GPU 的另一大区别：
  - CPU 的目的是一个通用模块。编程的时候一路往下写就是了。
  - GPU 则分成了多个模块，各有各的特点和用途。编程的时候就需要开发者对这些模块有比较明确的了解，在程序里安排如何使用它们。

![Alt text](image-22.png)

- 目前的 GPU，这些流水线之间不能互相调用。
- 如果要在图形流水线里用到计算流水线，就得先调用计算的，把结果写入 texture 或者 buffer，再在图形流水线里读取。
- 作者曾提出可配置式流水线的构想：连线也是可编程的。这样就能根据需要组装流水线。然而到了现在，也没有这样的 GPU 。

至此，我们已经看到了现在 GPU 的一个基本结构，但如果用这个模块划分去实现 GPU 硬件，仍然存在两个问题：

- shader 的种类那么多，如果一个程序只用到了一部分，负载不平衡，其他的计算能力不就浪费了？
- 流水线已经这么复杂，如何在有限的成本内把它安排到硬件上？

这些问题，我们下期再讨论。

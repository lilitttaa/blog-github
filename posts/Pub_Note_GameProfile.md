---
title: 游戏性能优化
---

## Resources

- [Unity 移动端游戏性能优化](https://zhuanlan.zhihu.com/p/403433893)
- [UE5 性能优化笔记](https://zhuanlan.zhihu.com/p/713335451)
- [Graphic Debugger 工具大杂烩，你要的都在这](https://zhuanlan.zhihu.com/p/70780719)
- [SnapDragon 学习](https://www.cnblogs.com/revoid/p/12838221.html)
- [awesome-game-tester](https://github.com/jianbing/awesome-game-tester)
- [UFSH2023 虚幻引擎跨平台性能优化实践 | 李赫峥 RealLink](https://www.bilibili.com/video/BV1Ye41127Bw)
- [UF2022 虚幻引擎游戏性能优化秘笈](https://www.bilibili.com/video/BV1He4y1s729)
- [腾讯光子陈玉钢谈《Apex Legends Mobile》渲染优化实践](https://bbs.gameres.com/thread_896788_1_1.html)

## Black Apple

- [VM17](https://blog.csdn.net/Wine_streetQAQ/article/details/129719390)
- [VM unlocker](https://zhuanlan.zhihu.com/p/658521465)

测试工具

- xcode instruments
- sysdiagnose 可以测试底层耗电量之类的，非实时，20 分钟记录一次

VMTools 安装失败：
![alt text](img_v3_02e6_4b1d32b1-62d4-4801-b919-deb9f5ffe67g.jpg)

## Android

![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

## Others

![alt text](image.png)

## Instrument

- [Instrument 工具使用](https://juejin.cn/post/6865102561507672077)

## SnapDragon Profiler 指标说明

注:这些是特定于进程的指标，只适用于当前选定的进程。

- CPU：进程的 CPU 性能指标。
  - CPU Utilization %：进程活跃的 CPU 时间百分比。
- EGL
  - Avg Frame Time：一帧时间（秒）
  - FPS：每秒帧数
- GPU General
  - Clocks / Second：每秒 GPU 时钟数。
- GPU Memory Stats
  - Avg Bytes / Fragment：从主内存传输到每个片段的平均字节数。
  - Avg Bytes / Vertex：从主内存传输到每个顶点的平均字节数。
  - Read Total (Bytes / sec)：GPU 每秒从内存读取的总字节数。
  - SP Memory Read (Bytes / Second)：着色器处理器每秒从内存读取的数据字节数。
  - Texture Memory Read BW (Bytes / Second)：每秒从内存读取的纹理数据字节数。包括从内存读取的平台压缩纹理数据字节。
  - Vertex Memory Read (Bytes / Second)：每秒从内存读取的顶点数据字节数。
  - Write Total (Bytes / sec)：GPU 每秒写入内存的总字节数。
- GPU Preemption
  - Avg Preemption Delay：从抢占请求到抢占开始的平均时间（微秒）。
  - Preemption / second：每秒发生的 GPU 抢占次数。
- GPU Shader Processing
  - % Anisotropic Filtered：使用'Anisotropic'采样方法过滤的 texels 百分比
  - % Linear Filtered：使用'Linear'采样方法过滤的 texels 百分比
  - % Nearest Filtered：使用'Nearest'采样方法过滤的 texels 百分比
  - % Non-Base Level Textures：来自非基 MIP 级别的 texels 百分比
  - % Shader ALU Capacity Utilized：最大着色器容量（ALU 操作）的利用率百分比。对于着色器工作的每个周期，平均百分比的总着色器 ALU 容量被该周期利用
  - % Shader Busy：所有着色器核心忙碌的时间百分比。
  - % Time ALUs Working：在着色器忙碌时，ALUs 工作的时间百分比。
  - % Time Compute：在计算工作相对于着色所有内容所花费的总时间中所花费的时间百分比。
  - % Time EFUs Working：在着色器忙碌时，EFUs 工作的时间百分比。
  - % Time Shading Fragments：着色片段相对于着色所有内容所花费的总时间中所花费的时间百分比
  - % Time Shading Vertices：着色顶点相对于着色所有内容所花费的总时间中所花费的时间百分比
  - ALU / Fragment：每个着色片段发出的平均标量片段着色器 ALU 指令数，以全精度 ALUs 表示（2 mediump = 1fullp）。包括插值指令。不包括顶点着色器指令
  - ALU / Vertex：每个着色顶点发出的平均标量顶点着色器 ALU 指令数。不包括片段着色器指令。
  - EFU / Fragment：每个着色片段发出的平均标量片段着色器 EFU 指令数。不包括顶点 EFU 指令。
  - EFU / Vertex：每个着色顶点发出的平均标量顶点着色器 EFU 指令数。不包括片段 EFU 指令。
  - Fragment ALU Instructions / Sec (Full)：每秒发出的全精度片段着色器指令总数。不包括中等精度指令或纹理获取指令
  - Fragment ALU Instructions / Sec (Half)：每秒发出的半精度标量片段着色器指令总数。不包括全精度指令或纹理获取指令。
  - Fragment EFU Instructions / Second：每秒发出的标量片段着色器基本函数单元（EFU）指令总数。这些包括像 sin、cos、pow 等数学函数。
  - Fragment Instructions / Second：每秒发出的片段着色器指令总数。报告为全精度标量 ALU 指令 - 2 个中等精度指令等于 1 个全精度指令。还包括插值指令（在 ALU 硬件上执行）和 EFU（基本函数单元）指令。不包括纹理获取指令
  - Fragments Shaded / Second：每秒提交给着色器引擎的片段数。
  - Textures / Fragment：每个片段引用的平均纹理数。
  - Textures / Average：每个顶点引用的平均纹理数。
  - Vertex Instructions / Second：每秒发出的标量顶点着色器指令总数。包括全精度 ALU 顶点指令和 EFU 顶点指令。不包括中等精度指令（因为它们不用于顶点着色器）。不包括顶点获取或纹理获取指令。
  - Vertices Shaded / Second：每秒提交给着色器引擎的顶点数。
- GPU Stalls
  - % Stalled on System Memory：L2 缓存等待系统内存数据的时钟周期百分比。
  - % Texture Fetch Stall：着色器处理器无法再请求纹理数据的时钟周期百分比。这个指标的高值意味着着色器无法足够快地从纹理管道（L1、L2 缓存或内存）获取纹理数据，渲染性能可能会受到负面影响。
  - % Texture L1 Miss：L1 纹理缓存未命中数除以 L1 纹理缓存请求数。这个指标不考虑每个时间段内发出的纹理请求数量（像'% GPU L1 Texture cache miss'指标那样），而是简单的未命中率。
  - % Texture L2 Miss：L2 纹理缓存未命中数除以 L2 纹理缓存请求数。这个指标不考虑每个时间段内发出的纹理请求数量，而是简单的未命中率。
  - % Vertex Fetch Stall：GPU 无法再请求顶点数据的时钟周期百分比。这个指标的高值意味着 GPU 无法足够快地从内存获取顶点数据，渲染性能可能会受到负面影响。
  - L1 Texture Cache Miss Per Pixel：每像素的纹理 L1 缓存未命中平均数。这个指标的低值意味着更好的内存一致性。如果这个值很高，考虑使用压缩纹理，减少纹理使用等。
- Memory：进程的内存性能指标
  - Memory Usage：进程使用的内存（RAM）字节。
- Network：网络数据统计
  - Rx Bytes (TCP)：此进程接收的 TCP 字节。
  - Rx Bytes (Total)：此进程接收的总字节。
    　　　　 Rx Bytes (UDP)：此进程接收的 UDP 字节。
  - Tx Bytes (TCP)：此进程发送的 TCP 字节。
  - Tx Bytes (Total)：此进程发送的总字节。
  - Tx Bytes (UDP)：此进程发送的 UDP 字节。
- Primitive Processing
  - % Prims Clipped：被 GPU 剪裁的原语百分比（在此处生成新原语）。要剪裁原语，它必须在视口中有可见部分，但延伸到“防护带”之外 - 一个围绕视口的区域，显著减少了硬件必须剪裁的原语数量。
  - % Prims Trivially Rejected：被简单拒绝的原语百分比。如果原语在渲染表面的可见区域之外，则可以简单地拒绝原语。这些原语被光栅化器忽略。
  - Average Polygon Area：每个多边形的平均像素数。Adreno 的分箱架构将计算每个“箱”覆盖的原语，因此这个指标可能不完全符合预期。
  - Average Vertices / Polygon：每个多边形的平均顶点数。对于三角形大约是 3，对于三角形带接近 1。
  - Pre-clipped Polygons / Second：每秒提交给 GPU 的多边形数，之前没有任何硬件剪裁。
  - Reused Vertices / Second：来自变换后顶点缓冲区缓存的顶点数。一个顶点可能用于多个原语；这个指标的高值（与着色顶点数相比）表明变换顶点的重用良好，减少了顶点着色器的工作量。
    系统：系统级指标 - 这些指标适用于任何进程。
- CPU Core Frequency：以赫兹为单位的 CPU 核心频率。
- CPU Core Load：CPU 核心负载（CPU 频率 \* CPU%占用率）
- CPU Core Utilization：CPU 核心活跃的 CPU 时间百分比
- DSP - Application：DSP 指标
- DSP - Compute：DSP 指标
- GPU General：基本 GPU 指标
- GPU Memory Stats：与 GPU 内存访问相关的指标。
- GPU Preemption：与 GPU 抢占相关的指标
- GPU Shader Processing：与 GPU 着色处理相关的指标
- GPU Stalls：测量管道内暂停的 GPU 指标。
- Network - WiFi：WiFi 接口的网络统计信息
- Primitive Processing：与原语计数、拒绝等有关的指标。
- System Memory：系统的内存性能指标。
- Thermal：与温度相关的指标。

## 问题


- UI 字体图集太大，导致读写带宽高：1024 改为 512
![alt text](image-4.png)
- UI字体图集带宽还是高，改为部分更新图集？
- 一加Ace2+ColorOS+Adreno TM 730连接RenderDoc显示无法访问Vulkan
在安卓Log信息中看到一些权限访问的信息，所以把禁止权限监控打开，然后就可以连接了
- 发现GPU Preemption
bining和niagara的compute shader发生抢占？
![alt text](image-9.png)
## 如何分析SnapDragon Profiler中哪个RenderStage是哪个Pass

- 根据MRTs的数量，可以判断这是BasePass
![alt text](image-5.png)
- 对照Surface Width和Surface Height，看以看到这个是基本符合的：
![alt text](image-6.png)
- 根据前后的RenderStage，判断出这个是CombineLUTs：
![alt text](image-7.png)
比如这里就发现这里的像素着色器的开销尤其的高
![alt text](image-8.png)
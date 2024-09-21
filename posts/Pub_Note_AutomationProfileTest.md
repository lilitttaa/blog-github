---
title: 自动化性能测试
---

## Resources

- [游戏客户端自动化性能测试流程设计](https://statics-umu-cn.umucdn.cn/resource/Z4c/h8l3/G5OWs/transcoding/1822312440.mp4)

## 性能检测方法和指标设定

- 基于数据而不是靠猜
- 在 profiler 中确定是什么导致了变慢
- 在确定了准确信息后再去修复

### 客户端性能指标

- 静态客户端性能：无需运行游戏
  - 美术资源合规检查
  - 包体无用资源检查
  - 包体重复资源检查
- 动态客户端性能：运行时收集数据进行监测
  - FPS
  - 内存
  - CPU
  - DrawCall
  - 耗电量
  - ……

## 管线层级和依赖关系

## 功能模块设计

## 性能优化建议

## 性能测试工具

### CPU

- Unreal Insights

### GPU

帧分析工具：

- RenderDoc：综合看来最好用的帧分析工具，可以评估每个API调用的执行时间。
- Snapdragon Profiler：用于 Adreno GPU，可以看Clock，很多时候不稳定
- Arm Frame Adivisor：用于 Mali GPU，无法捕获执行时间，但是可以对单次绘制调用的着色器效率、内存效率进行评估，可以作为RenderDoc的补充。
- Arm Graphics Analyzer：用于 Mali GPU，不是很好用，已停止维护。Arm官方推荐使用 RenderDoc 和 Frame Advisor 来替代。
- Android GPU Inspector：支持机型有限。
- Pix Analysis

计数器分析工具：主要用于用于监控一段时间内的各项GPU硬件性能数据变化，适合定向分析。

- Snapdragon Profiler
- Arm Streamline
- Android GPU Inspector

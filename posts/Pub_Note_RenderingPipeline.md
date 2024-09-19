---
title: Unreal Engine Rendering Pipeline
---

## 渲染管线

![alt text](image-2.png)

## 其他
![alt text](image.png)
![alt text](image-1.png)

```cpp
/** Flags to annotate a pass with when calling AddPass. */
enum class ERDGPassFlags : uint8
{
    /** Pass doesn't have any inputs or outputs tracked by the graph. This may only be used by the parameterless AddPass function. */
    None = 0,

    /** Pass uses rasterization on the graphics pipe. */
    Raster = 1 << 0,

    /** Pass uses compute on the graphics pipe. */
    Compute = 1 << 1,

    /** Pass uses compute on the async compute pipe. */
    AsyncCompute = 1 << 2,

    /** Pass uses copy commands on the graphics pipe. */
    Copy = 1 << 3,

    /** Pass (and its producers) will never be culled. Necessary if outputs cannot be tracked by the graph. */
    NeverCull = 1 << 4,

    /** Render pass begin / end is skipped and left to the user. Only valid when combined with 'Raster'. Disables render pass merging for the pass. */
    SkipRenderPass = 1 << 5,

    /** Pass accesses raw RHI resources which may be registered with the graph, but all resources are kept in their current state. This flag prevents
     *  the graph from scheduling split barriers across the pass. Any splitting is deferred until after the pass executes. The resource may not change
     *  state within the pass execution. Affects barrier performance. May not be combined with Async Compute.
     */
    UntrackedAccess = 1 << 6,

    /** Pass uses copy commands but writes to a staging resource. */
    Readback = Copy | NeverCull,

    /** Mask of flags denoting the kinds of RHI commands submitted to a pass. */
    CommandMask = Raster | Compute | AsyncCompute | Copy,

    /** Mask of flags which can used by a pass flag scope. */
    ScopeMask = NeverCull | UntrackedAccess
};
```

## 一些渲染中使用到的宏

- **CSV_SCOPED_TIMING_STAT_EXCLUSIVE(RenderBasePass);**
  用于 CSV（逗号分隔值）文件的分析，它创建一个作用域，在这个作用域内，指定的渲染 Pass（这里是 RenderBasePass）的时间会被测量并记录。使用 EXCLUSIVE 版本意味着只记录这个特定作用域的持续时间，不包括任何嵌套在其中的作用域的时间。参考：CSVProfiler.h
- **SCOPED_DRAW_EVENT(RHICmdList, MobileBasePass);**
  创建一个绘制事件的作用域，通常用于标记渲染过程中的一个特定阶段或 Pass
- **SCOPE_CYCLE_COUNTER(STAT_BasePassDrawTime);**
  用于统计 CPU 执行时间
- **SCOPED_GPU_STAT(RHICmdList, Basepass);**
  用于在作用域内执行的所有 GPU 命令的时间
- **SCOPED_GPU_MASK(RHICmdList, Basepass);**
  SCOPED_GPU_MASK 宏在虚幻引擎（Unreal Engine）中用于定义一个 GPU 执行的特定作用域，并且可以指定在这个作用域内执行的渲染命令应该在哪些 GPU 掩码上执行。这通常用于多视图渲染（Multi-view rendering）或者当需要针对特定的 GPU 执行流（如特定的视图或渲染通道）应用特定的渲染命令或设置时。
  在多视图渲染中，不同的视图可能需要在 GPU 的不同部分执行，使用这个宏可以限制某些渲染命令只对特定的视图生效。


去掉
RDG_TEXTURE_ACCESS(LightShaftOcclusionTexture, ERHIAccess::SRVGraphics)
RDG_TEXTURE_ACCESS(LinearDepthTexture, ERHIAccess::SRVGraphics)
会不会对PC端FOG有影响
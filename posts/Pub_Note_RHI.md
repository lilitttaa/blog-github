---
title: Unreal Engine RHI API
---

## API

### RHICmdList.NextSubpass()

- 这个函数调用通常出现在使用 Vulkan 或类似图形 API 的渲染循环中。
- 在 Vulkan 中，一个 Render Pass 可以包含多个 Subpass，每个 Subpass 代表渲染过程中的一个独立步骤，它们可以**并行**执行以提高渲染效率。
- NextSubpass() 函数的作用是通知 API 完成当前 Subpass 的执行，并准备进行下一个 Subpass。
- 每个 Subpass 可以有其自己的输入附件（如纹理）和输出附件，它们可以被用于渲染操作，如清空颜色和深度缓冲区、执行绘制命令等。
- 当一个 Subpass 完成其所有渲染命令后，调用 NextSubpass() 会触发 API 进行内部状态的转换，以适应下一个 Subpass 的需求。

例如：从渲染不透明物体的 Subpass 转换到渲染透明物体的 Subpass
![alt text](image.png)

### MeshPassProcessor

![alt text](image-1.png)
![alt text](image-2.png)

### 半透明排序

![alt text](image-3.png)
使用 Union:
![alt text](image-4.png)
![alt text](image-5.png)

### DrawMesh

![alt text](image-6.png)

### Material 相关的 Flag

![alt text](image-7.png)

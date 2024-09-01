---
title: 只狼解包
---

## References

- [【元旦快乐】只狼&黑魂 3 Mod 制作攻略白皮书 V1.0 by 遗忘的银灵](https://www.bilibili.com/read/cv4264951/)
- [【直播录屏】只狼解包、数据研究、MOD 制作、开发者菜单以及 AI 机制的简单介绍](https://www.bilibili.com/video/BV1rf4y1h7QZ/)
- [《艾尔登法环》解包教程](https://www.bilibili.com/read/cv16477131/)
- [法环解包 — 对 FS 社宝具库](http://includedark.com/index.php/archives/427/)
- [How to Export Models from Elden Ring Using Blender : Elden Ring Modding Guides](https://www.youtube.com/watch?v=f9WtRrl5PSo)

## 工具

- 解包：[UXM](https://github.com/JKAnderson/UXM)
- 参数编辑：[DSP](https://github.com/legendaryhero1981/DSParamEditor)
- 动画编辑：[DSA](https://github.com/Meowmaritus/DSAnimStudio)
- 代码解包：[Yabber](https://github.com/JKAnderson/Yabber)
- lua decompiler：[DSLuaDecompiler](https://github.com/katalash/DSLuaDecompiler)
- 模型.flver 转.fbx：[Noesis](https://www.richwhitehouse.com/filemirror/noesisv4474.zip)
- flver to sdm&ascii：[BloodBorne_model](https://discord.com/invite/MGEEtXD9rr)
- blender 插件，打开.ascii 文件，需要 blender 版本为 2.80：[XNALaraMesh](https://github.com/johnzero7/XNALaraMesh)
- blender 插件，打开.smd 文件：[BlenderSourceTools](http://steamreview.org/BlenderSourceTools/)

## 解包

先找到 Sekiro 文件目录：
![Alt text](image.png)
使用 UXM 解包 Sekiro：
![Alt text](image-1.png)
![Alt text](image-2.png)
解包后会多出来很多文件，对比一下：
解包前：
![Alt text](image-4.png)
解包后：
![Alt text](image-3.png)

## 参数编辑器

![Alt text](image-5.png)
![Alt text](image-6.png)
![Alt text](image-7.png)
就能看到各种参数了：
![Alt text](image-8.png)
不过名字还看不到

## 动画编辑器

![Alt text](image-9.png)
选择一个角色：
![Alt text](image-13.png)
![Alt text](image-11.png)
![Alt text](image-12.png)
这样就能看到角色各个动画，及其动画轨道了：
![Alt text](image-10.png)

## DSLuaDecompiler 编译为 exe

DSLuaDecompiler 项目不包含 exe 文件，需要自己编译，需要下载对应的 .NET SDK，然后在项目目录下执行以下命令，即可

生成.exe 文件：
`dotnet build -c release ./DSLuaDecompiler`
注意目录：
![Alt text](image-18.png)
可以看到已经生成了 exe 文件：
![Alt text](image-19.png)

## AI 逻辑

使用 Yabber 对 script 下的.dcx 文件进行解包：
![Alt text](image-14.png)
可能会遇到问题，根据提示 copy dll 就行：
![Alt text](image-15.png)
于是会生成一个相应的目录：
![Alt text](image-16.png)
里边就是相应的 AI 逻辑：
![Alt text](image-17.png)
但此时打开，可以看到还是二进制文件：
![Alt text](image-20.png)
需要使用 DSLuaDecompiler 进行反编译

将需要反编译的文件拖入 DSLuaDecompiler.exe 文件中，会在同目录生成一个 .dec.lua 文件：
![Alt text](image-21.png)
打开这个文件，就能看到 lua 代码了：
![Alt text](image-22.png)

## 解包模型

以 map 为例：
![Alt text](image-24.png)
![Alt text](image-23.png)
生成一个对应的目录：
![Alt text](image-26.png)
可以看到目录里有.flver 文件：
![Alt text](image-25.png)
然后使用 BloodBorne_model 生成.ascii 文件和.smd 文件：
![Alt text](image-27.png)
再通过 Blender 导入 smd 文件：
![Alt text](image-28.png)

## Names

https://github.com/thefifthmatt/SoulsRandomizers/tree/master/dists/Names

可以看到其中一部分编号的含义：
![Alt text](image-29.png)

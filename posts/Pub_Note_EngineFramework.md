---
title: UnrealEngine Framework
---

FEngineLoop::PreInitPostStartupScreen：
![alt text](image.png)
![alt text](image-1.png)
FEngineLoop::Init：
![alt text](image-2.png)

结论：
- Editor下，GEngine、GEditor、GUnrealEd都是同一个UUnrealEdEngine对象
- 而Game下，GEngine是UEngine对象，GEditor和GUnrealEd都为nullptr
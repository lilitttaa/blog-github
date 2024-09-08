---
title: Memory Manage
---

## Resources

- [UE5 内存管理原理](https://mytechplayer.com/archives/ue5%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E5%8E%9F%E7%90%86)
- [UE4 内存管理](https://gwb.tencent.com/community/detail/121269)

UProperty 容器管理的指针对象必须是能够被 GC 管理的对象，否则会导致内存泄漏。
![alt text](image.png)

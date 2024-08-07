---
title: C++ Primer 12.动态内存
---

## 内存概述

生命周期：

- 全局对象：程序启动时分配，程序结束时销毁
- 局部自动对象：进入块时分配，离开块时销毁
- 局部 static 对象：第一次使用时分配，程序结束时销毁
- 动态分配对象：显示控制分配和释放

内存空间：

- 静态内存：局部 static、类 static、任何定义在函数之外的对象
- 栈内存：函数内的非 static 对象
- 自由空间/堆内存：动态分配的对象

## 动态内存和智能指针

- 使用 new 分配内存
- 使用 delete 释放内存
- 动态分配内存容易出错：
  - 忘记释放内存
  - 释放后继续使用

为了避免这些问题，C++11 引入了智能指针(定义在头文件 memory 中)：

- shared_ptr：多个指针指向同一对象
- unique_ptr：独占对象
- weak_ptr：shared_ptr 的伴随类，是一种弱引用，指向 shared_ptr 所管理的对象。

### shared_ptr

- shared_ptr 是一种智能指针，多个 shared_ptr 可以指向同一个对象，shared_ptr 会记录有多少个 shared_ptr 共享对象。
- 当动态对象不再被使用时，shared ptr 类会自动释放动态对象，这一特性使得动态内存的使用变得非常容易。

初始化：

```cpp
shared_ptr<string> p1; // 默认初始化，保存一个空指针
shared_ptr<list<int>> p2;
shared_ptr<int> p3(new int(42)); // p3 指向一个值为 42 的 int
shared_ptr<int> p4 = make_shared<int>(42); // 使用 make_shared 初始化
shared_ptr<string> p5 = make_shared<string>(3, '9'); // 类似于emplace，make_shared 用参数来构造对象
shared_ptr<int> p6(p3); // p6 和 p3 指向相同的对象
```

拷贝和赋值：

```cpp
auto p = make_shared<int>(42);
auto q(p); // p 和 q 指向相同的对象
auto r = make_shared<int>(42);
r = q; // 递增 q 的引用计数，递减 r 的引用计数
```

其他操作：

```cpp
shared_ptr<int> p1;
if (p1){ // 检查p1是否为空
	*p1 = 42; // 解引用，如果p1为空，会出错
}
class A{
public:
	int a;
};
shared_ptr<A> p3 = make_shared<A>();
p3->a = 1; // 使用箭头运算符访问对象成员
A *p = p3.get(); // get 返回指向的指针，要注意 p3 释放后，p 会变成野指针
shared_ptr<A> p4 = make_shared<A>();
swap(p3, p4); // 交换两个智能指针
p3.swap(p4); // 交换两个智能指针
p3.unique(); // 检查是否是唯一的指针，如果是，返回 true
p3.use_count(); // 返回与 p3 共享对象的智能指针数量
```

给出一个简单的实现：

```cpp
#include <iostream>
#include <atomic>
#include <algorithm>

template<typename T>
class simple_shared_ptr {
private:
    T* ptr; // 指向管理对象的指针
    std::atomic<int>* count; // 引用计数器

public:
    simple_shared_ptr(T* p = nullptr) : ptr(p), count(new std::atomic<int>(1)) {
        if (p == nullptr) {
            *count = 0; // 对于nullptr，计数器初始化为0
        }
    }

    simple_shared_ptr(const simple_shared_ptr<T>& other) : ptr(other.ptr), count(other.count) {
        if (ptr) {
            ++(*count); // 引用计数增加
        }
    }

    simple_shared_ptr<T>& operator=(const simple_shared_ptr<T>& other) {
        if (this != &other) {
            // 减少当前对象的引用计数，并在引用计数为0时删除对象
            if (ptr && --(*count) == 0) {
                delete ptr;
                delete count;
            }
            ptr = other.ptr;
            count = other.count;
            if (ptr) {
                ++(*count); // 引用计数增加
            }
        }
        return *this;
    }

    ~simple_shared_ptr() {
        if (ptr && --(*count) == 0) {
            delete ptr;
            delete count;
        }
    }

    T& operator*() const {
        return *ptr;
    }

    T* operator->() const {
        return ptr;
    }

    operator bool() const {
        return ptr != nullptr;
    }

    int use_count() const {
        return count ? count->load() : 0;
    }
};
```

### 直接管理内存

### shared_ptr 和 new 结合使用

### 智能指针和异常

### unique_ptr

### weak_ptr

## 动态数组

### new 和数组

### allocator 类

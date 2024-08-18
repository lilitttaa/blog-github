---
title: C++ Primer 19.特殊工具与技术
---

## 控制内存分配

### 重载 new 和 delete 运算符

- 当使用 new 表达式时实际上执行了三步操作：

  - 调用 operator new/ operator new[] 分配内存
  - 调用构造函数初始化对象或者对象数组
  - 返回对象的指针

- 使用 delete 表达式时实际上执行了两步操作：
  - 对对象或者对象数组执行析构函数
  - 调用 operator delete/ operator delete[] 释放内存

编译器在调用 new/delete 表达式时，按照下面顺序查找 operator new/delete 函数：

- 在类及其基类中查找（如果是类的成员函数）
- 在全局作用域查找自定义的 operator new/delete 函数
- 如果没有找到，编译器会调用标准库中的 operator new/delete 函数

使用::new/delete 可以忽略类内 operator new/delete，直接调用全局作用域中的 operator new/delete 函数。

operator new/delete 函数接口：

```cpp
void *operator new(size_t size);
void *operator new[](size_t size);
void operator delete(void *rawMemory) noexcept;
void operator delete[](void *rawMemory) noexcept;


// 下面版本不抛出异常，其中nothrow_t是定义在头文件new中的一个空类
void *operator new(size_t size, const std::nothrow_t&) noexcept;
void *operator new[](size_t size, const std::nothrow_t&) noexcept;
void operator delete(void *rawMemory, const std::nothrow_t&) noexcept;
void operator delete[](void *rawMemory, const std::nothrow_t&) noexcept;
```

自定义 new/delete 运算符时：

- 定义的位置：
  - 可以在全局作用域中定义
  - 也可以将它们定义为成员函数
- 将上述运算符函数定义成类的成员时，它们是隐式静态的
- operator new 和 operator new[]第一个参数是 size_t 类型，且不能提供默认实参
- operator new[]的参数表示存储数组的所有元素所需的空间
- 自定义 operator new 可以提供额外的形参，调用的时候需要使用 new 的定位形式，`new(p) T(args...)`把额外的形参传递给 operator new
- 其中 void _operator new(size_t, void _)不允许进行重载
- 自定义 operator delete/delete[]时，可以包含另一个 size_t 的形参，表示第一个对象所指向的大小，该形参可用于删除继承体系中的对象
- 提供新的 operator new 函数和 operator delete 函数的目的在于改变内存分配的方式，但是不管怎样，我们都不能改变 new 运算符和 delete 运算符的基本含义。

```cpp
void *operator new(size_t size) {
	if (void *mem = malloc(size)) {
		return mem;
	} else {
		throw std::bad_alloc();
	}
}
void operator delete(void *mem) noexcept {
	free(mem);
}
```

### 定位 new 运算符

- 使用 new 的定位 new （placement new）形式用来构造对象

placement new 的形式如下：

```cpp
new (place_address) type
new (place_address) type (initializers)
new (place_address) type [size]
new (place_address) type [size] {initializers}

void* p = operator new(sizeof(int));
int* pi = new(p) int(0);
```

- 当仅通过一个地址值调用时，定位 new 使用 operator new(size_t, void\*)，这是一个无法自定义的 operator new 版本。它实际上不分配内存，只是简单地返回指针实参，然后由 new 表达式负责在指定的地址初始化对象以完成整个工作。
- placement new 跟 allocator 的 construct 成员类似，但是传给 construct 的指针来自 allocator 分配的空间，但传给 placement new 的指针不必是 operator new 返回的指针，甚至可以不是动态分配的内存。

调用析构函数

- 可以手动调用析构函数
- 调用析构函数会销毁对象，但是不会释放内存

```cpp
string *ps = new string;
ps->~string();
```

## 运行时类型识别

- RTTI（运行时类型识别）由两个运算符构成：
  - typeid 运算符：返回表达式的类型
  - dynamic_cast 运算符：用于将基类的指针或引用安全地转换成派生类的指针或引用
- RTTI 适用于：想使用基类对象的指针或引用执行某个派生类操作并且该操作不是虚函数。
- 使用 RTTI 必须要加倍小心。在可能的情况下，最好定义虚函数而非直接接管类型管理的重任。

### dynamic_cast 运算符

dynamic_cast 的使用形式如下：

- e 要求是 type 的公有派生类、公有基类或者就是 type 类型本身
- 如果符合，类型转换成功，否则返回 nullptr（指针类型）或者抛出 bad_cast 异常（引用类型）

```cpp
dynamic_cast<type*>(e) // 指针
dynamic_cast<type&>(e) // 左值
dynamic_cast<type&&>(e) // 不能是左值
```

```cpp
// 指针
if (Derived *dp = dynamic_cast<Derived*>(bp)) {
	// 使用 Derived 对象的成员
} else {
	// 使用 Base 对象的成员
}

// 引用
try {
	// 如果 bp 指向的是 Derived 对象，则转换成功
	Derived &dr = dynamic_cast<Derived&>(bp);
	// 使用 Derived 对象的成员
} catch (bad_cast) {
	// bp 指向的是 Base 对象
}
```

- 对一个空指针执行 dynamic cast，结果是所需类型的空指针

### typeid 运算符

- typeid 的使用方式为：`typeid(e)`，其中 e 可以是任意表达式或者类型名
- 返回 type_info 或者其公有派生类对象的常量引用
- type_info 定义在头文件 typeinfo 中
- typeid 运算符可以作用于任意类型的表达式：
  - 和往常一样，顶层 const 会被忽略
  - 如果 e 是引用，则 typeid 返回引用所引对象的类型
  - typeid 作用与数组和函数时，返回数组元素的类型和函数类型而不是指针类型
  - 如果 e 不属于类类型或者是一个不包含任何虚函数的类时，typeid 运算符指示的是运算对象的静态类型。而当运算对象是定义了至少一个虚函数的类的左值时，typeid 的结果直到运行时才会求得。

通常使用 typeid 比较两个表达式的类型是否相同：

- 当 typeid 作用与指针时，返回的是指针本身的静态类型
- 如果 p 是一个空指针，则 typeid (\*p)将抛出一个名为 bad typeid 的异常

```cpp
Derived *dp = new Derived;
Base *bp = dp;
if (typeid(*bp) == typeid(*dp)) {
	// *bp 和 *dp 的类型相同
}
if (typeid(*bp) == typeid(Derived)) {
	// *bp 的类型是 Derived
}

if (typeid(bp) == typeid(Derived)) { // false，指针类型
}
```

### 使用 RTTI

例如，想要通过 RTTI 实现具有继承关系的类实现相等操作，要求：

- 两个对象类型相同
- 对应的数据成员相等

```cpp
class Base {
    friend bool operator==(const Base&, const Base&);
public:
    // ...
protected:
    virtual bool equal(const Base&) const;
};

class Derived: public Base {
public:
    // ...
protected:
    bool equal(const Base&) const;
};

bool operator==(const Base &lhs, const Base &rhs) {
    return typeid(lhs) == typeid(rhs) && lhs.equal(rhs);
}

bool Base::equal(const Base &rhs) const {
    // 执行比较操作
}

bool Derived::equal(const Base &rhs) const {
    auto r = dynamic_cast<const Derived&>(rhs);
    // 继续执行比较操作
}
```

### type_info 类型

- type_info 类型定义在头文件 typeinfo 中
- type_info 的具体定义因编译器而异
- type_info 一般是作为一个基类出现，它还提供一个公有的虚析构函数。当编译器希望提供额外的类型信息时，通常在 type_info 的派生类中完成。
- 没有默认构造函数，其拷贝和移动构造函数以及赋值运算符都被定义为删除的。创建 type_info 对象的唯一途径是使用 typeid 运算符

type_info 支持的操作：

```cpp
t1 == t2 // 比较两个对象是否表示同一种类型
t1 != t2 // 比较两个对象是否表示不同的类型
t.name() // 返回类型的 C 风格字符串，表示类的可打印类型，生成方式因系统而异
t1.before(t2) // 比较两个对象的类型，如果 t1 在 t2 之前，则返回 true，采取的顺序因编译器而异
```

## 枚举类型

- 和类一样，每个枚举类型定义了一种新的类型。枚举属于字面值常量类型。
- C++包含两种枚举：
  - 限定作用域的
  - 不限定作用域

## 类成员指针

### 数据成员指针

### 成员函数指针

### 将成员函数作为可调用对象

## 嵌套类

## union：一种节省空间的类

## 局部类

## 固有的不可移植的特性

### 位域

### volatile 限定符

### 链接指示 extern "C"

```

```

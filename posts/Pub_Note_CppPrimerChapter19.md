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
- 默认情况下，枚举值从 О 开始，依次加 1。
- 如果没有提供值，当前枚举成员的值等于之前枚举成员的值加 1

```cpp
enum class open_modes { input, output, append };
open_modes om = open_modes::input;

enum color { red, yellow, green };
color col = red;

enum { floatPrec = 6, doublePrec = 10 };
```

- 每个枚举成员本身就是一条常量表达式，可以在任何需要常量表达式的地方使用枚举成员，例如：
  - switch 语句
  - case 标签
  - 非类型模板参数

```cpp
enum class open_modes { input, output, append };
constexpr open_modes om = open_modes::input;
switch (om) {
case open_modes::input:
	// ...
	break;
}

template <open_modes om>
class MyClass {
	// ...
};
```

类型转换：

- 不限作用域的枚举类型可以隐式转换为整型
- 限定作用域的枚举类型不会隐式转换为整型

```cpp
enum class open_modes { input, output, append };
enum color { red, yellow, green };

int i = open_modes::input; // 错误，不能隐式转换
int j = color::red; // 正确，可以隐式转换
```

可以为 enum 指定类型：

- 默认情况下限定作用域的 enum 成员类型是 int
- 不限定作用域的枚举类型来说，其枚举成员不存在默认类型（因编译器而异），只知道成员的潜在类型足够大，肯定能够容纳枚举值。
- 如果指定了类型，如果枚举值超出了指定类型的范围，编译器会报错
- enum 的前置声明：
  - 不限作用域的必须指定成员类型
  - 限定作用域的可以使用默认 int 类型
- 声明要保证：
  - 是限定作用域还是非限定作用域要一致
  - 成员大小要一致

```cpp
enum intValues : unsigned long long {
	// ...
};

enum intValues : unsigned long long; // 不限定作用域的枚举类型前置声明
enum class open_modes;// 限定作用域的枚举类型前置声明
```

- 要想初始化一个 enum 对象，必须使用该 enum 类型的对象或者枚举成员，而不能是整型
- 但是可以将一个不限定作用域的枚举类型的对象或枚举成员传给整型形参，enum 提升为更大的整型
- 枚举成员永远不会提升成 unsigned char，即使枚举值可以用 unsigned char 存储也是如此。

```cpp
void newf(unsigned char);
void newf(int);
unsigned char uc = VIRTUAL;
newf(uc); // 调用 newf(unsigned char)
newf(VIRTUAL); // 调用 newf(int)
```

## 类成员指针

### 数据成员指针

### 成员函数指针

### 将成员函数作为可调用对象

## 嵌套类

- 定义在另外一个类内部的类称为嵌套类
- 嵌套类是一个独立的类，与外层类基本没有什么关系
- 外层类对嵌套类的成员没有特殊的访问权限，同样，嵌套类对外层类的成员也没有特殊的访问权限。
- 嵌套类的名字在外层类作用域之外不可见。

## union：一种节省空间的类

## 局部类

- 类可以定义在某个函数的内部，我们称这样的类为局部类
- 局部类被封装在函数内部
- 局部类定义的类型只在定义它的作用域内可见。
- 局部类的所有成员（包括函数在内）都必须完整定义在类的内部
- 在局部类中也不允许声明静态数据成员
- 局部类：
  - 能访问外层作用域定义的类型名、静态变量以及枚举成员
  - 不能访问则该函数的普通局部变量

```cpp
int a, val;
void foo(int val) {
	static int si;
	enum Loc { a = 1024, b = 2048 };
	struct Bar {
		Loc locVal;
		int barVal;
		void footBar(Loc l = a) {
			barVal = val; // 错误，局部类不能访问函数的局部变量
			barVal = ::val; // 访问全局变量
			barVal = si; // 访问静态局部变量
			locVal = b; // 访问枚举成员
		}
	};
}
```

- 外层函数对局部类的私有成员没有任何访问特权，不过局部类可以将外层函数声明为友元
- 更常见的情况是局部类将其成员声明成公有的，函数直接访问

还可以在局部类中嵌套类：

- 局部类内的嵌套类也是一个局部类，必须遵循局部类的各种规定。嵌套类的所有成员都必须定义在嵌套类内部。

```cpp
void foo() {
    class Bar {
    public:
        class Nested;
    };

    class Bar::Nested {
        // ...
    };
}
```

## 固有的不可移植的特性

### 位域

### volatile 限定符

### 链接指示 extern "C"

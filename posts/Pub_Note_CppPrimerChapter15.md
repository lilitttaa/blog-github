---
title: C++ Primer 15.面向对象程序设计
---

## OOP 概述

OOP 的核心是：

- 数据抽象：类的接口与实现分离
- 继承：定义相似关系，并对相似关系建模
- 动态绑定：一定程度上忽略对象的区别，以统一的方式使用对象

在 C++中，基类分别对待两类函数：

- 如果希望派生类各自定义适合自身的版本，基类就将这些函数声明成虚函数
- 反之，如果希望派生类直接使用基类的版本，基类就将这些函数声明成非虚函数

```cpp
class Quote
{
public:
	std::string isbn() const; // 非虚函数
	virtual double net_price(std::size_t n) const; // 虚函数
};

class Bulk_quote : public Quote
{
public:
	double net_price(std::size_t n) const override; // 覆盖基类的虚函数
};
```

- 动态绑定：在运行时选择调用哪个版本的函数。
- 当我们使用基类的指针或引用调用虚函数时将发生动态绑定。

```cpp

double print_total(std::ostream &os, const Quote &item, std::size_t n)
{
	double ret = item.net_price(n);
	os << "ISBN: " << item.isbn() << " # sold: " << n << " total due: " << ret << std::endl;
	return ret;
}

Quote base("0-201-82470-1", 50);
Bulk_quote derived("0-201-82470-1", 50, 5, .19);
print_total(std::cout, base, 10); // 调用 Quote::net_price
print_total(std::cout, derived, 10); // 调用 Bulk_quote::net_price
```

## 定义基类和派生类

### 定义基类

- 基类通常都应该定义一全虚析构函数，即使该函数不执行任何实际操作。
- 任何构造函数之外的非静态函数都可以是虚函数。
- virtual 只能出现在类内部的声明语句之前而不能用于类外部的函数定义。
- 如果基类把一个函数声明成虚函数，则该函数在派生类中隐式地也是虚函数。
- 派生类可以访问 public、protected 成员，但不能访问 private 成员。

```cpp
class Quote
{
public:
	Quote() = default;
	Quote(const std::string &book, double sales_price) : bookNo(book), price(sales_price) {}
	std::string isbn() const { return bookNo; }
	virtual double net_price(std::size_t n) const { return n * price; } // 虚函数
	virtual ~Quote() = default; // 虚析构函数
private:
	std::string bookNo;
protected:
	double price = 0.0; // 保护成员
};
```

### 定义派生类

- 派生类通过派生列表指明其基类。
- 三种继承方式：
  - public
  - protected
  - private
- 如果派生类没有覆盖其基类中的某个虚函数，则该虚函数的行为类似于其他普通成员，派生类会直接继承其在基类中的版本
- 派生类可以在它覆盖的函数前使用 virtual 关键字，但不是非得这么做。
- 可以使用 override 显式地注明覆盖了某个继承的虚函数，需要在形参列表后（const 和&后）写上 override。

```cpp
class Bulk_quote : public Quote // public 继承
{
public:
	Bulk_quote() = default;
	Bulk_quote(const std::string &book, double sales_price, std::size_t qty, double disc) : Quote(book, sales_price), min_qty(qty), discount(disc) {}
	double net_price(std::size_t n) const override; // 覆盖基类的虚函数
private:
	std::size_t min_qty = 0;
	double discount = 0.0;
};
```

- 一个派生类对象包含多个组成部分：
  - 派生类自己定义的（非静态）成员的子对象
  - 该派生类继承的基类对应的子对象（可以是多个）
- C++标准没有规定派生类的对象的内存分布，但是认为它包含这两个部分（实际上基类部分跟派生类部分不一定是连续存储的）：
  ![Alt text](image.png)
- 因为派生类包含基类子对象，所以可以进行类型转换
- 编译器会隐式的执行派生类到基类的类型转换（只对指针或引用有效）

```cpp
Bulk_quote bulk;
Quote *itemP = &bulk; // 派生类到基类的类型转换
Quote &itemR = bulk; // 派生类到基类的类型转换
```

- 派生类的构造函数委托基类的构造函数完成基类部分的初始化
- 如果没有显式地初始化基类部分，则会使用默认构造函数初始化基类部分
- 首先初始化基类的部分，,然后按照声明的顺序依次初始化派生类的成员。
- 派生类应该遵循基类的接口，通过调用基类的构造函数来初始化基类成员，而不是通过赋值基类成员的方式。

```cpp
Bulk_quote::Bulk_quote(const std::string &book, double sales_price, std::size_t qty, double disc) : Quote(book, sales_price), min_qty(qty), discount(disc) {}
```

- 不论从基类中派生出来多少个派生类，对于每个静态成员来说都只存在唯一的实例。
- 静态成员遵循通用的访问控制规则，如果基类中的成员是 private 的，则派生类无权访问它。

```cpp
class Base
{
public:
	static void statmem();
};
class Derived : public Base
{
	void f(const Derived&);
};

void Derived::f(const Derived &derived_obj)
{
	Base::statmem(); // 正确：通过 Base 调用
	Derived::statmem(); // 正确：Dervived继承自Base
	derived_obj.statmem(); // 正确：通过 Derived 对象调用
	statmem(); // 正确：通过this指针调用
}
```

- 派生类的声明不要包括派生列表。
- 如果某个类要作为基类，则它必须是完整的类型，也就是说必须得被定义。
- 使用 final 关键字可以阻止其他类继承自该类。

```cpp
// 声明
class Bulk_quote : public Quote; // 错误
class Bulk_quote; // 正确

class NoDerived final { /* ... */ }; // 不能被继承
class Last final: Base { /* ... */ }; // Last 不能被继承
```

### 类型转换与继承

- 智能指针类也支持派生类向基类的类型转换。
- 动态类型与静态类型：
  - 表达式的静态类型在编译时总是已知的，它是变量声明时的类型或表达式生成的类型。
  - 动态类型则是变量或表达式表示的内存中的对象的类型，直到运行时才能知道。
  - 例如：一个 Qutoe& item 的静态类型是 Quote&，但是它的动态类型可能是 Bulk_quote&。
  - 只有引用和指针动态类型和静态类型可能不一致。
- 不存在从基类向派生类的隐式类型转换。
- 编译器只能通过静态类型进行判断，因此无法在编译时确定某个特定的转换在运行时是否是安全的。
- 如果基类中有虚函数，可以使用 dynamic_cast 请求运行时类型转换。
- 如果已知基类到派生类的转换是安全的，可以使用 static_cast 进行强制类型转换（强制覆盖编译器的类型检查）。

```cpp
Quote item;
Bulk_quote bulk;
Quote *p = &bulk; // 正确：派生类到基类的类型转换
Bulk_quote *dp = &item; // 错误：基类到派生类的类型转换
Bulk_quote *dp2 = p; // 错误：基类到派生类的类型转换
Bulk_quote &dr = item; // 错误：基类到派生类的类型转换
```

- 使用引用的移动和拷贝操作可以传递派生类对象
- 只有该派生类对象中的基类部分会被拷贝、移动或赋值，它的派生类部分将被忽略掉

```cpp
Bulk_quote bulk;
Quote base(bulk); // 正确：拷贝构造函数
base = bulk; // 正确：拷贝赋值运算符
```

## 虚函数

- 普通的函数如果没有用到可以只声明不定义，但所有的虚函数都要有定义而不只是声明（编译器也不知道运行时调用哪个版本的函数）。
- OOP 的核心思想是多态性(polymorphism)。我们把具有继承关系的多个类型称为多态类型，因为我们能使用这些类型的“多种形式”而无须在意它们的差异。
- 一旦某个函数被声明成虚函数，则在所有派生类中它都是虚函数（即便在派生类中没有被声明为 virtual）。
- 派生类覆盖的虚函数：
  - 参数必须保持完全一致
  - 返回值通常也要保持一致，除非返回类型是类本身的指针或引用
- 虚函数自动继续函数匹配，但是可能匹配不上，使用 override 可以让编译器报错。
- 加上 final 关键字可以阻止派生类覆盖虚函数，final 和 override 一样出现在 const 和&之后。

```cpp
class Base
{
public:
	virtual Base* get_pointer() { return this; }
};

class Derived : public Base
{
public:
	Derived* get_pointer() override { return this; } // 类本身类型指针，返回类型可以不同
};
```

```cpp
struct B{
	virtual void f1(int) const;
	virtual void f2();
	void f3();
};
struct D : B{
	void f1(int) const final; // 正确，避免后续派生类覆盖
	void f2(int) override; // 错误：没有与之匹配的基类函数
	void f3() override; // 错误：基类f3不是虚函数
	void f4() override; // 错误：没有与之匹配的基类函数
};
```

虚函数可以有默认实参，但是调用使用的默认实参由静态类型决定：

```cpp
struct Base
{
	virtual void foo(int i = 10);
};

struct Derived : Base
{
	void foo(int i = 20) override;
};

Derived d;
Base *pb = &d;
pb->foo(); // 调用 Base::foo，i = 10
```

- 使用作用域限定符可以避开虚函数的动态绑定。
- 尤其是在派生类内，使用作用域限定符可以调用基类的虚函数，避免递归调用。

```cpp
pb->Base::foo(); // 调用 Base::foo，不考虑pb的实际类型
```

## 抽象基类

- 某些基类的虚函数不具备实际含义，可以定义为纯虚函数。
- 纯虚函数不需要定义，其实也可以定义，但是只能写在类外部。
- 包含纯虚函数的类是抽象基类，负责定义接口，不能创建该类的对象。
- 派生类的构造函数只初始化它的直接基类。

```cpp
class Disc_quote : public Quote
{
public:
	Disc_quote() = default;
	Disc_quote(const std::string &book, double price, std::size_t qty, double disc) : Quote(book, price), quantity(qty), discount(disc) {}
	double net_price(std::size_t) const = 0; // 纯虚函数
protected:
	std::size_t quantity = 0;
	double discount = 0.0;
};
```

## 访问控制与继承

## 继承中的类作用域

## 构造函数与拷贝控制

## 容器与继承

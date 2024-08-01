---
title: C++ Primer 7.类
---

## 定义抽象数据类型

- 定义在类内部的函数是隐式的 inline 函数
- this 指针是一个常量指针，不允许改变指向的对象
- const 成员函数，可以看作是修饰 this 指针的底层 const，因此 this 这时候是一个指向常量的常量指针

```cpp
class Sales_data {
public:
	std::string isbn() const { return bookNo; } // 隐式内联，const成员函数
	Sales_data& combine(const Sales_data&);
	double avg_price() const;
private:
	std::string bookNo;
	unsigned units_sold = 0;
	double revenue = 0.0;
};

Sales_data::Sales_data& combine(const Sales_data& rhs) {...}
double Sales_data::avg_price() const {...} //类外定义也要写const

Sales_data total;
total.isbn(); // 调用isbn函数 可以看作Sales_data::isbn(&total)
```

### 与类相关的非成员函数

- 通常把函数的声明和定义分离开来
- 一般来说，如果非成员函数是类接口的组成部分，则这些函数的声明应该与类在同一个头文件内。

```cpp
Sales_data add(const Sales_data&, const Sales_data&);
```

### 构造函数

- 构造函数的任务是初始化类对象的数据成员，无论何时只要类的对象被创建，就会执行构造函数。
- 构造函数没有返回值
- 构造函数不能被声明为 const

```cpp
class Sales_data {
public:
	Sales_data() = default; // 默认构造函数
	Sales_data() const; // 错误，构造函数不能是const的
	Sales_data(const std::string &s) : bookNo(s) { } // 构造函数
	Sales_data(const std::string &s, unsigned n, double p) : bookNo(s), units_sold(n), revenue(p*n) { } // 构造函数
	Sales_data(std::istream &); // 构造函数
	...
}
```

- 默认构造函数无需任何实参
- 如果没有显示定义构造函数，编译器会自动生成一个合成默认构造函数。
  - 如果存在类内初始值，使用类内初始值初始化成员
  - 否则，执行默认初始化（内置类型通常是未定义）
- 除了非常简单的类，尽量不要依赖于合成默认构造函数：
  - 如果定义了其他构造函数，编译器不会再生成默认构造函数，这时候类就没有默认构造函数了
  - 对于一些内置类型、数组、指针来说默认初始化是未定义的
  - 如果类的成员没有默认构造函数，那么类的默认构造函数就无法初始化这些成员
- 没有被初始化列表覆盖的成员同样会按照类内初始化->默认初始化的顺序初始化

```cpp
class Sales_data {
	int a = 0;
	int b;
}
Sales_data item; // a = 0, b = 未定义

class A{
	A(int){} // 隐式删除默认构造函数
}
class B{
	B() = default;
	A a; // 错误，A没有默认构造函数
	int* p; // 未定义
}
class C{
	C() : a(0) {} // a = 0，b = 未定义，c = 0
	int a;
	int b;
	int c = 0;
}
```

## 访问控制与封装

- public：在整个程序内可访问
- private：只能被类的成员函数访问
- class 和 struct 的唯一区别是默认访问权限
  - class 默认是 private
  - struct 默认是 public

```cpp
class A{
	int a; // 默认是private
public:
	int b;
private:
	int c;
}
struct B{
	int a; // 默认是public
public:
	int b;
private:
	int c;
}
A a;
a.a; // 错误
a.b; // 正确
```

- 友元函数：可以访问类的私有成员
- 一般来说,最好在类定义开始或结束前的位置集中声明友元。

```cpp
class Sales_data {
	friend Sales_data add(const Sales_data&, const Sales_data&);// 只是友元函数声明，不是真的函数声明
	friend class A;
private:
	std::string bookNo;
	unsigned units_sold = 0;
	double revenue = 0.0;
}

Sales_data add(const Sales_data& a, const Sales_data& b) {
	Sales_data sum;
	sum.units_sold = a.units_sold + b.units_sold; // 可以访问私有成员
	return sum;
}
class A{
public:
	void print(const Sales_data& a) {
		std::cout << a.bookNo << std::endl; // 可以访问私有成员
	}
}
```

封装有两个重要的优点:

- 确保用户代码不会无意间破坏封装对象的状态。
- 被封装的类的具体实现细节可以随时改变，而无须调整用户级别的代码。

## 类的其他特性

## 类的作用域

## 构造函数再探

## 类的静态成员

---
title: C++ Primer 18.用于大型程序的工具
---

## 异常处理

- 异常使得我们能够将问题的检测与解决过程分离开
- 程序的一部分负责检测问题，然后将解决该问题的任务传递给程序的另一部分。检测环节无须知道问题处理模块的所有细节，反之亦然。

### 抛出异常

- 通过抛出一条表达式来引发异常
- 沿着调用链向上进行匹配，找到最近的处理代码，这个过程被称为栈展开
- 程序的控制权从 throw 转移到与之匹配的 catch 模块：
  - 可能是同一个函数中的局部 catch
  - 也可能是调用链中的某个函数的 catch
  - 如果没有找到匹配的 catch，程序执行 terminate 函数，终止程序
- throw 后面的语句将不再被执行
- 直到找到处理代码，链条上创建的局部对象将被调用析构函数销毁，因此析构函数不应该抛出异常

异常对象：

- 编译器使用异常抛出表达式来对异常对象进行拷贝初始化
- 当抛出一条表达式时，该表达式的静态编译时类型决定了异常对象的类型
- 如果 throw 表达式解引用一个基类指针，而该指针实际指向的是派生类对象，则抛出的对象将被切掉一部分，只有基类部分被抛出。
- 抛出指针要求在任何对应的处理代码存在的地方，指针所指的对象都必须存在。

```cpp
void f()
{
	try
	{
		throw runtime_error("error");
	}
	catch (runtime_error err)
	{
		cout << err.what() << endl;
	}
}

class Quote
{
public:
	virtual void print() const { cout << "Quote" << endl; }
};

class Bulk_quote : public Quote
{
public:
	void print() const override { cout << "Bulk_quote" << endl; }
};

void f2(){
	Quote *q = new Bulk_quote;
	try
	{
		throw *q;
	}
	catch (Quote q)
	{
		cout << q.print() << endl; // Quote
	}
}
```

### 捕获异常

- catch 子句中进行了异常声明，类似于函数形参
  ```cpp
  catch (exception e)
  {
  	cout << e.what() << endl;
  }
  ```
- 如果 catch 无须访问抛出的表达式的话，我们可以忽略捕获形参的名字。
- 异常声明的类型必须是完全类型，它可以是左值引用，但不能是右值引用。
- catch 声明的类型可以是值也可以是引用，同参数传递一样，值传递不会改变原对象，引用传递会改变原对象。
- catch 声明同样支持基类：
  - 如果是值传递，会切掉派生类部分，只保留基类部分。
  - 如果是引用传递，不会切掉派生类部分。
- 通常情况下，如果 catch 接受的异常与某个继承体系有关，则最好将该 catch 的参数定义成引用类型。

查找匹配的处理代码：

- catch 语句是按照其出现的顺序逐一进行匹配的，所以越是专门的 catch 越应该放在整个 catch 列表的前端
  ```cpp
  try
  {
  	// ...
  }
  catch (runtime_error e)
  {
  	// ...
  }
  catch (exception e)
  {
  	// ...
  }
  ```
- 与实参和形参的匹配规则相比，异常和 catch 异常声明的匹配规则受到更多限制。绝大多数类型转换都不被允许，必须是精确匹配：
  - 允许从非常量到常量的类型转换
  - 允许从派生类向基类的类型转换
  - 数组和函数类型被转换成对应指针类型

重新抛出：

- 如果当前的 catch 不足以完全处理异常，可以使用 throw 再次抛出异常
  ```cpp
  catch (my_error &eObj) {
  eObj.status = errCodes::serverErr;
  throw; // 重新抛出异常
  } catch (other_error eObj) {
  eObj.status = errCodes::badErr;
  throw;
  }
  ```
  捕获所有异常：

```cpp
try
{
	// ...
}
catch (...) // 使用省略号表示捕获所有异常
{
	cout << "catch all" << endl;
}
```

### 函数 try 语句块与构造函数

- 构造函数在进入函数体之前先执行初始值列表，要想处理构造函数初始值抛出的异常，必须将构造函数写成函数 try 语句块（也称为函数测试块）的形式。

```cpp
template <typename T>
Blob<T>::Blob(std::initializer_list<T> il) try:
    data(std::make_shared<std::vector<T>>(il)) {
        /* 空函数体 */
    } catch (const std::bad_alloc &e) {
        handle_out_of_memory(e);
    }
```

- 在初始化构造函数的参数时也可能发生异常，则该异常属于调用表达式的一部分，并将在调用者所在的上下文中处理。

### noexcept 说明符

- 知道函数不会抛出异常有助于简化调用该函数的代码
- 如果编译器确认函数不会抛出异常，它就能执行某些特殊的优化操作
- C++11 新标准引入了 noexcept 说明符，用于指出函数不会抛出异常
  ```cpp
  void f() noexcept;
  ```
- noexcept：
  - 对一个函数来说，noexcept 说明要么出现在该函数的所有声明语句和定义语句中，要么一次也不出现
  - 说明应该在函数的尾置返回类型之前
  - 可以在函数指针的声明和定义中指定 noexcept
  - 在 typedef 或类型别名中不能出现 noexcept
  - 在成员函数中，noexcept 说明符需要跟在 const 及引用限定符之后，在 final、override、虚函数的=0 之前

```cpp
void f() noexcept;
void f() noexcept{
	// ...
}
auto f() noexcept -> void;
class A {
	void f() const noexcept;
	void f() & noexcept;
	void f() noexcept final;
	void f() noexcept override;
	virtual void f() noexcept = 0;
};
```

- 编译器并不会在编译时检查 noexcept 说明，一旦一个 noexcept 函数抛出了异常，程序就会调用 terminate 以确保遵守不在运行时抛出异常的承诺。
- 因此 noexcept 可以用在两种情况下：
  - 确认函数不会抛出异常
  - 根本不知道该如何处理异常

向后兼容：

```cpp
void recoup(int) noexcept;
void recoup(int) throw(); // 等价
```

异常说明的实参：

- noexcept 说明符接受一个可选的实参，该实参必须能转换为 bool 类型
  ```cpp
  void recoup(int) noexcept(true);  // 不会抛出异常
  void alloc(int) noexcept(false);  // 可能抛出异常
  ```

noexcept 运算符：

- noexcept 运算符常与异常说明实参一起使用
- noexcept 运算符是一个一元运算符
- 和 sizeof 类似，noexcept 也不会求其运算对象的值。
- 用于确定一个表达式是否会抛出异常

```cpp
void f() noexcept(noexcept(g()));  // f和g的异常说明一致，noexcept(g())表示g是否会抛出异常
```

异常说明与指针、虚函数和拷贝控制：

- 尽管 noexcept 说明符不属于函数类型的一部分，但是函数的异常说明仍然会影响函数的使用。
- 如果指针声明了不抛出异常，则该指针只能指向不抛出异常的函数；反之就能指向任何函数

  ```cpp
  void recoup(int) noexcept(true);
  void alloc(int) noexcept(false);

  void (*pf1)(int) noexcept = recoup;
  void (*pf2)(int) = recoup

  pf1 = alloc; // ERROR!
  pf2 = alloc;
  ```

- 如果一个虚函数承诺了它不会抛出异常，则后续派生出来的虚函数也必须做出同样的承诺。如果基类的虚函数允许抛出异常，则派生类对应函数既可以允许抛出异常，也可以不允许抛出异常

```cpp
class Base {
public:
	virtual double f1(double) noexcept;//不会抛出异常
	virtual int f2() noexcept (false);//可能抛出异常
	virtual void f3();//可能抛出异常
};
class Derived : public Base {
public:
	double f1(double); //错误:Base: :f1承诺不会抛出异常
	int f2()noexcept (false) ; //正确:与 Base: : f2的异常说明一致
	void f3()noexcept; //正确:Derived 的f3做了更严格的限定，这是允许的
};
```

- 当编译器合成拷贝控制成员时，同时也生成一个异常说明：
  - 如果对所有成员和基类的所有操作都承诺了不会抛出异常，则合成的成员是 noexcept 的。
  - 如果合成成员调用的任意一个函数可能抛出异常，则合成的成员是 noexcept(false)。
  - 如果定义了一个析构函数但是没有为它提供异常说明，则编译器将合成一个（与合成的析构函数异常说明一致）。

### 异常类层次

![Alt text](image.png)

- 类型 exception 仅仅定义了拷贝构造函数、拷贝赋值运算符、一个虚析构函数和一个名为 what 的虚成员。
- 其中 what 函数返回 c 风格字符串，并且确保不会抛出任何异常。
- 类 exception、bad_cast 和 bad_alloc 定义了默认构造函数。
- 类 runtime_error 和 logic_error 没有默认构造函数，但是有一个可以接受 C 风格字符串或者标准库 string 类型实参的构造函数，这些实参负责提供关于错误的更多信息。

定义自己的异常类：

```cpp
class isbn_mismatch: public std::logic_error {
public:
    explicit isbn_mismatch(const std::string &s): std::logic_error(s) {}
    isbn_mismatch(const std::string &s, const std::string &lhs, const std::string &rhs):
        std::logic_error(s), left(lhs), right(rhs) {}

    const std::string left, right;
};

Sales_data::Sales_data(std::istream &is) {
	// ...
	if (is) {
		throw isbn_mismatch("wrong data for Sales_data object", bookNo, s);
	}
}
Sales_data item1, item2,sum;
while (std::cin >> item1 >> item2) {
	try {
		sum = item1 + item2;
	} catch (const isbn_mismatch &e) {
		std::cerr << e.what() << ": left isbn(" << e.left << ") right isbn(" << e.right << ")" << std::endl;
	}
}
```

## 命名空间

### 命名空间定义

### 使用命名空间成员

### 命名空间与作用域

### 重载与命名空间

## 多重继承和虚继承

### 多重继承

### 类型转换与多个基类

### 多重继承下的类作用域

### 虚继承

### 构造函数与虚继承

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

### 函数 try 语句块与构造函数

### noexcept 说明符

### 异常类层次

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

---
title: C++ Primer 4.表达式
---

## 基础

### 基本概念

我们使用重载运算符时，其包括运算对象的类型和返回值的类型，都是由该运算符定义的。但是运算对象的个数、运算符的优先级和结合律都是无法改变的。

```cpp
class A{
public:
	int a;
	int b;
	A(int a):a(a){}
	A operator+(const A &b){
		return A(a*b.a); // 反过来使用乘法
	}
	A operator*(int b){
		return A(a+b); // 反过来使用加法
	}
};

ostream &operator<<(ostream &os, const A &a){
	os << a.a;
	return os;
}

A a(1);
A b(2);
cout << a + b * 3 << endl; // 5
```

当一个对象被用作右值的时候，用的是对象的值（内容），当对象被用作左值的时候，用的是对象的身份（在内存中的位置）。左值可以当作右值使用，但是右值不能当作左值使用。

```cpp
int a = 1; // a 是左值
int b = a; // a 是右值
int *p = &a; // a 是左值
int arr[] = {1,2,3};
int *p2 = arr; // arr 是右值
int v = *p2; // v 是左值
int v2 = arr[1]; // v2 是左值
int v3 = a++; // v3 是左值
decltype(*p2) v4; // int &
decltype(&p2) v5; // int **
```

对于含有多个运算符的复杂表达式来说，要想理解它的含义首先要理解运算符的优先级(precedence)、结合律(associativity)以及运算对象的求值顺序（order of evaluation）。

- 优先级决定不同级运算符的运算顺序
- 结合律决定相同级运算符的运算顺序
- 求值顺序是未定义的

```cpp
int f(){
	return 1;
}
int g(){
	return 2;
}
int h(){
	return 3;
}
int a = f() + g() * h() + 4; // 11

// 优先级决定了先乘后加
// 结合律决定了从左到右
// 求值顺序是未定义的，意味着这三个函数的调用顺序是未定义的
```

不过，C++中有以下运算符的求值顺序是确定的：

- &&
- ||
- ,
- ? :

```cpp
int f(){
	cout<<"f"<<endl;
	return 0;
}
int g(){
	cout<<"g"<<endl;
	return 1;
}
int h(){
	cout<<"h"<<endl;
	return 2;
}

int a = f() && g();  // f a=0
int b = g() && h(); // g h b=1
int c = f() || g(); // f g c=1
int e = g() || h(); // g   e=1
int m = (f(), g());  // f g   m=1
int n = f() ? g() : h(); // f h n=2
int l = g() ? f() : h(); // g f l=0

```

介于这种求值顺序的不确定性，我们应该避免在表达式中写入并读取同一个对象。

## 算术运算符

``` cpp
m + n; // 加法
m - n; // 减法
m * n; // 乘法
m / n; // 除法
m % n; // 取模
+m; // 一元取正
-m; // 一元取负
```

- 算术运算符都是左结合的
- 小整数类型的运算对象被提升成较大的整数类型，所有运算对象最终会转换成同一类型。
``` cpp
int i = 1024;
int k = -i; // -1024
bool b = true;
bool b2 = -b; // true b在运算前被转换成int类型
```


## 类型转换

- static_cast
- const_cast
  const_cast 只能改变底层 const，不能改变顶层 const

  ```cpp
  const char *p = "Daniel";
  char *p2 = const_cast<char*>(p);
  // *p = 'd'; // 错误
  *p2 = 'd'; // 正确
  ```

- reinterpret_cast
- dynamic_cast

## 运算符优先级表

![Alt text](image.png)
![Alt text](image-1.png)

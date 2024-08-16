---
title: C++ Primer 16.模板与泛型编程
---

## 定义模板

### 函数模板

- 类型参数前必须使用关键字 class 或 typename
- 非类型参数
  - 可以是一个整型，或是一个指向对象或函数类型的指针或（左值）引用。
  - 整型参数的实参必须是一个常量表达式。
  - 指针或引用非类型参数的实参必须具有静态的生存期，或者是 nullptr 和 0

```cpp
template <typename T>
int compare(const T &v1, const T &v2)
{
	if (v1 < v2) return -1;
	if (v2 < v1) return 1;
	return 0;
}
compare(1, 0); // 实例化为 compare<int>

template <unsigned N, unsigned M>
int compare(const char (&p1)[N], const char (&p2)[M])
{
	return strcmp(p1, p2);
}

compare("hi", "mom"); // 实例化为 compare<3, 4>
```

函数模板可以声明为 inline 和 constexpr，放在模板参数列表之后。

```cpp
template<typename T> inline T min(const T&, const T&);
template<typename T> constexpr T max(const T&, const T&);
```

模板程序应该尽量减少对实参类型的要求，例如：

- 常量引用参数比值参数更通用，这样就可以接受不支持拷贝的类型。
- 模板中只是用<运算符，而不是同时使用多种比较运算符。

模板编译：

- 通常，当调用一个函数时，编译器只需要掌握函数的声明。
- 类似的，当使用一个类类型的对象时，类定义必须是可用的，但成员函数的定义不必已经出现。
- 编译器遇到模板定义时，并不生成代码
- 只有实例化时，编译器才会生成代码
- 为了生成实例化版本，编译器需要掌握模板的定义，因此头文件中既包含模板的声明，也包含定义。

模板的大多数编译错误在实例化时才会报告：

- 第一阶段：编译模板本身，检查模板的语法，这个阶段一般发现的错误比较少。
- 第二阶段：模板使用，检查实参数目、参数类型匹配等，同样发现的错误比较少。
- 第三阶段：实例化
  - 这个阶段才能真正发现类型相关错误
  - 例如：实例化后发现类型不支持<运算符
  - 这类错误可能在链接的时候才会报告。

保证传递给模板的实参支持模板所要求的操作，以及这些操作在模板中能正确工作，是调用者的责任。

### 类模板

- 与函数模板不同，对于类模板来说，编译器不能为类模板推断模板参数类型。
- 为了使用类模板，必须在类模板名后面的尖括号中提供额外信息。
- 类模板的每个实例都形成一个独立的类。
- 例如：Blob<string>与任何其他 Blob 类型都没有关联，也不会对任何其他 B1ob 类型的成员有特殊访问权限。

```cpp
template <typename T> class Blob {
public:
    typedef T value_type;
    typedef typename std::vector<T>::size_type size_type; //typename用于指出这是一个类型
    Blob();
    Blob(std::initializer_list<T> il);
    size_type size() const { return data->size(); }
    bool empty() const { return data->empty(); }
    void push_back(const T &t) { data->push_back(t); }
    void pop_back();
    T& back();
    T& operator[](size_type i);
private:
    std::shared_ptr<std::vector<T>> data; // shared_ptr指向保存类型为T的对象的vector实例
    void check(size_type i, const std::string &msg) const;
};
Blob<int> ia; // Blob<int>
Blob<string> sa; // Blob<string>
```

类模板的成员函数：

- 可以在类模板内部或外部定义成员函数
- 且定义在类模板内的成员函数被隐式声明为内联函数
- 模板参数列表与类模板参数列表保持一致

```cpp
template <typename T>
void Blob<T>::check(size_type i, const std::string &msg) const
{
	if (i >= data->size())
		throw std::out_of_range(msg);
}
```

类模板成员函数的实例化：

- 默认情况下，对于一个实例化了的类模板，其成员只有在使用时才被实例化。
- 如果一个成员函数没有被使用，则它不会被实例化。
- 因此即使某类型不能符合某个成员函数的要求，也能使用它实例化类模板。

```cpp
Blob<int> squares = {0, 1, 2, 3, 4};
for (size_t i = 0; i != squares.size(); ++i) // 实例化 Blob<int>::size()
	squares[i] = i * i; // 实例化 Blob<int>::operator[]
```

类代码内简化模板类名：

- 在类模板自己的作用域中，我们可以直接使用模板名而不提供实参

```cpp
template<typename T> class BlobPtr{
	...
	BlobPtr& operator++(); // 使用BlobPtr而不是BlobPtr<T>
}

template<typename T> BlobPtr<T>& BlobPtr<T>::operator++() // 模板外必须写做BlobPtr<T>
{
	BlobPtr ret = *this; // 模板类作用域内可以省略<T>
	++*this;
	return ret;
}
```

类模板与友元：

- 如果类模板包含非模板友元，则友元被授权可以访问所有模板实例。
- 如果友元自身是模板，类可以授权给所有友元模板实例，也可以只授权给特定实例。

一对一友元关系：

```cpp
template <typename> class BlobPtr; // 声明友元前需要的前向声明
template <typename> class Blob;
template <typename T> bool operator==(const Blob<T>&, const Blob<T>&);

template <typename T> class Blob {
    friend class BlobPtr<T>; // 相同实例化的BlobPtr才是友元
    friend bool operator==<T> (const Blob<T>&, const Blob<T>&);
};
```

通用和特定关系的友元：

```cpp
template <typename T> class Pal; // 前向声明
class C {
    friend class Pal<C>;  // 用类C实例化的Pal是C的一个友元
    template <typename T> friend class Pal2;  // Pal2的所有实例都是C的友元，无需前向声明
};

template <typename T> class C2 {
    friend class Pal<T>;  // 相同实例化T的Pal类才是友元
    template <typename X> friend class Pal2;  // Pal2的所有实例都是友元
    friend class Pal3;  // 非模板类Pal3是C2所有实例的友元
};
```

模板参数自己成为友元：

```cpp
template <typename Type> class Bar {
	friend Type;  // Type的所有实例都是Bar的友元
};
```

模板类型别名：

- typedef 可以为实例化的模板类型定义别名
- using 可以为模板类型定义别名

```cpp
typedef Blob<string> StrBlob;

template <typename T> using twin = std::pair<T, T>;
twin<string> authors; // authors是一个pair<string, string>
```

类模板的静态成员：

- 类模板的每个实例都有一个独有的 static 对象

```cpp
tempate <typename T> class Foo {
public:
	static std::size_t count() { return ctr; }
private:
	static std::size_t ctr;
};

template <typename T> std::size_t Foo<T>::ctr = 0;

Foo<int> fi;
auto ct = fi.count(); // 正确
ct = Foo<int>::count(); // 正确
ct = Foo::count(); // 错误，必须指定模板实例
```

### 模板参数

- 与其他名字一样，模板参数会隐藏外层作用域的同名实体
- 但在模板内不能重用模板参数名

```cpp
typedef double A;
template <typename A, typename B> void f(A a, B b) {
	A tmp = a; // 类型为模板参数A而不是double
	double B;// 错误，重声明模板参数B
}
```

模板声明：

- 模板声明必须包含模板参数
- 声明中的模板参数名可以与定义中的不同
- 一个特定文件所需要的所有模板的声明通常一起放置在文件开始位置，出现于任何使用这些模板的代码之前。

```cpp
template <typename T> int compare(const T&, const T&);

template<typename Type> int compare(const Type&, const Type&){...}
```

模板类的类型成员：

- 对于模板类来说使用 T::mem 时，无法推断这是使用类型成员还是 static 成员
- 因此，必须使用 typename 来指出这是一个类型成员
- 当我们希望通知编译器一个名字表示类型时，必须使用关键字 typename,而不能使用 class。

```cpp
template <typename T> class Foo {
public:
	typename T::size_type count() { return 0; }
};
```

默认模板实参：

- 与函数的默认实参一样，对于一个模板参数，只有当它右侧的所有参数都有默认实参时，它才可以有默认实参。

```cpp
template <typename T, typename F = less<T>>
int compare(const T &v1, const T &v2, F f = F()) {
    if (f(v1, v2)) return -1;
    if (f(v1, v2)) return 1;
    return 0;
}

compare(0, 42); // 使用默认的比较函数
compare(0, 42, greater<int>()); // 使用指定的比较函数
```

### 成员模板

- 类（普通类/类模板）可以包含本身是模板的成员函数，即成员模板
- 成员模板不能是虚函数

```cpp
class DebugDelete {
public:
	DebugDelete(std::ostream &s = std::cerr) : os(s) { }
	template <typename T> void operator()(T *p) const { //成员模板
		os << "deleting unique_ptr" << std::endl;
		delete p;
	}
private:
	std::ostream &os;
};

int *ip = new int;
DebugDelete()(ip); // 调用DebugDelete::operator()<int>(int*)
unique_ptr<int, DebugDelete> p(new int, DebugDelete()); // p将使用DebugDelete删除器
```

```cpp
template <typename T> class Blob {
public:
	template <typename It> Blob(It b, It e);
};

template<typename T>
template<typename It>
Blob<T>::Blob(It b, It e) : data(std::make_shared<std::vector<T>>(b, e)) { }

list<const char*> w = {"now", "is", "the", "time"};
Blob<string> sa(w.begin(), w.end());
```

### 控制实例化

- 模板在使用时才会被实例化，多个独立编译的源文件使用了相同的模板，每个文件中都会生成一个实例
- 在大系统中，这个额外的开销可能会非常严重
- 可以通过显示实例化来避免这个问题，形式如下：
  - `extern template declaration;` 实例化声明
  - `template declaration;` 实例化定义
  - 其中 declaration 是已经替换为实参的模板声明
  ```cpp
  extern template class Blob<string>; // 实例化声明
  template class Blob<string>; // 实例化定义
  ```
- 编译器遇到 extern 声明时，不会再当前文件中生成实例化代码
- extern 声明必须出现在任何使用该实例化的代码之前
- 对每个实例化声明，在程序中某个位置必须有其显式的实例化定义。
- 与类模板的普通实例化不同，实例化定义会实例化该类的所有成员。即使我们不使用某个成员，它也会被实例化。
- 因此，在一个类模板的实例化定义中,所用类型必须能用于模板的所有成员函数。

```cpp
// Application.cc
extern template class Blob<string>;
extern template int compare(const string&, const string&);
Blob<string> sa; // 不会生成Blob<string>的实例化
Blob<int> ia; // 会生成Blob<int>的实例化

// templateBuild.cc
template int compare(const string&, const string&);
template class Blob<string>;
```

### 效率与灵活

- shared_ptr 可以在运行时 reset 管理的指针，因此删除器也应该时运行时绑定的，删除器是一个指针或者封装类指针的类（function），` del ? del(p) : delete p;`
- 而 unique_ptr 的删除器是静态绑定的，中途不能改变，`del(p)`

```cpp
template<typename T>
class shared_ptr{
public:
	shared_ptr(T *p, void (*d)(T*) = nullptr) : ptr(p), del(d) { }
	~shared_ptr() { del ? del(ptr) : delete ptr; }
private:
	T *ptr;
	void (*del)(T*);
};

template<typename T, typename D>
class unique_ptr{
public:
	unique_ptr(T *p, D d = D()) : ptr(p), del(d) { }
	~unique_ptr() { del(ptr); }
private:
	T *ptr;
	D del;
};

shared_ptr<int> p(new int, DebugDelete()); // 运行时绑定的删除器
unique_ptr<int, DebugDelete> p(new int, DebugDelete()); // 静态绑定的删除器
```

## 模板实参推断

### 类型转换与模板类型参数

- 对于函数模板，编译器利用函数实参来确定模板参数，这个过程称为模板实参推断
- 与非模板函数一样，模板实参推断的过程中也会发生自动的类型转换，只不过会有所限制。

  通常的函数调用中实参类型转换规则有以下几种：

- const 转换
- 数组或函数指针转换
- 算术类型转换
- 派生类向基类的转换
- 用户定义的类型转换

而其中，模板实参推断只会发生以下几种：

- const 转换：将非 const 的引用和指针转换为 const 引用和指针
- 数组或函数指针转换：如果函数形参不是引用类型，将数组或函数类型的实参转换为指针类型

```cpp
template <typename T> T fobj(T, T);
template <typename T> T fref(const T&, const T&);

string s1("a value");
const string s2("another value");

fobj(s1, s2);  // fobj(string, string)，顶层const无论是实参还是形参都被忽略
fref(s1, s2);  // fref(const string&, const string&)

int a[10], b[42];
fobj(a, b);  // fobj(int*, int*)
fref(a, b);  // 形参是引用类型，不能转为指针类型，两个数组类型不匹配
```

- 一个模板参数可以作为多个函数形参的类型，但是由于模板实参推断的限制，这些形参必须具有相同的类型
- 如果希望对函数实参进行正常的类型转换，可以使用多个模板参数
- 如果函数参数类型不是模板参数，则对实参进行正常的类型转换。
- 如果模板实参类型被显式指定了，之前提到的模板实参类型转换的限制就不存在了，普通函数参数允许的类型转换也能够发生

```cpp
template<typename T> bool compare(const T&, const T&);
long lng;
compare(lng, 1024); // 错误，类型不同，compare(long, int)

template<typename T1, typename T2> bool compare(const T1& v1, const T2& v2){
	if (v1 < v2) return -1;
	if (v2 < v1) return 1;
	return 0;
}
compare(lng, 1024); // 正确，compare(long, int)

template<typename T> T calc(T, long);
calc(23.4, 55); // 正确，普通函数参数类型转换，calc(double, long)

template<typename T> T fcn(T, T);
fcn<long>(12, 13); // 正确，模板实参类型被显式指定，可以类型转换，fcn<long>(long, long)
```

### 函数模板显式实参

有时候编译器无非推断模板实参类型，例如：返回值类型无法推断，此时需要显式指定返回值类型。

```cpp
template<typename T1, typename T2, typename T3>
T1 sum(T2, T3);

auto val = sum(12, 23.4); // 错误，无法推断返回值类型
auto val = sum<long long>(12, 23.4); // 正确，显式指定返回值类型

template<typename T1, typename T2, typename T3>
T3 sum(T1, T2); // 返回值类型放到最后

auto val = sum<long long, int, double>(12, 23.4); // 必须把显示指定前面的模板参数
```

### 尾置返回类型与类型转换

- 使用尾置返回类型，就可以基于 decltype 来推断返回值类型
- 使用标准库的类型转换模板获取值类型，例如：remove_reference，这些模板定义在 type_traits 头文件中

```cpp
template<typename It>
??? fcn(It beg, It end){ //无法表示返回值类型
	return *beg;
}

// 尾置返回类型
template<typename It>
auto fcn(It beg, It end) -> decltype(*beg){
	return *beg;
}
auto &i = fcn(vi.begin(), vi.end()); // 返回int&

// 怎么返回 值 类型？
template<typename It>
auto fcn(It beg, It end) -> typename remove_reference<decltype(*beg)>::type{
	return *beg;
}
auto i = fcn(vi.begin(), vi.end()); // 返回int
```

标准库类型转换模板：

- 用法与 remove_reference 都类似，通过 type 成员获取结果类型
- 如果不可能（或者不必要）转换模板参数，则 type 成员还是原类型（T）

![Alt text](image.png)

### 函数指针与实参推断

- 当使用一个函数模板初始化一个函数指针或为一个函数指针赋值时，编译器使用指针的类型来推断模板实参。
- 当参数是一个函数模板实例的地址时，程序上下文必须满足，对每个模板参数，能唯一确定其类型或值。

```cpp
template<typename T> int compare(const T&, const T&);
int (*pf1)(const int&, const int&) = compare; // 正确，推断为 compare<int>

void func(int(*)(const string&, const string&)); // 函数指针形参
void func(int(*)(const int&, const int&)); // 函数指针形参
func(compare); // 二义性错误，无法推断compare<int>还是compare<string>

func(compare<string>); // 正确，显式指定
```

### 模板实参推断与引用

- 当一个函数参数是模板类型参数的一个普通（左值）引用时，绑定规则告诉我们，只能传递给它一个左值
- 实参可以是 const 类型，如果是 const，则 T 会被推断为 const 类型

```cpp
template <typename T> void f1(T&);
int i;
const int ci;
f1(i);  // T->int
f1(ci);  // T->const int
f1(5);  // 错误，不能把右值绑定到T&
```

- 如果函数参数类型是 const T&，则既可以传递左值也可以传递右值

```cpp
template <typename T> void f2(const T&);
int i;
const int ci;
f2(i);  // T->int
f2(ci);  // T->int
f2(5);  // T->int
```

从右值引用函数参数推导类型：

- 通常函数参数是右值引用时，只能传递右值的实参
- 但在模板参数中有两条额外的规则，这是 std::move 这种标准库设施正确工作的基础：
  - 左值传递给右值引用参数时返回左值引用类型，例如：int->int&
  - 引用折叠：
    - T& & -> T&
    - T& && -> T&
    - T&& & -> T&
    - T&& && -> T&&
    - 引用折叠只能应用于间接创建的引用的引用，如类型别名（using）或模板参数。

```cpp
template <typename T> void f3(T&&);
int i; const int ci;
f3(42);  // T->int
f3(i);  // T->int&
f3(ci);  // T->const int&
```

### 理解 std::move

### 转发

## 重载与模板

## 可变参数模板

### 编写可变参数模板

### 包扩展

### 转发参数包

## 模板特例化

```

```

```

```

```

```

```

```

```

```

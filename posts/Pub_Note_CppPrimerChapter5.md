---
title: C++ Primer 5.语句
---

## 简单语句

```cpp
while (cin>>s && s != sought)
	; // 空语句，最好加上注释

while (iter != svec.end()) ; // 错误，这是一个空语句，不会执行循环体
	++iter;

```

## 条件语句

### if

```cpp
if (grade > 90)
	cout << "great" << endl; // 单个语句可以不用花括号
else if (grade >= 60)
	cout << "pass" << endl;
	if(grade >= 80) // 错误，前面的else if没有花括号
		cout << "high pass" << endl;
	else // C++中else与最近的if匹配
		cout << "low pass"<<endl;
else
	cout << "fail" << endl;
```

### switch

```cpp
switch (a){
	case 10:
		cout << "10" << endl; // 没有break，会继续执行下一个case
	case 3.14:  // 错误，case标签必须是整型常量表达式
		break;
	case 8:
		cout << "8" << endl;
		break;
	default:
		cout << "default" << endl; // 没有匹配的case时执行default
}
```

如果需要为某个 case 分支定义并初始化一个变量，我们应该把变量定义在块内，从而确保后面的所有 case 标签都在变量的作用域之外。

```cpp
switch (ival) {
	case 0:
		int ix = 1; // 错误，定义在case内部的变量在其他case中使用
	case 1:
		int k = ix + 1;
	case 2:
		{
			int ix = 1; // 正确，定义在块内
			break;
		}
}
```

## 迭代语句

### for

```cpp
for(int i=0,*p=&i;i<10;++i){ // 初始化语句可以定义多个变量，但是只能有一个类型说明符
	cout << i << endl;
}
// init_statement、condition、expression都是可选的
int i =0;
for(;;){
	if(i>10)
		break;
	cout << i << endl;
	++i;
}

// 范围for语句
vector<int> v = {1,2,3,4,5};
for(auto &i : v){
	i *= i;
}
// 等价于
for(auto beg = v.begin(); beg != v.end(); ++beg){
	auto i = *beg;
	i *= i;
}
// 在遍历过程中修改容器大小具体行为需要根据具体的容器来决定
```

### do while

```cpp
int i = 0;
do{
	cout << i << endl;
	++i;
}while(i<10); // 不要忘记分号
```

## 跳转语句

## try 语句和异常处理

```

```

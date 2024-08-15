---
title: Pyinstaller打包
---

最好是在一个虚拟环境中进行打包，这样可以避免一些依赖问题。
创建一个虚拟环境：

```shell
python -m venv env
env\Scripts\activate
```

然后在目录下执行打包命令：

```shell
pyinstaller --onefile --windowed main.py
```

Pyinstaller 会根据 import 自动查找依赖，然后打包成一个 exe 文件。

## 错误

### 找不到资源文件

打包后可能会有资源文件找不到的问题，例如：依赖了 chlorophyll 这个库，这个库包含了一些 xxx.toml 的资源文件，可能会没有打进去：`FileNotFoundError: [Errno 2] No such file or directory: xxx.toml`，需要创建一个 `hook-chlorophyll.py` 文件，放在 `pyinstaller` 的 `hooks` 文件夹下，内容如下：

```python
from PyInstaller.utils.hooks import collect_data_files
datas = collect_data_files("chlorophyll")
```

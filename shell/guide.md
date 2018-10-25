### Shell环境
Linux的Shell种类众多：
- Bourne Shell (`/usr/bin/sh`或/`bin/sh`)
- Bourne Again Shell (`/bin/bash`)
- C Shell (`/sur/bin/csh`)
- K Shell (`/usr/bin/ksh`)
- Shell for Root (`/sbin/sh`)
- ...

_#! 告诉系统其后路径所指定的程序即是解释此脚本文件的 Shell 程序。_


### 运行Shell脚本两种方法
- 作为可执行程序  
  ```shell
  chomod +x ./test.sh #使脚本具有执行权限
  ./test.sh #执行脚本
  ```
  __一定要写成 ./test.sh，而不是 test.sh，运行其它二进制的程序也一样，直接写 test.sh，linux 系统会去 PATH 里寻找有没有叫 test.sh 的，而只有 /bin, /sbin, /usr/bin，/usr/sbin 等在 PATH 里，你的当前目录通常不在 PATH 里，所以写成 test.sh 是会找不到命令的，要用 ./test.sh 告诉系统说，就在当前目录找。__
- 作为解释器参数
  ```
  /bin/sh test.sh
  ```
  __直接运行解释器，其参数就是 shell 脚本的文件名。这种方式运行的脚本，不需要在第一行指定解释器信息，写了也没用。__


### Shell变量
```shell
your_name="runoob.com"
```
- 变量名不加美元符号
- 变量名和等号之间不能有空格
- 命名只能使用英文字母，数字和下划线，首个字符不能以数字开头。中间不能有空格，可以使用下划线（_）。不能使用标点符号。不能使用bash里的关键字（可用help命令查看保留关键字）。

#### 使用变量
```shell
your_name="xxx"
echo $your_name
echo ${your_name}
```
变量名外面的花括号是可选的，加不加都行，加花括号是为了帮助解释器识别变量的边界。
```shell
for skill in Ada Coffe Action Java; do
    echo "I am good at ${skill}Script"
done
```

#### 只读变量
使用 readonly 命令可以将变量定义为只读变量，只读变量的值不能被改变。
```shell
#!/bin/bash
myUrl="http://www.google.com"
readonly myUrl
myUrl="http://www.runoob.com"
```
运行脚本，结果：`/bin/sh: NAME: This variable is read only.`

#### 删除变量
使用 unset 命令可以删除变量，变量被删除后不能再次使用。unset 命令不能删除只读变量。
```shell
unset variable_name
```

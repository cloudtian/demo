### 目录
- [Shell环境](#Shell环境)
- [运行Shell脚本两种方法](#运行Shell脚本两种方法)
- [Shell变量](#Shell变量)
  - [使用变量](#使用变量)
  - [只读变量](#只读变量)
  - [删除变量](#删除变量)
  - [变量类型](#变量类型)
- [Shell字符串](#Shell字符串)
- [Shell数组](#Shell数组)
  - [定义数组](#定义数组)
  - [读取数组](#读取数组)
  - [获取数组中的所有元素](#获取数组中的所有元素)
  - [获取数组的长度](#获取数组的长度)
- [Shell注释](#Shell注释)
  - [多行注释](#多行注释)
- [Shell传递参数](#Shell传递参数)
- [Shell基本运算符](#Shell基本运算符)
  - [算术运算符](#算术运算符)
  - [关系运算符](#关系运算符)
  - [布尔运算符](#布尔运算符)
  - [逻辑运算符](#逻辑运算符)
  - [字符串运算符](#字符串运算符)
  - [文件测试运算符](#文件测试运算符)
- [Shell echo命令](#Shell-echo命令)
- [Shell printf命令](#Shell-printf命令)
  - [printf的转义序列](#printf的转义序列)
- [Shell test命令](#Shell-test命令)
  - [数值测试](#数值测试)
  - [字符串测试](#字符串测试)
  - [文件测试](#文件测试)
- [Shell流程控制](#Shell流程控制)
  - [if, if else, if else-if else](#if-if-else-if-else-if-else)
  - [for循环](#for循环)
  - [while语句](#while语句)
  - [无限循环](#无限循环)
  - [until循环](#until循环)
  - [case](#case)
  - [跳出循环](#跳出循环)
- [Shell函数](#Shell函数)
  - [函数参数](#函数参数)
- [Shell输入/输出重定向](#Shell输入/输出重定向)



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
  _一定要写成 ./test.sh，而不是 test.sh，运行其它二进制的程序也一样，直接写 test.sh，linux 系统会去 PATH 里寻找有没有叫 test.sh 的，而只有 /bin, /sbin, /usr/bin，/usr/sbin 等在 PATH 里，你的当前目录通常不在 PATH 里，所以写成 test.sh 是会找不到命令的，要用 ./test.sh 告诉系统说，就在当前目录找。_
- 作为解释器参数
  ```
  /bin/sh test.sh
  ```
  _直接运行解释器，其参数就是 shell 脚本的文件名。这种方式运行的脚本，不需要在第一行指定解释器信息，写了也没用。_

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

#### 变量类型
- 局部变量
- 环境变量
- shell变量

### Shell字符串
- 单引号：单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的；单引号字串中不能出现单独一个的单引号（对单引号使用转义符后也不行），但可成对出现，作为字符串拼接使用。
- 双引号：双引号里可以有变量；双引号里可以出现转义字符
- 拼接字符串
- 获取字符串长度：`echo ${#var_name}`
- 提取子字符串：`echo ${var_name:1:3}`
- 查找子字符串：查找字符 i 或 o 的位置(哪个字母先出现就计算哪个)，```
echo `expr index "$string" io` ```

### Shell数组
数组中可以存放多个值。Bash Shell 只支持一维数组（不支持多维数组），初始化时不需要定义数组大小。
#### 定义数组
Shell 数组用括号来表示，元素用"空格"符号分割开。
可以不使用连续的下标，而且下标的范围没有限制。
> 数组名=(值1 值2 ... 值n)  
`array_name=(value0 value1 value2 value3)`

#### 读取数组
> ${数组名[下标]}  
`valuen=${array_name[n]}`  

> 使用@符号可以获取数组中的所有元素：  
`echo ${array_name[@]}`

#### 获取数组中的所有元素
使用@ 或 * 可以获取数组中的所有元素

#### 获取数组的长度
获取数组长度的方法与获取字符串长度的方法相同
```shell
# 取得数组元素的个数
length=${#array_name[@]}
# 或者
length=${#array_name[*]}
# 取得数组单个元素的长度
lengthn=${#array_name[n]}
```

### Shell注释
以 # 开头的行就是注释，会被解释器忽略。
#### 多行注释
```shell
:<<EOF
注释内容
EOF
```
EOF也可以使用其他符号`'`，`!`;

### Shell传递参数
脚本内获取参数的格式为：$n。n 代表一个数字，1 为执行脚本的第一个参数，2 为执行脚本的第二个参数，以此类推……  

参数处理 | 说明
------ | ------
$# | 传递到脚本的参数个数
$* | 以一个单字符串显示所有向脚本传递的参数。如"$*"用「"」括起来的情况、以"$1 $2 … $n"的形式输出所有参数。
$$ | 脚本运行的当前进程ID号
$! | 后台运行的最后一个进程的ID号
$@ | 与$*相同，但是使用时加引号，并在引号中返回每个参数。如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数。
$- | 显示Shell使用的当前选项，与set命令功能相同。
$? | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。

### Shell基本运算符
- 算术运算符
- 关系运算符
- 布尔运算符
- 字符串运算符
- 文件测试运算符

原生bash不支持简单的数学运算，但是可以通过其他命令来实现，例如`awk`和`expr`;  
`expr`是一款表达式计算工具，使用它能完成表达式的求值操作。_(注意使用的是反引号 ` 而不是单引号 ')_
- 表达式和运算符之间要有空格，例如 `2+2` 是不对的，必须写成 `2 + 2`
- 完整的表达式要被反引号 ` 包含

#### 算术运算符
假定变量a为10，b为20：  

运算符 | 说明 | 举例
----- | ----- | -----
+ | 加法 | `expr $a + $b` 结果为30
- | 减法 | `expr $a - $b` 结果为-10
* | 乘法 | `expr $a \* $b`结果为200
/ | 除法 | `expr $b / $a`结果为2
% | 取余 | `expr $b % $a`结果为0
= | 赋值 | a=$b将变量b的值赋给a
== | 相等。用于比较两个数字，相同则返回true | [ $a == $b ]返回false
!= | 不相等。用于比较两个数字，不相同则返回true | [ $a != $b ]返回true

> 注意：
> - 条件表达式要放在方括号之间，并且要有空格，例如: [$a==$b] 是错误的，必须写成 [ $a == $b ]。
> - 乘号(`*`)前边必须加反斜杠(`\`)才能实现乘法运算
> - if...then...fi 是条件语句
> - 在 MAC 中 shell 的 expr 语法是：$((表达式))，此处表达式中的 "*" 不需要转义符号 "\" 。

#### 关系运算符
关系运算符只支持数字，不支持字符串，除非字符串的值是数字。  
假定变量 a 为 10，变量 b 为 20：  

运算符 | 说明 | 举例
----- | ----- | -----
-eq | 检测两个数是否相等，相等返回true | [ $a -eq $b ]返回false
-ne | 检测两个数是否不相等，不相等返回true | [ $a -ne $b ]返回true
-gt | 检测左边的数是否大于右边的，如果是，则返回true | [ $a -gt $b]返回false
-lt | 检测左边的数是否小于右边的，如果是，则返回true | [ $a -lt $b ]返回true
-ge | 检测左边的数是否大于等于右边的，如果是则返回true | [ $a -ge $b ]返回false
-le | 检测左边的数是否小于等于右边的，如果是则返回true | [ $a -le $b ]返回true

#### 布尔运算符
假定变量 a 为 10，变量 b 为 20：  

运算符 | 说明 | 举例
----- | ----- | -----
! | 非运算，表达式为true则返回false，否则返回true | [ !false ]返回true
-o | 或运算，有一个表达式为true则返回true | [ $a -lt 20 -o $b -gt 100]返回true
-a | 与运算，两个表达式都为true才返回true | [ $a -lt 20 -a $b -gt 100]返回false

#### 逻辑运算符
假定变量 a 为 10，变量 b 为 20：  

运算符 | 说明 | 举例
----- | ----- | -----
&& | 逻辑的AND | [[ $a -lt 100 && $b -gt 100]]返回false
`||` | 逻辑的OR | `[[ $a -lt 100 || $b -gt 100]]`返回true

#### 字符串运算符
假定变量 a 为 'abc'，变量 b 为 'efg'：  

运算符 | 说明 | 举例
----- | ----- | -----
= | 检测两个字符串是否相等，相等返回true | [ $a = $b ]返回false
!= | 检测两个字符串是否不相等，不相等返回true | [ $a != $b ]返回true
-z | 检测字符串长度是否为0，为0返回true | [ -z $a ]返回false
-n | 检测字符串是否不为0，不为0返回true | [ -n "$a" ]返回true
str | 检测字符串是否不为空，不为空返回true | [ $a ]返回true

#### 文件测试运算符
文件测试运算符用于检测 Unix 文件的各种属性。  

运算符 | 说明 | 举例
----- | ----- | -----
-b file | 检测文件是否是块设备文件，如果是，则返回true | [ -b $file ]返回false
-c file | 检测文件是否是字符设备文件，如果是，则返回true | [ -c $file ]返回false
-d file | 检测文件是否是目录，如果是，则返回true | [ -d $file ]返回false
-f file | 检测文件是否是普通文件（既不是目录，也不是设备文件），如果是，则返回true | [ -f $file ]返回true
-g file | 检测文件是否设置了SGID位，如果是，则返回true | [ -g $file ]返回false
-k file | 检测文件是否设置了粘着位（Sticky Bit），如果是，则返回true | [ -k $file ]返回false
-p file	| 检测文件是否是有名管道，如果是，则返回 true。 | [ -p $file ] 返回 false。
-u file	| 检测文件是否设置了 SUID 位，如果是，则返回 true。 | [ -u $file ] 返回 false。
-r file	| 检测文件是否可读，如果是，则返回 true。 | [ -r $file ] 返回 true。
-w file	| 检测文件是否可写，如果是，则返回 true。 | [ -w $file ] 返回 true。
-x file	| 检测文件是否可执行，如果是，则返回 true。 | [ -x $file ] 返回 true。
-s file	| 检测文件是否为空（文件大小是否大于0），不为空返回 true。 | [ -s $file ] 返回 true。
-e file	| 检测文件（包括目录）是否存在，如果是，则返回 true。 | [ -e $file ] 返回 true。

### Shell echo命令
- 显示普通字符串：`echo "It is a test"`，这里双引号完全可以省略，`echo It is a test`
- 显示转义字符：`echo "\"It is a test\""`，同样双引号也可以省略
- 显示变量：read命令从标准输入中读取一行，并把输入行的每个字段的值指定给shell变量
- 显示换行：`echo -e "OK! \n"`，`-e` 开启转义
- 显示不换行：`echo -e "OK! \c"` `-e`开启转义 `\c`不换行
- 显示结果定向至文件：`echo "It is a test" > myfile`
- 原样输出字符串，不进行转义或取变量（用单引号）：`echo '$name\"'`
- 显示命令执行结果：``` echo `date` ```，结果显示当前日期

### Shell printf命令
printf 由 POSIX 标准所定义，因此使用 printf 的脚本比使用 echo 移植性好。  
printf 使用引用文本或空格分隔的参数，外面可以在 printf 中使用格式化字符串，还可以制定字符串的宽度、左右对齐方式等。默认 printf 不会像 echo 自动添加换行符，我们可以手动添加 \n。
> printf format-string [arguments...]
> - format-string:为格式控制字符串
> - arguments:为参数列表

#### printf的转义序列
序列 | 说明
----- | -----
\a | 警告字符，通常为ASCII的BEL字符
\b | 后退
\c | 抑制（不显示）输出结果中任何结尾的换行字符（只在%b格式指示符控制下的参数字符串中有效），而且，任何留在参数里的字符，任何接下来的参数以及任何留在格式字符串中的字符，都被忽略
\f | 换页（formfeed）
\n | 换行
\r | 回车（Carriage return）
\t | 水平制表符
\v | 垂直制表符
\\ | 一个字面上的反斜杠字符
\ddd | 表示1到3位数八进制值的字符。仅在格式字符中有效
\0ddd | 表示1到3位的八进制字符

### Shell test命令
Shell中的 test 命令用于检查某个条件是否成立，它可以进行数值、字符和文件三个方面的测试。
#### 数值测试
参数 | 说明
----- | -----
-eq | 等于则为真
-ne | 不等于则为真
-gt | 大于则为真
-ge | 大于等于则为真
-lt | 小于则为真
-le | 小于等于则为真

#### 字符串测试
参数 | 说明
----- | -----
= | 等于则为真
!= | 不相等则为真
-z 字符串 | 字符串的长度为零则为真
-n 字符串 | 字符串的长度不为零则为真

#### 文件测试
参数 | 说明
----- | -----
-e 文件名 | 如果文件存在则为真
-r 文件名 | 如果文件存在且可读则为真
-w 文件名 | 如果文件存在且可写则为真
-x 文件名 | 如果文件存在且可执行则为真
-s 文件名 | 如果文件存在且至少有一个字符则为真
-d 文件名 | 如果文件存在且为目录则为真
-f 文件名 | 如果文件存在且为普通文件则为真
-c 文件名 | 如果文件存在且为字符型特殊文件则为真
-b 文件名 | 如果文件存在且为块特殊文件则为真

> 另外，Shell还提供了与( -a )、或( -o )、非( ! )三个逻辑操作符用于将测试条件连接起来，其优先级为："!"最高，"-a"次之，"-o"最低。

### Shell流程控制
#### if, if else, if else-if else
```shell
if condition
then
    command1
    command2
    command3
    ...
    commandN
elif condition2
then
    commandM
else
    command
fi
```
写成一行（适用于终端命令提示符）：
```shell
if [ $(ps -ef | grep -c "ssh") -gt 1]; then echo "true"; fi
```

#### for循环
```shell
for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done
```
写成一行：
```shell
for var in item1 item2 ... itemN; do command; command2... done;
```

#### while语句
while循环用于不断执行一系列命令，也用于从输入文件中读取数据；命令通常为测试条件。
```shell
while condition
do
    command
done
```

#### 无限循环
```shell
while :
do
    command
done
#或者
while true
do
    command
done
#或者
for (( ; ;))
```

#### until循环
until 循环执行一系列命令直至条件为 true 时停止。  
until 循环与 while 循环在处理方式上刚好相反。  
一般 while 循环优于 until 循环，但在某些时候—也只是极少数情况下，until 循环更加有用。  
```shell
until condition
do 
    command
done
```
condition 一般为条件表达式，如果返回值为 false，则继续执行循环体内的语句，否则跳出循环。

#### case
Shell case语句为多选择语句。可以用case语句匹配一个值与一个模式，如果匹配成功，执行相匹配的命令。
```shell
case 值 in
模式1)
    command1
    command2
    ...
    commandN
    ;;
模式2)
    command1
    command2
    ...
    commandN
    ;;
esac
```
- 取值后面必须为单词in，每一模式必须以右括号结束。
- 取值可以为变量或常数。
- 匹配发现取值符合某一模式后，其间所有命令开始执行直至 ;;
- 取值将检测匹配的每一个模式。一旦模式匹配，则执行完匹配模式相应命令后不再继续其他模式。如果无一匹配模式，使用星号 * 捕获该值，再执行后面的命令。

#### 跳出循环
__break__：break命令允许跳出所有循环（终止执行后面的所有循环）。
__continue__：continue命令与break命令类似，只有一点差别，它不会跳出所有循环，仅仅跳出当前循环。

### Shell函数
```shell
[ function ] fnname [()]
{
    action;
    [return int;]
}

# 定义函数
demoFun(){
    echo "my first shell function"
}
demoFun
```
- 可以带function fun() 定义，也可以直接fun() 定义,不带任何参数。
- 参数返回，可以显示加：return 返回，如果不加，将以最后一条命令运行结果，作为返回值。 return后跟数值n(0-255)
- 函数返回值在调用该函数后通过 $? 来获得。
> 注意：所有函数在使用前必须定义。这意味着必须将函数放在脚本开始部分，直至shell解释器首次发现它时，才可以使用。调用函数仅使用其函数名即可。

#### 函数参数
在Shell中，调用函数时可以向其传递参数。在函数体内部，通过 $n 的形式来获取参数的值，例如，$1表示第一个参数，$2表示第二个参数...
> 注意，$10 不能获取第十个参数，获取第十个参数需要${10}。当n>=10时，需要使用${n}来获取参数。

参数处理 | 说明
----- | -----
$# | 传递到脚本的参数个数
$* | 以一个单字符串显示所有向脚本传递的参数
$$ | 脚本运行的当前进程ID号
$! | 后台运行的最后一个进程的ID号
$@ | 与$*相同，但是使用时加引号，并在引号中返回每个参数。
$- | 显示Shell使用的当前项目，与set命令功能相同。
$? | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。


### Shell输入/输出重定向
重定向命令列表
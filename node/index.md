## Nodejs基础
---
### 模块

__require__：require函数用于在当前模块中加载和使用别的模块，传入一个模块名，返回一个模块导出对象。模块名可使用相对路径(以./开头)，或者是绝对路径(以/或C:之类的盘开头)。另外，模块名中的.js扩展名可以省略。
```js
var foo1 = require('./foo');
var foo2 = require('./foo.js');
var foo3 = require('/home/user/foo');
var foo4 = require('/home/user/foo.js');
// foo1至foo4保存的是同一个模块的导出对象。
```
可以使用以下方式加载和使用一个json文件。
```js
var data = require('./data.json');
```

__exports__：exports对象是当前模块的导出对象，用于导出模块公有方法和属性。别的模块通过require函数使用当前模块时得到的就是当前模块的exports对象。
```js
exports.hello = function () {
    console.log('Hello World!');
}
```

__module__：通过module对象可以访问到当前模块的一些相关信息，但最多的用途是替换当前模块的导出对象。
```js
module.exports = function () {
    console.log('Hello World!');
}
```
以上代码中，模块默认导出对象被替换为一个函数，

__模块初始化__：一个模块中的js代码仅在模块第一次被使用时执行一次，并在执行过程中初始化模块的导出对象。之后，缓存起来的导出对象被重复利用。

## 代码的组织和部署
---
### 模块路径解析规则
require函数支持斜杠(/)或盘符(C:)开头的绝对路径，也支持./开头的相对路径。但这两种路径在模块之间建立了强耦合关系，一旦某个模块文件的存放位置需要变更，使用该模块的其他模块的代码也需要跟着调整，变得牵一发动全身。因此，require函数支持第三种形式的路径，写法类似与foo/bar，并依次按照以下规则解析路径，直到找到模块位置。  

__内置模块__：如果传递给require函数的是NodeJS内置模块名称，不做路径解析，直接返回颞部模块的导出对象，例如require('fs')。

__node_modules目录__：NodeJS定义了一个特殊的node_modules目录用于存放模块。例如某个路径的绝对路径是/home/user/hello.js，在该模块中使用require('foo/bar')方式加载模块时，则NodeJS依次尝试使用以下路径。
```
/home/user/node_modules/foo/bar
/home/node_modules/foo/bar
/node_modules/foo/bar
```

__NODE_PATH环境变量__：与PATH环境变量类似，NodeJS允许通过NODE_PATH环境变量来指定额外的模块搜索路径。NODE_PATH环境变量中包含一到多个目录路径，路径之间在Linux下使用:分隔，在Windows下使用;分隔。  
`NODE_PATH=/home/user/lib:/home/lib`  
当使用require('foo/bar')的方式加载模块时，则NodeJS依次尝试以下路径。
```
/home/user/lib/foo/bar
/home/lib/foo/bar
```

### 包（package）
为了便于管理和使用，把由多个子模块组成的大模块称做包，并把所有子模块放在同一个目录里。  

__index.js__：当模块的文件名是index.js，加载模块时可以使用模块所在目录的路径代替模块文件路径。

__package.json__：如果想自定义入口模块的文件名和存放位置，就需要在包目录下包含一个package.json文件，并在其中指定入口模块的路径。
```
{
    "name": "cat",
    "main": "./lib/main.js"
}
```
NodeJS会根据包目录下的package.json找到入口模块所在位置。

### 命令行程序
Linux下
- 新建node-echo.js；在第一行添加`#! /usr/bin/env node`
- 赋予node-echo.js文件执行权限`chmod +x /home/user/bin/node-echo.js`
- 在PATH环境变量中指定的某个目录下`sudo ln -s /home/user/bin/node-echo.js /usr/local/bin/node-echo`  

Windows下
- 在Windows系统下的做法完全不同，我们得靠.cmd文件来解决问题。例如node-echo.js存放在C:\Users\user\bin目录，并且该目录已经添加到PATH环境变量里了。
- 接下来需要在该目录下新建一个名为mode-echo.cmd的文件。`@node "C:\User\user\bin\node-echo.js" %`
- 这样处理后，就可以在任何目录下使用node-echo命令了。

### 工程目录
```shell
- /home/user/workspace/node-echo/ # 工程目录
    - bin/ # 存放命令行相关代码
        node-echo
    + doc/ # 存放文档
    - lib/ # 存放API相关代码
        echo.js
    - node_modules/ # 存放三方包
        + argv/
    + tests/ # 存放测试用例
    package.json # 元数据文件
    README.md # 说明文件
```

### NPM
- 下载三方包
- 安装命令行程序
- 发布代码  
  第一次使用NPM发布代码前需要注册一个账号。终端下运行npm adduser,之后按照提示做即可。账号搞定后，接着我们需要编辑package.json文件，加入NPM必须的字段。  
  package.json里必要的字段如下。
  ```shell
  {
      "name": "node-echo", # 包名，在NPM服务器上须要保持唯一
      "version": "1.0.0", # 当前版本号
      "dependencies": { # 三方包依赖，需要指定包名和版本号
          "argv": "0.0.2"
      },
      "main": "./lib/echo.js" # 入口模块位置
      "bin": {
          "node-echo": "./bin/node-echo" #命令行程序名和主模块位置
      }
  }
  ```
  之后就可以在package.json所在的目录下运行npm public发布代码了。

__版本号__：语义版本号分为X.Y.Z三位，分别代表主版本号、次版本号和补丁版本号。
- 如果只是修复bug,需要更新Z位。
- 如果是新增了功能，但是向下兼容，需要更新Y位。
- 如果有大变动，向下不兼容，需要更新X位。

## 文件操作
---
### 小文件拷贝与大文件拷贝
[小文件拷贝]()  
[大文件拷贝]()
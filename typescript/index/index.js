var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var isBoolean = false;
var isNumber = 1;
var isString = 'Tom';
var templateString = "This is a template string, string " + isString + ", number " + isNumber + ", boolean " + isBoolean;
var unUsable = undefined;
var u = undefined;
var n = null;
// undefined 和 null 是所有类型的子类型
var num = u;
var str = n;
function setName(obj, name) {
    obj.name = name;
}
var strOrNum = 'seven';
strOrNum = 7;
var tomInfo = {
    id: 123,
    name: 'Tom',
    age: 7
};
var fibonacci = [1, 1, 2, 3, 5, 8];
// 泛型
var arrayGeneric = [1, 1, 2, 3, 5];
var f = [1, 1, 2, 3, 5];
function sum() {
    var args = arguments;
}
function sum2(x, y) {
    return x + y;
}
var sum3 = function (x, y) {
    return x + y;
};
var mySearch;
mySearch = function (source, subString) {
    return source.search(subString) !== -1;
};
// 需要注意的是，可选参数必须接在必需参数后面。换句话说，可选参数后面不允许再出现必须参数了
function buildName(firstName, lastName) {
    if (lastName) {
        return firstName + ' ' + lastName;
    }
    else {
        return firstName;
    }
}
var tomcat = buildName('tom', 'cat');
var tom = buildName('tom');
// TypeScript 会将添加了默认值的参数识别为可选参数
function buildName2(firstName, lastName) {
    if (lastName === void 0) { lastName = 'cat'; }
    return firstName + ' ' + lastName;
}
function push(array) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    items.forEach(function (item) {
        array.push(item);
    });
}
function reverse(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else if (typeof x === 'string') {
        return x.split('').reverse().join();
    }
}
// 类型断言
function getLength(something) {
    if (something.length) {
        return something.length;
    }
    else {
        return something.toString().length;
    }
}
// declare 定义的类型只会用于编译时的检查，编译结果总会被删除。
// declare var jQuery: (selector: string) => any;
// jQuery('#index');
// 通常我们会把类型声明放到一个单独的文件中，这就是声明文件
// jQuery.d.ts 
// declare var jQuery: (selector: string) => any;
// 然后在使用到的文件的开头，用[三斜线指令]表示引用了声明文件
/// <reference path="./jQuery.d.ts" />
// jQuery('#index');
// 第三方声明文件；@types来管理，直接用npm安装对应的声明模块即可
// npm install @types/jquery --save-dev
// 内置对象
var b = new Boolean(1);
var e = new Error('Error occurred');
var d = new Date();
var r = /[a-z]/;
// DOM和BOM的内置对象
var body = document.body;
var allDiv = document.querySelectorAll('div');
document.addEventListener('click', function (e) {
    // Do something
});
function getName(n) {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
function handleEvent(ele, event) {
    // do something
}
// 注意，类型别名与字符串字面量类型都是使用 type 进行定义。
// 元组： 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。
var tomInfo2 = ['tom', 25];
// 枚举类型: 枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
;
// 手动赋值
var Days2;
(function (Days2) {
    Days2[Days2["Sun"] = 7] = "Sun";
    Days2[Days2["Mon"] = 1] = "Mon";
    Days2[Days2["Tue"] = 2] = "Tue";
    Days2[Days2["Wed"] = 3] = "Wed";
    Days2[Days2["Thu"] = 4] = "Thu";
    Days2[Days2["Fri"] = 5] = "Fri";
    Days2[Days2["Sat"] = 6] = "Sat";
})(Days2 || (Days2 = {}));
;
// 计算所得项
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 'blue'.length] = "Blue";
})(Color || (Color = {}));
;
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
// declare 定义的类型只会用于编译时的检查，编译结果中会被删除。
var directions2 = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
// 类
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = name;
    }
    return Animal;
}());
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cat.prototype.sayHi = function () {
        console.log("Meow, My name is " + this.name);
    };
    return Cat;
}(Animal));
var cat = new Cat('Tom');
// 给类加上TypeScript的类型
var Animal2 = /** @class */ (function () {
    function Animal2(name) {
        this.name = name;
    }
    Animal2.prototype.sayHi = function () {
        return "My name is " + this.name;
    };
    return Animal2;
}());
var a = new Animal2('Jack');
console.log(a.sayHi()); // My name is Jack
var Door = /** @class */ (function () {
    function Door() {
    }
    return Door;
}());
var SecurityDoor = /** @class */ (function (_super) {
    __extends(SecurityDoor, _super);
    function SecurityDoor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecurityDoor.prototype.alert = function () {
        console.log('SecurityDoor alert');
    };
    return SecurityDoor;
}(Door));
var Car = /** @class */ (function () {
    function Car() {
    }
    Car.prototype.alert = function () {
        console.log('Car alert');
    };
    Car.prototype.lightOn = function () {
        console.log('Car light on');
    };
    Car.prototype.lightOff = function () {
        console.log('Car light off');
    };
    return Car;
}());
var Point = /** @class */ (function () {
    function Point() {
    }
    return Point;
}());
var point3d = { x: 1, y: 2, z: 3 };
function getCounter() {
    var conter = function (start) { };
    conter.interval = 123;
    conter.reset = function () { };
    return conter;
}
var c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
// 泛型：泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
function createArray(length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3, 'x');
// 上例中，我们在函数名后添加了 <T>，其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了。
// 接着在调用的时候，可以指定它具体的类型为 string。当然，也可以不手动指定，而让类型推论自动推算出来。
// 多个类型参数
function swap(tuple) {
    return [tuple[1], tuple[0]];
}
swap([7, 'seven']);
function loggingIdentity(arg) {
    console.log(arg.length);
    return arg;
}
loggingIdentity({ a: 1, length: 1 });
// T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。
function copyFields(target, source) {
    for (var id in source) {
        target[id] = source[id];
    }
    return target;
}
var x = { a: 1, b: 2, c: 3, d: 4 };
copyFields(x, { b: 10, d: 20 });
var createArray2;
createArray2 = function (length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
};
createArray2(3, 'x');
var createArray3;
createArray3 = function (length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
};
createArray3(3, 'x');
//泛型类
var GenericNumber = /** @class */ (function () {
    function GenericNumber() {
    }
    return GenericNumber;
}());
var myGenericNumber = new GenericNumber();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) { return x + y; };
// 泛型参数的默认类型
function createArray4(length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

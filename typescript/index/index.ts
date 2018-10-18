let isBoolean: boolean = false;

let isNumber: number = 1;

let isString: string = 'Tom';

let templateString: string = `This is a template string, string ${isString}, number ${isNumber}, boolean ${isBoolean}`;

let unUsable: void = undefined;

let u: undefined = undefined;
let n: null = null;
// undefined 和 null 是所有类型的子类型

let num: number = u;
let str: string = n;

function setName(obj: any, name: string): void {
    obj.name = name;
}

let strOrNum: string | number = 'seven';
strOrNum = 7;

interface Person2 {
    name: string,
    age: number,
    male?: boolean, // 可选属性
    [propName: string]: any, // 任意属性
    // 需要注意的是，一旦定义了任意属性，那么确定属性和可选属性都必须是它的子属性

    readonly id: number // 只读属性
}

let tomInfo: Person2 = {
    id: 123,
    name: 'Tom',
    age: 7
};

let fibonacci: number[] = [1, 1, 2, 3, 5, 8];

// 泛型
let arrayGeneric: Array<number> = [1, 1, 2, 3, 5];

interface NumberArray {
    [index: number]: number
    // 表示只要index的类型是number，那么值的类型必须是number
}

let f: NumberArray = [1, 1, 2, 3, 5];

function sum(): void {
    let args: IArguments = arguments;
}

function sum2(x: number, y: number): number {
    return x + y;
}

let sum3: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
}
// 在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

interface SearchFn {
    (source: string, subString: string): boolean
}

let mySearch: SearchFn;
mySearch = function (source: string, subString: string) {
    return source.search(subString) !== -1;
}

// 需要注意的是，可选参数必须接在必需参数后面。换句话说，可选参数后面不允许再出现必须参数了
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('tom', 'cat');
let tom = buildName('tom');

// TypeScript 会将添加了默认值的参数识别为可选参数
function buildName2(firstName: string, lastName: string = 'cat') {
    return firstName + ' ' + lastName;
}

function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

// 重载
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join();
    }
}

// 类型断言
function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
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
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;

// DOM和BOM的内置对象
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function (e: MouseEvent) {
    // Do something
});

// Node.js不是内置对象的一部分，如果想用TypeScript写Node.js，则需要引入第三方声明文件
// npm install @types/node --save-dev

// 类型别名
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}

// 字符串字面量类型
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

// 注意，类型别名与字符串字面量类型都是使用 type 进行定义。


// 元组： 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。
let tomInfo2: [string, number] = ['tom', 25];

// 枚举类型: 枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

// 手动赋值
enum Days2 {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};

// 计算所得项
enum Color {Red, Green, Blue = 'blue'.length};
// 如果紧接在计算所得项后面的是未手动赋值的项，那么它就会因为无法获得初始值而报错

// 当满足以下条件时，枚举成员被当作是常数：
// 不具有初始化函数并且之前的枚举成员是常数。在这种情况下，当前枚举成员的值为上一个枚举成员的值加 1。但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 0。
// 枚举成员使用常数枚举表达式初始化。常数枚举表达式是 TypeScript 表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：
//   数字字面量
//   引用之前定义的常数枚举成员（可以是在不同的枚举类型中定义的）如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用
//   带括号的常数枚举表达式
//   +, -, ~ 一元运算符应用于常数枚举表达式
//   +, -, *, /, %, <<, >>, >>>, &, |, ^ 二元运算符，常数枚举表达式做为其一个操作对象。若常数枚举表达式求值后为NaN或Infinity，则会在编译阶段报错
// 所有其它情况的枚举成员被当作是需要计算得出的值。

// 常数枚举
const enum Directions {Up, Down, Left, Right}
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
// 常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

// 外部枚举：使用declare enum定义的枚举类型
declare enum Directions2 { Up, Down, Left, Right }
// declare 定义的类型只会用于编译时的检查，编译结果中会被删除。
let directions2 = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];

// 类
abstract class  Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}
class Cat extends Animal {
    public sayHi() {
        console.log(`Meow, My name is ${this.name}`);
    }
}
let cat = new Cat('Tom');

// 给类加上TypeScript的类型
class Animal2 {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
        return `My name is ${this.name}`;
    }
}
let a: Animal = new Animal2('Jack');
console.log(a.sayHi()); // My name is Jack

// 类与接口
/**
 * 一个类只能继承自另一个类
 * 一个类可以实现多个接口
 * 接口与接口之间可以是继承关系
 * 接口也可以继承类
 */
interface Alarm {
    alert();
}

interface LightableAlarm extends Alarm {
    lightOn();
    lightOff();
}

interface Light {
    lightOn();
    lightOff();
}

class Door {}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}
class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}

class Point {
    x: number;
    y: number;
}
interface Point3d extends Point {
    z: number
}

let point3d: Point3d = {x: 1, y:2, z:3};

// 混合类型
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}
function getCounter(): Counter {
    let conter = <Counter>function (start: number) {};
    conter.interval = 123;
    conter.reset = function () {};
    return conter;
}
let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

// 泛型：泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i =0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray<string>(3, 'x');
// 上例中，我们在函数名后添加了 <T>，其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了。
// 接着在调用的时候，可以指定它具体的类型为 string。当然，也可以不手动指定，而让类型推论自动推算出来。

// 多个类型参数
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}
swap([7, 'seven']);

// 泛型约束
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingIdentity({a: 1, length: 1});

// T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}
let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });

// 泛型接口
interface CreateArrayFn {
    <T>(length: number, value: T): Array<T>
}
let createArray2: CreateArrayFn;
createArray2 = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray2(3, 'x');

// 将泛型参数提前到接口名上
interface CreateArrayFn2<T> {
    (length: number, value: T): Array<T>;
}
let createArray3: CreateArrayFn2<any>;
createArray3 = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray3(3, 'x');

//泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y };

// 泛型参数的默认类型
function createArray4<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i =0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

// 声明合并：函数的合并，接口的合并
// 接口的合并：合并的属性的类型必须是唯一的；接口中方法的合并，与函数的合并一样
interface Alarm2 {
    price: number;
    alert(s: string): string;
}
interface Alarm2 {
    weight: number;
    alert(s: string, n: number): string;
}
// 上面两个合并相当于下面这个
interface Alarm2 {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
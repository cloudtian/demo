// 原始数据类型
let b : boolean = true;
let n : number = 1;
let s : string = '';

let unusabled: void = undefined; // 空值

let u : undefined = undefined;
let l : null = null;

// undefined 和 null 是所有类型的子类型
let num1 : number = undefined;
let num2 : number = u;

// 任意值 
let myData : any = 'seven';
myData = 7;

// 类型推论
let myType1 = 'seven'; // ->string
let myType2; // -> any

// 联合类型
let composite : string | number;
function getString(something: string | number): string {
    return something.toString(); // string和number的共有属性，非共有属性就会报错
}

// 接口
interface Person {
    name: string;
    age?: number; //可选属性
    [propName: string]: any; // 任意属性 
    readonly id: number; // 只读属性，只能在创建的时候被赋值（只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候）
}
// 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集

// 数组
let fibonacci: number[] = [1,1,2,3,5];
// 数组泛型
let fibonacci2: Array<number> = [1, 1, 2, 3, 5];

interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}


// 函数声明
function sum(x: number, y: number) : number {
    return x + y;
}

// 函数表达式
let mySum: (x: number, y: number) => number = function (x: number, y: number) : number {
    return x + y;
}

function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}

declare const jQuery: (selector : string) => any;
// declare var 并没有真的定义一个变量，只是定义了全局变量jQuery的类型
// 仅用于编译时的检查，在编译结果中会被删除

// 第三方声明文件
// npm install @type/jquery

// declare var function class enum namespace interface和type glbal module

// 只有 function、class 和 interface 可以直接默认导出，其他的变量需要先定义出来，再默认导出

// 内置对象 
// Boolean, Error, Date, RegExp等
// Document, HTMLElement, Event, NodeList等

// 类型别名
type Name = string;
type NameResolver = () => string;
type NameOrResolver =  Name | NameResolver;
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

// 元组
let tuple : [string, number];
tuple = ['Tom', 25];

// 枚举
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};



class Animal {
    static isAnimal (a) {
        return a instanceof Animal;
    }
    constructor (name: string) {
        this.name = name;
    }
    sayhi () {
        return `My name is ${this.name}`;
    }
    get name () {
        return this.name;
    }
    set name (value) {
        console.log(`setter: ${value}`);
    }
}

class Cat extends Animal {
    constructor (name: string) {
        super(name);
        console.log(this.name);
    }
    sayHi() {
        return `Meow, ${super.sayhi()}`;
    }
}

// 接口可以对类的一部分进行抽象抽象
interface Alarm {
    alert(): void;
}
interface Light {
    lightOn() : void;
    lightOff() : void;
}
class Door {

}
interface LightableAlarm extends Alarm {
    lightOn() : void;
    lightOff() : void;
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}
class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn () {

    }
    lightOff() {

    }
}

// 定义泛型：在函数名后面添加T
function createArray<T>(length: number, value: T): Array<T> {
    return Array.apply(null, Array(length)).map(() => value);
}
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}
// 泛型约束
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
// 泛型接口
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}
let createArray2: CreateArrayFunc<any>;
createArray2 = function <T>(length: number, value: T): Array<T> {
    return Array.apply(null, Array(length)).map(() => value);
}

class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {return x + y;}


// ESLint + typescript-eslint-parser 可检查TypeScript代码
// TypeScript关注的是类型的匹配，而不是代码风格，
// 代码检查的是代码风格，方便多人协作开发，提高代码的可理解性和可维护性
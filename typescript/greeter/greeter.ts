/*
npm install -g typescript
tsc greeter.ts 命令将greeter.ts文件编译生成greeter.js
*/ 
class Student {
    fullName: string;
    constructor (public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: any) {
    if (person.fullName) {
        return 'Hello, ' + person.fullName;
    }
    return 'Hello, ' + person.firstName + ' ' + person.lastName;
}

let user = { firstName: 'Tom', lastName: 'cat'};
let student = new Student('Jane', 'M.' ,'User');

document.getElementById('greeter').innerHTML = greeter(user) + greeter(student);
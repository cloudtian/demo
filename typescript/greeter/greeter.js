/*
npm install -g typescript
tsc greeter.ts 命令将greeter.ts文件编译生成greeter.js
*/
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastName;
    }
    return Student;
}());
function greeter(person) {
    if (person.fullName) {
        return 'Hello, ' + person.fullName;
    }
    return 'Hello, ' + person.firstName + ' ' + person.lastName;
}
var user = { firstName: 'Tom', lastName: 'cat' };
var student = new Student('Jane', 'M.', 'User');
document.getElementById('greeter').innerHTML = greeter(user) + greeter(student);

import _ from 'lodash';
import './asset/font/iconfont.css';
import './index.css';
import catImage from './asset/image/cat.jpg';

import {cube} from './math';

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

// function getComponent() {
//     return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
//         var element = document.createElement('div');
//         var btn = document.createElement('button');

//         element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//         // element.classList.add('hello');

//         // 将图像添加到我们现有的div
//         // var myIcon = new Image();
//         // myIcon.src = catImage;

//         btn.innerHTML = 'Click me and check the console!';
//         btn.onclick = printMe;

//         var preEl = document.createElement('pre');
//         preEl.innerHTML = '5 cubed is equal to ' + cube(5);

//         element.appendChild(btn);
//         element.appendChild(preEl);
    
//         return element;
//     }).catch(error => 'An error occurred while loading the component')
    
// }

function component() {
    var element = document.createElement('div');
    var button = document.createElement('button');
    var br = document.createElement('br');

    button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.appendChild(br);
    element.appendChild(button);

    // Note that because a network request is involved, some indication
    // of loading would need to be shown in a production-level site/app
    button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
        // 注意当调用 ES6 模块的 import() 方法（引入模块）时，
        // 必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。
        var print = module.default;
        print();
    });

    return element;
}

// getComponent().then(component => {
//     document.body.appendChild(component);
// });

document.body.appendChild(component());

// if (module.hot) {
//     module.hot.accept('./print.js', function () {
//         console.log('Accepting the updated printMe module!');
//         document.body.removeChild(element);

//         // element = component(); // 重新渲染页面后，component 更新 click 事件处理
//         // document.body.appendChild(element);

//         getComponent().then(component => {
//             document.body.appendChild(component);
//         });
//     });
// }
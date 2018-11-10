import _ from 'lodash';
import './asset/font/iconfont.css';
import './index.css';
import catImage from './asset/image/cat.jpg';
import printMe from './print';

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    // element.classList.add('hello');

    // 将图像添加到我们现有的div
    // var myIcon = new Image();
    // myIcon.src = catImage;

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);
  
    return element;
}

let element = component();
document.body.appendChild(element);

if (module.hot) {
    module.hot.accept('./print.js', function () {
        console.log('Accepting the updated printMe module!');
        document.body.removeChild(element);
        element = component(); // 重新渲染页面后，component 更新 click 事件处理
        document.body.appendChild(element);
    });
}
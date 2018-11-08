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
document.body.appendChild(component());
import _ from 'lodash';
import './asset/font/iconfont.css';
import './index.css';
import catImage from './asset/image/cat.jpg';


function component() {
    var element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // 将图像添加到我们现有的div
    var myIcon = new Image();
    myIcon.src = catImage;

    element.appendChild(myIcon);
  
    return element;
}
document.body.appendChild(component());
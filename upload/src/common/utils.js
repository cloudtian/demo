// 断点续传，断点：原理是使用XMLHttpRequest的abort方法，可以取消一个xhr请求的发送
// 为此需要将上传的每个切片的xhr对象保存起来
export const request = function({
    url,
    method = 'post',
    data,
    headers = {},
    onProgress = e => e, // XMLHttpRequest 原生支持上传进度的监听，只需要监听 upload.onprogress 即可
    requestList
}) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress;
        xhr.open(method, url);
        Object.keys(headers).forEach(k => {
            xhr.setRequestHeader(k, headers[k]);
        });
        xhr.send(data);
        xhr.onload = e => {
            if (requestList) { // 将请求成功的xhr从列表中删除
                const xhrIndex = requestList.findIndex(item => item === xhr);
                requestList.splice(xhrIndex, 1);
            }
            resolve({
                data: e.target.response
            });
        };
        requestList?.push(xhr); // 暴露当前xhr给外部
    });
}

function notify (status) {
    var color = {
        success: '#71d259',
        fail: '#ec1616'
    }
    function generateDom (text) {
        var div = document.createElement('div');
        div.setAttribute('style', {
            position: 'fixed',
            bottom: 0,
            right: 210,
            width: 200,
            backgroundColor: color[status]
        });
        div.textContent = text;
        document.body.appendChild(div);
        return div;
    }

    return function (text) {
        const div = generateDom(text);
        setTimeout(() => {
            div.remove();
        }, 2000);
    };
}
export const message = {
    success: notify('success'),
    fail: notify('fail')
};
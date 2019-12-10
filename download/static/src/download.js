/**
 * 使用按钮动态生成a标签
 * 缺点：1.不能使用post方法 2.不能再启动下载按钮时禁用按钮，下载完毕启用按钮
 * 
 **/
function download() {
    var a = document.createElement('a');
    var filename = 'b.xlsx';
    a.href = '/test.xlsx';
    a.download = filename;
    a.click();
}

/**
 * 使用XMLHttpRequest对象进行下载
 **/
function downloadXHR () {
    var xhr = new XMLHttpRequest();

    // 也可以使用post的方式
    xhr.open('GET', '/test.xlsx', true);

    // 返回类型blob
    xhr.responseType = 'blob';

    // 定义请求完成的处理函数，请求前也可以增加加载框，禁用下载按钮等逻辑
    // 请求完成
    xhr.onload = function () {

        // 返回200
        if (this.status === 200) {
            var blob = this.response;
            var reader = new FileReader();
            
            // 转换为base64，可以直接放入a标签的href
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
                // 转换完成，创建一个a标签用于下载
                var a = document.createElement('a');
                a.download = 'c.xlsx';
                a.href = e.target.result;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                // 如果浏览器中无法触发click，可以先把a标签添加到DOM上然后click后再移除
            }
        }
    }

    // 发送ajax请求
    xhr.send();
}

async function downloadFetch () {
    const res = await fetch('/test.xlsx', {
        method: 'GET'
    });
    const blob = await res.blob();

    const a = document.createElement('a');

    // createObjectURL静态方法会创建一个DOMString，其中包含一个表示参数中给出的对象的URL。
    // 这个新的URL对象表示指定的File对象或Blob对象
    a.href = window.URL.createObjectURL(blob);
    a.download = 'd.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function downloadFetchPost () {

    // 可以通过name来设置下载文件名，不设置则使用服务器端默认的：/post-method-file?name=aaa.xlsx
    const res = await fetch('/download/file', {
        method: 'POST'
    });
    const blob = await res.blob();

    const a = document.createElement('a');

    a.href = window.URL.createObjectURL(blob);

    // 使用响应头中的文件名
    a.download = res.headers.get('Content-Disposition').split(';')[1].split('=')[1];
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

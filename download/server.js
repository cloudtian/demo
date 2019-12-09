let express = require('express');
let app = express();
let opn = require('opn');
let address = require('address');
const path = require('path');
const fs = require('fs');


let port = 8080;
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendfile('index.html');
});

app.use(express.static(path.join(__dirname, 'static')));
app.listen(port, () => {
    console.log('app listening');
});

app.post('/post-method-file', (req, res) => {
    fs.readFile(path.join(__dirname, 'file/test.xlsx'), function (isErr, data) {
        if (isErr) {
            res.end('Read file failed!');
            return;
        }
        res.writeHead(200, {

            // 告诉浏览器这是一个二进制文件
            'Content-Type': 'application/octet-stream',

            // 告诉浏览器这是一个需要下载的文件
            'Content-Disposition': `attachment; filename=${req.query.name || 'test.xlsx'}`
        });
        res.end(data);
    });
});

// 自动打开浏览器
opn(`http://${address.ip()}:${port}`);
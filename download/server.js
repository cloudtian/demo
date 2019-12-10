let express = require('express');
let app = express();
let opn = require('opn');
let address = require('address');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: path.join(__dirname, 'uploads/')});

let port = 8080;
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendfile('index.html');
});

app.use(express.static(path.join(__dirname, 'static')));
app.listen(port, () => {
    console.log('app listening');
});

// 下载模块
app.post('/download/file', (req, res) => {
    let name = req.query.name || 'test.xlsx';
    fs.readFile(path.join(__dirname, `file/${name}`), function (isErr, data) {
        if (isErr) {
            res.end('Read file failed!');
            return;
        }
        res.writeHead(200, {

            // 告诉浏览器这是一个二进制文件
            'Content-Type': 'application/octet-stream',

            // 告诉浏览器这是一个需要下载的文件
            'Content-Disposition': `attachment; filename=${name}`
        });
        res.end(data);
    });
});


// 上传模块
app.get('/upload/get-files', (req, res) => {
    fs.readdir(path.join(__dirname, 'file'), (err, files) => {
        console.log('files:', files); // 打印文件名数组
        if (err) {
            res.end('Read file failed!');
            return;
        }
        res.end(JSON.stringify({
            list: files
        }));
    });
});
app.post('/upload/save-file', upload.any(), (req, res) => {
    let file = req.files[0];

    fs.readFile(file.path, (err, data) => {
        fs.writeFile(path.join(__dirname, `file/${file.originalname}`), data, (err) => {
            let response = err ? 'upload failed!' : 'upload success!';
            res.end(JSON.stringify({
                message: response
            }));
        });
    });
});
app.get('/upload/download-file', (req, res) => {
    let name = req.query.name || 'test.xlsx';
    fs.readFile(path.join(__dirname, `file/${name}`), function (isErr, data) {
        if (isErr) {
            res.end('Read file failed!');
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${name}`
        });
        res.end(data);
    });
})

// 自动打开浏览器
opn(`http://${address.ip()}:${port}`);
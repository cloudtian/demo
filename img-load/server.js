let express = require('express');
let app = express();
let opn = require('opn');
let address = require('address');
let path = require('path');

let port = 8080;
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendfile('index.html');
});

app.use(express.static(path.join(__dirname, 'static')));
app.listen(port, () => {
    console.log('app listening');
});

// 自动打开浏览器
opn(`http://${address.ip()}:${port}`);
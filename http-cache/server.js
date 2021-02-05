const express = require('express')
const app = express()
const port = 3001

// 设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

let count = {
    test: 0,
    expires: 0,
    maxage: 0,
    nocache: 0,
    etag: 0
};

// 测试接口
app.get('/test', (req, res) => {
    count.test++;
    res.send(`test api success, count: ${count.test}`)
})

// 时间判断：过期时间（日期）
app.get('/expires', (req, res) => {
    console.log('expires', ++count.expires);
    let date= new Date();
    date.setSeconds(date.getSeconds() + 5); // 有效时常5s
    res.setHeader('expires', date.toGMTString());
    res.send(`expires`);
})

// 时间判断：有效时间（秒数） 浏览器返回状态码为200 ok (from disk cache) 及没有向服务器再验证
app.get('/max-age', (req, res) => {
    console.log('max-age', ++count.maxage);
    let seconds = 5; // 设置5s后过期
    res.setHeader('cache-control', `max-age=${seconds}`)
    res.send(`max-age`);
})

// no-store, no-cache, must-revalidate, 
app.get('/no-cache', (req, res) => {
    console.log('no-cache', ++count.nocache);
    res.setHeader('cache-control', 'no-cache')
    res.send(`no-cache`);
})

// 实体判断：etag
app.get('/etag', (req, res) => {
    let code = 200;
    res.setHeader('cache-control', `max-age=0`)
   
    // 判断etag是否一致，一致则直接返回304，不返回数据
    if (req.headers['if-none-match']) {
        code = 304;
        res.status(code).end()
    } else {
        res.send(`etag`);
    }
    console.log('etag', ++count.etag, ` ${code}`);
})

app.listen(port, () => console.log(`listening on port ${port}`))
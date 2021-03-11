const http = require('http');
const path = require('path');
const fse = require('fs-extra');
const multiparty = require('multiparty');
const server = http.createServer();

const UPLOAD_DIR = path.resolve(__dirname, '..', 'target'); // 大文件存储目录

const getTempDir = (filename) => {
    return path.resolve(UPLOAD_DIR, filename.split('.')[0]);
}
const resolvePost = req => {
    return new Promise(resolve => {
        let chunk = '';
        req.on('data', data => {
            chunk += data;
        });
        req.on('end', () => {
            resolve(JSON.parse(chunk));
        });
    });
}

const pipeStream = (path, writeStream) => {
    return new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        readStream.on('end', () => { //数据被消费掉后触发
            fse.unlinkSync(path); // 删除path及其所引用文件
            resolve();
        });
        readStream.pipe(writeStream);
    });
}

const mergeFileChunk = async (filePath, filename, size) => {
    const chunkDir = getTempDir(filename);
    const chunkPaths = await fse.readdir(chunkDir); // 返回目录中文件的名称的数组
    chunkPaths.sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1])); // 排序
    const chunkList = chunkPaths.map((chunkPath, index) => {
        return pipeStream(
            path.resolve(chunkDir, chunkPath),
            fse.createWriteStream(filePath, {
                flags: 'r+',
                start: index * size,
                end: (index + 1) * size
            })
        );
    });
    await Promise.all(chunkList);
    fse.rmdirSync(chunkDir);//合并后删除保存切片的目录
};

server.on('request', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.status = 200;
        res.end();
        return;
    }

    console.log(req.url);
    if (req.url === '/merge') {
        const data = await resolvePost(req);
        const {filename, size} = data;
        const filePath = path.resolve(UPLOAD_DIR, `${filename}`);
        await fse.writeFile(filePath, ''); // 需要新建文件
        await mergeFileChunk(filePath, filename, size);
        res.end(JSON.stringify({
            code: 0,
            message: 'file merged success'
        }));
    }

    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }
        const [chunk] = files.chunk;
        const [hash] = fields.hash;
        const [filename] = fields.filename;
        const chunkDir = getTempDir(filename);

        // 切片目录不存在，创建切片目录
        if (!fse.existsSync(chunkDir)) {
            await fse.mkdirs(chunkDir);
        }

        // fs-extra 专用方法，类似 fs.rename 并且跨平台
        // fs-extra 的 rename 方法 windows 平台会有权限问题
        await fse.move(chunk.path, `${chunkDir}/${hash}`);
        res.end('received file chunk');
    });
});

server.listen(8009, () => console.log('listening 8009'));
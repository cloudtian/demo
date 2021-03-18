// 由于实例化web-worker时，参数是一个js文件路径且不能跨域，
// 所以单独创建该hash.js文件放在public目录下
// 另外，worker中是不允许操作dom元素的，但它提供了importScripts函数用于导入外部脚本，通过它导入spark-md5
const self = this; // 与当前window不同的另一个全局上下文

self.importScripts('/spark-md5.min.js');
self.onmessage = e => {
    const { fileChunkList } = e.data; // fileChunkList文件切片
    const spark = new self.SparkMD5.ArrayBuffer();
    let percentage = 0;
    let count = 0;
    const loadNext = index => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(fileChunkList[index].file); // 利用FileReader读取每个切片的ArrayBuffer
        reader.onload = e => {
            count++;
            spark.append(e.target.result); // 传入spark-md5
            if (count === fileChunkList.length) {
                self.postMessage({ // 全部发送完，将最终hash发送给主线程
                    percentage: 100,
                    hash: spark.end()
                });
                self.close();
            } else {
                percentage += 100 / fileChunkList.length;
                self.postMessage({ // 每计算完一个切片发送一个进度事件
                    percentage
                });
                loadNext(count);
            }
        };
    };
    loadNext(0);
};

// spark-md5 需要根据所有切片才能算出一个 hash 值，不能直接将整个文件放入计算，否则即使不同文件也会有相同的 hash，具体可以看官方文档

// worker
// 可由脚本创建的后台任务，任务执行中可以向其创建者收发信息。
// 要创建一个Worker，只须调用Worker(url)构造函数，函数参数url为指定的脚本。
// 主线程和worker线程之间通过onmessage事件来接收信息。传递信息包含在Message这个时间的data属性内，数据的交互方式是传递副本而不是直接共享数据
// 主线程和worker线程之间使用postMessage()方法来发送信息

// 通过使用Web Workers，Web应用程序可以在独立于主线程的后台线程中，运行一个脚本操作。
// 可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）不会因此被阻塞/放慢
// worker可以另外生成新的worker

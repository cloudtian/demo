<template>
  <div>
    <input type="file" @change="onFileChange">
    <button @click="onUpload">upload</button>
    <button @click="onPause" v-if="!isPause">pause</button>
    <button @click="onResume" v-else>resume</button>
    <div>
      计算文件hash进度
      <br>
      <div class="progress-outer" :style="{width: length + 'px'}">
        <div class="progress-inner" :style="{width: hashPercentage / 100 * length + 'px'}"></div>
      </div>
      {{hashPercentage + '%'}}
      <br>总进度
      <br>
      <div class="progress-outer" :style="{width: length + 'px'}">
        <div class="progress-inner" :style="{width: fakeUploadedPercentage / 100 * length + 'px'}"></div>
      </div>
      {{fakeUploadedPercentage + '%'}}
      <br>
      <table>
        <tr>
          <th>切片</th>
          <th>大小</th>
          <th>进度</th>
        </tr>
        <tr v-for="d in data" :key="d.name">
          <td>{{d.hash}}</td>
          <td>{{d.chunk.size}}</td>
          <td>
            <div class="progress-outer" :style="{width: length + 'px'}">
              <div class="progress-inner" :style="{width: d.percentage / 100 * length + 'px'}"></div>
            </div>
            {{d.percentage + '%'}}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {request, message} from "../common/utils";

const SIZE = 1 * 1024 * 1024; // 切片大小 1M

export default {
  name: "uploader",
  props: {
    msg: String
  },
  data() {
    return {
      file: null,
      hash: "", // 文件hash，用于前后端判断是否是上传过的文件
      hashPercentage: 0, // 计算文件hash的进度
      worker: null,
      data: [],
      length: 200,
      isPause: false,
      fakeUploadedPercentage: 0,
      requestList: []
    };
  },

  computed: {
    uploadPercentage() {
      if (!this.file || !this.data.length) return 0;
      const loaded = this.data
        .map(i => i.chunk.size * i.percentage)
        .reduce((acc, cur) => acc + cur);
      return parseInt((loaded / this.file.size).toFixed(2), 10);
    }
  },

  watch: {
     uploadPercentage(now) {
      this.fakeUploadedPercentage = Math.max(this.fakeUploadedPercentage, now);
     }
  },

  methods: {
    onFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.file = file;
    },

    // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) }); // 使用到Blob.prototype.slice方法进行切片处理
        cur += size;
      }
      return fileChunkList;
    },

    // 生成文件hash，使用到了web-worker
    calculateHash(fileChunkList) {
      return new Promise(resolve => {
        // 添加worker属性
        this.worker = new Worker("/hash.js");
        this.worker.postMessage({ fileChunkList });
        this.worker.onmessage = e => {
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          if (hash) {
            resolve(hash);
          }
        };
      });
    },

    // 改造calculateHash(时间切片计算文件hash)
    async calculateHash2 (chunks) {
      return new Promise(resolve => {
        const spark = new SparkMD5.ArrayBuffer();
        let count = 0;
        const appendToSpark = async file => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = e => {
              spark.append(e.target.result);
              resolve();
            }
          });
        }
        const workLoop = async deadline => {
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            await appendToSpark(chunks[count].file);
            count++;
            if (count < chunks.length) {
              this.hashProgress = Number(((100*count)/chunks.length).toFixed(2));
            } else {
              this.hashPercentage = 100;
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop);
        }
        window.requestIdleCallback(workLoop);
      });
    },

    async verifyUpload(filename, filehash) {
      const { data } = await request({
        url: "http://localhost:8009/verify",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({
          filename,
          filehash
        })
      });
      return JSON.parse(data);
    },

    async onUpload() {
      if (!this.file) return;
      const fileChunkList = this.createFileChunk(this.file); // 文件进行切片处理
      this.hash = await this.calculateHash(fileChunkList); // 生成文件hash

      const { shouldUpload, uploadedList } = await this.verifyUpload(
        this.file.name,
        this.hash
      ); // 校验，当前文件是否还需要上传，如果服务器端已存在该文件，则无需上传直接提示上传成功（即秒传），获取已上传部分的片段

      if (!shouldUpload) {
        message.success("秒传：上传成功");
        return;
      }

      this.data = fileChunkList.map(({ file }, index) => ({
        filehash: this.hash,
        chunk: file,
        index,
        hash: this.hash + "-" + index, // 切片hash
        percentage: uploadedList.includes(index) ? 100 : 0 // 切片上传进度，已上传完成标记为100%
      }));
      await this.uploadChunks(uploadedList);
    },

    async uploadChunks(uploadedList = []) {
      const requestList = this.data
        .filter(({hash}) => !uploadedList.includes(hash)) // 过滤掉已上传的切片
        .map(({ chunk, hash, index, filehash }) => { // 组装formData数据
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.file.name);
          formData.append("filehash", filehash);
          return { formData, index };
        })
        .map(async ({ formData, index }) => { // 构造切片上传请求
          await request({
            url: "http://localhost:8009",
            data: formData,
            onProgress: this.createProgressHandler(this.data[index]), // 用于更新每个切片上传的进度
            requestList: this.requestList // 保存每个切片上传情况
          });
        });
      await Promise.all(requestList); // 当所有切片上传完后，通知服务器进行合并文件
      if (uploadedList.length + requestList.length === this.data.length) {
          await this.mergeRequest();
      }
    },

    createProgressHandler(item) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100), 10);
      };
    },

    async mergeRequest() {
      await request({
        url: "http://localhost:8009/merge",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({
          filename: this.file.name,
          filehash: this.hash,
          size: SIZE
        })
      });
    },

    onPause () {
        this.isPause = true;
        this.requestList.forEach(xhr => xhr && xhr.abort());
        this.requestList = [];
    },

    async onResume () {
      this.isPause = false;
      const { uploadedList } = await this.verifyUpload(this.file.name, this.hash);
      await this.uploadChunks(uploadedList);
    }
  }
};
</script>

<style>
.progress-outer {
  display: inline-block;
  background-color: #ccc;
  height: 5px;
}
.progress-inner {
  background-color: #17c1c5;
  height: 5px;
}
</style>

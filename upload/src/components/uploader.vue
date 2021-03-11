<template>
  <div>
    <input type="file" @change="onFileChange">
    <button @click="onUpload">upload</button>
  </div>
</template>

<script>
import request from '../common/request';

const SIZE = 1 * 1024 * 1024; // 切片大小 1M

export default {
  name: 'uploader',
  props: {
    msg: String
  },
  data() {
    return {
      file: null,
      data: []
    }
  },
  methods: {

    onFileChange (e) {
      const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data()); // ?
      this.file = file;
    },

    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) }); // 超过后会是什么情况
        cur += size;
      }
      return fileChunkList;
    },

    async uploadChunks () {
      const requestList = this.data.map(({chunk, hash}) => {
          const formData = new FormData();
          formData.append('chunk', chunk);
          formData.append('hash', hash);
          formData.append('filename', this.file.name);
          return {formData};
      }).map(async ({formData}) => {
          await request({
            url: 'http://localhost:8009',
            data: formData
          });
      });

      // Promise.all(requestList).then(() => {
      //   this.mergeRequest();
      // });

      await Promise.all(requestList); 
      await this.mergeRequest();
    },

    async mergeRequest () {
      await request({
        url: 'http://localhost:8009/merge',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          filename: this.file.name,
          size: SIZE
        })
      });
    },

    async onUpload () {
      if (!this.file) return;
      const fileChunkList = this.createFileChunk(this.file);
      this.data = fileChunkList.map(({file}, index) => ({
        chunk: file,
        hash: this.file.name + '-' + index // 文件名加数组下标
      }));
      await this.uploadChunks();
    }
  }
}
</script>

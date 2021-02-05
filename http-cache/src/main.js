import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import axios from 'axios';

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$http = function (config = {}) {
    return axios({
        method: 'get',
        url: '/test',
        baseURL: 'http://172.23.60.30:3001/',
        ...config
      });
};
app.mount('#app')
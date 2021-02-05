<template>
    <table>
      <thead>
        <th>操作</th>
        <th>结果</th>
      </thead>
      <tbody>
        <tr v-for="g in grid" :key="g.id">
          <td><button @click="callFn(g.click, g.id)">{{g.text}}</button></td>
          <td><span>{{ g.content }}</span></td>
        </tr>
      </tbody>
    </table>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      content: '',
      grid: [{
        id: 1,
        click: 'test',
        text: '测试请求',
        url: '/test',
        content: ''
      },{
        id: 2,
        click: 'expires',
        text: '过期日期Expires',
        url: '/expires',
        content: ''
      },{
        id: 3,
        click: 'maxage',
        text: '有效时间',
        url: '/max-age',
        content: ''
      },{
        id: 4,
        click: 'nocache',
        text: 'no-cache',
        url: '/no-cache',
        content: ''
      },{
        id: 5,
        click: 'etag',
        text: 'ETag不变',
        url: '/etag',
        content: ''
      }]
    };
  },
  methods: {
    callFn (fnstr, id) {
      let g = this.grid.find(g => id === g.id);
      let index = this.grid.findIndex(g => id === g.id);

      if (typeof this[`on${fnstr}`] === 'function') {
        this[`on${fnstr}`](g);
        return;
      }
      if (g.url) {
        this.request(g.url).then((res) => {
          this.grid[index] = {
            ...this.grid[index],
            content: res.data
          };
        })
      }
    },
    request(url) {
      return this.$http({url});
    }
  }
}
</script>

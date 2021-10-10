import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { 
      path: '/', 
      component: '@/layouts/index',
      routes: [
        {path: '/', component: 'index'},
        {path: '/stats', component: 'stats'},
        {path: '/about', component: 'about'},
        {path: '/match/:id', component: 'match'},
      ] 
    },
  ],
  fastRefresh: {},
  chainWebpack(memo) {
    memo.module
      .rule('media')
      .test(/\.(mp3|4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
  }
});

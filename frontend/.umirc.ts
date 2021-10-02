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
});

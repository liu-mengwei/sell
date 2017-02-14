/*
 The Vue build version to load with the `import` command
 (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 */
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
import index from './common/stylus/index.styl';


Vue.use(VueRouter);
Vue.use(VueResource);



/* eslint-disable no-new */
const routes=[
  {path:'/goods',component:goods},
  {path:'/seller',component:seller},
  {path:'/ratings',component:ratings}
];

const router=new VueRouter({
  routes:routes
});

const app=new Vue({
  router:router,
  render:h=>h(App)
}).$mount('#app');

//router.push('/goods');

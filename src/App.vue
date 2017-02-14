<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view v-bind:seller="seller" :selectFoods="selectFoods" :favoriteFlag="favoriteFlag"
                   v-on:changeFavFlag="changeFavFlag"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/urlUtil';
  import {loadFromLocal} from './common/js/localStorageUtil';

  const ERR_OK = 0;

  export default{
    data: function () {
      return {
        seller: {
          //即时函数
          id: (() => {
            let obj = urlParse();
            return obj.id || '';
          })()
        },

        selectFoods: [],

        favoriteFlag: false
      };
    },

    created: function () {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          //给对象添加属性 把一个对象里的属性添加到另一个对象里
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });

      if (this.seller.id) {
        this.favoriteFlag = loadFromLocal(this.seller.id, 'favorite', false);
      }
    },

    methods: {
      changeFavFlag (favoriteFlag) {
        this.favoriteFlag = favoriteFlag;
      }
    },

    components: {
      'v-header': header
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  @import "./common/css/style.css"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.router-link-active
          color: rgb(240, 20, 20)
</style>

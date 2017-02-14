<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu">
        <li class="menu-item" v-show="goods.length>0" :class="{'currentIndex':goodIndex===index}"
            v-for="(good,index) in goods" @click="selectMenu(index,$event)">
            <span class="content border-1px"><span class="icon" v-show="good.type>0"
                                                   :class="classMap[good.type]"></span>{{good.name}}
            </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="good good-list-hook" v-for="(good,index) in goods"
            v-show="goods.length>0">
          <h1 class="good-name">{{good.name}}</h1>
          <ul>
            <li class="food border-1px" @click.stop="selectFood(food,$event)" v-for="food in good.foods"
                v-show="good.foods.length>0">
              <div class="img">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="sell-count">月售{{food.sellCount}}份</span>
                  <span class="good-rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now-price"><span class="dollar">¥</span>{{food.price}}</span>
                  <span class="old-price" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <v-cartcontrol :food="food"></v-cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-cart ref="cart" v-bind:deliveryPrice="seller.deliveryPrice" v-bind:minPrice="seller.minPrice"
            v-bind:selectFoods="selectFoods_com"></v-cart>
    <v-food :food="selectedFood" ref="foodComponent"></v-food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import cart from '../cart/cart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import food from '../../components/food/food.vue';
  import {arrayContains} from '../../common/js/arrayExtend';

  const ERR_OK = 0;

  export default{
    props: {
      seller: {
        type: Object
      },

      selectFoods: {
        type: Array,
        default () {
          return [];
        }
      }
    },

    data: function () {
      return {
        goods: [],
        classMap: [],
        goodHeights: [],
        foodScroll: {},
        menuScroll: {},
        scrollY: 0,
        selectedFood: {}// 被选择的商品
      };
    },

    computed: {
      goodIndex: function () {
        for (let i = 0; i < this.goodHeights.length; i++) {
          let height1 = this.goodHeights[i];
          let height2 = this.goodHeights[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },

      //和属性重名了，_com表示计算属性
      selectFoods_com: function () {
        let selectFoods = this.selectFoods;

        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            let pos = arrayContains(selectFoods, food);

            //如果food至少被选中了一个并且不在原来的数组中
            if (food.count && pos === -1) {
              selectFoods.push(food);
            }

            if (food.count === 0 && pos >= 0) {
              selectFoods.splice(pos, 1);
            }
          });
        });

        //发给父组件 后面发现不用这么传 这个默认是双向的
        //this.$emit('selectFoods', selectFoods);
        return selectFoods;
      }
    },

    created: function () {
      console.log('goods组件创建');

      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      //请求接口
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          Vue.nextTick(() => {
            this._initBScroll();
            this._getGoodHeight();
          });
        }
      });
    },

    methods: {
      _initBScroll: function () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true});
        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {probeType: 3, click: true});

        this.foodScroll.on('scroll', (pos) => {
          //debugger;
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },

      _getGoodHeight: function () {
        let goodHeight = 0;
        let goods = this.$refs.foodsWrapper.getElementsByClassName('good-list-hook');
        this.goodHeights.push(goodHeight);
        for (let i = 0; i < goods.length; i++) {
          goodHeight += goods[i].clientHeight;
          this.goodHeights.push(goodHeight);
        }
      },

      selectMenu: function (index, event) {
        if (!event._constructed) {
          return;
        }
        //拿到食物dom
        let goods = this.$refs.foodsWrapper.getElementsByClassName('good-list-hook');
        let good = goods[index];
        this.foodScroll.scrollToElement(good, 300);
      },

      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;//其实是给子组件传值
        this.$refs.foodComponent.showFood();
      }
    },

    destroyed () {
      console.log('goods组件销毁');
    },

    components: {
      'v-cart': cart,
      'v-cartcontrol': cartcontrol,
      'v-food': food
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .goods
    display: flex
    width: 100%
    position: absolute
    top: 174px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .menu
        .menu-item
          padding: 0 12px
          display: table
          font-size: 0
          min-height: 54px
          &.currentIndex
            font-weight: 200
            background-color: #ffffff
            margin-top: -1px
            position: relative
            z-index: 10
            .content
              border-none()
          .content
            display: table-cell
            vertical-align: middle
            width: 56px
            font-size: 12px
            line-height: 14px
            border-1px(rgba(7, 17, 27, 0.1))
            .icon
              display: inline-block
              width: 12px
              height: 12px
              background-size: 12px 12px
              background-repeat: no-repeat
              margin-right: 2px
              vertical-align: top
              &.decrease
                img-fit('decrease_3')
              &.discount
                img-fit('discount_3')
              &.guarantee
                img-fit('guarantee_3')
              &.invoice
                img-fit('invoice_3')
              &.special
                img-fit('special_3')
    .foods-wrapper
      flex: 1
      .good
        &.currentIndex
          font-weight: 200
          background-color: #ffffff
        .good-name
          background-color: #f3f5f7
          font-size: 12px
          color: rgb(147, 153, 159)
          padding: 7px 14px 7px 12px
          border-left: 2px solid #d9dde1
        ul
          .food
            margin: 18px
            padding-bottom: 18px
            font-size: 0
            display: flex
            border-1px(rgba(7, 17, 27, 0.1))
            &:last-child
              border-none()
            .img
              display: inline-block
              height: 57px
              flex: 0 0 57px
            .content
              display: inline-block
              vertical-align: top
              margin-left: 10px
              flex: 1
              .name
                font-size: 14px
                line-height: 14px
                margin-top: 2px
              .desc, .extra
                font-size: 10px
                color: rgb(147, 153, 159)
                margin-top: 6px
              .price
                position: relative
                top: 5px
                .now-price
                  font-size: 14px
                  font-weight: 700
                  color: red
                  margin-right: 8px
                  .dollar
                    font-size: 10px
                    font-weight: normal
                    margin-right: 2px
                .old-price
                  font-size: 10px
                  font-weight: 700
                  color: rgb(147, 153, 159)
                  text-decoration: line-through


</style>

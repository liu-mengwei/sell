<template>
  <div>
    <transition name="blur">
      <div class="blur" v-show="unfold" @click="toggleList()"></div>
    </transition>
    <div class="cart">
      <div class="desc-wrapper">
        <div class="shopping-cart" @click="toggleList()">
          <div class="span-cart" :class="{'highLight':totalCount>0}">
            <span class="img-cart icon-shopping_cart" :class="{'highLight':totalCount>0}"></span>
            <div class="ball-wrapper" v-for="(ball,index) in balls">
              <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
                <div class="ball" v-show="ball.show"></div>
              </transition>
            </div>
          </div>
          <div class="count-wrapper" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price">
          <!--字符串绑定object，后面的是条件，为true时应用前面的样式-->
          <span class="text" :class="{'highLight':totalCount>0}">￥{{totalPrice}}</span>
        </div>
      <span class="deliveryPrice">
        另需配送费￥{{deliveryPrice}}元
      </span>
      </div>
      <!--class绑定字符串变量-->
      <div class="pay-wrapper" :class="enough" @click.stop="payThis()">
        <span class="pay" :class="enough">{{pay}}</span>
      </div>
      <transition name="unfold">
        <div class="cart-detail" v-show="unfold">
          <div class="detail-header">
            <h1 class="text">购物车</h1>
            <span class="empty" @click="empty()">清空</span>
          </div>
          <div class="content" v-show="showList" ref="foodList">
            <ul class="food-list">
              <li class="food" v-show="food.count>0" v-for="food in selectFoods">
                <div class="content-wrapper border-1px">
                  <span class="name">{{food.name}}</span>
                  <span class="price">{{food.price*food.count}}</span>
                  <span class="rmb">￥</span>
                  <v-cartcontrol class="cartcontrol" :food="food"></v-cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import {eventHub} from '../eventHub/eventHub.js';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import BScroll from 'better-scroll';

  export default{
    data: function () {
      return {
        totalPrice: 0,
        balls: [
          {show: false, el: {}},
          {show: false, el: {}},
          {show: false, el: {}},
          {show: false, el: {}},
          {show: false, el: {}}
        ],
        dropBalls: [],
        unfold: false//默认展开为false，
      };
    },

    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      //已选择的商品通过父组件传过来
      selectFoods: {
        default () {
          return [{
            price: 24,
            count: 1
          }];
        }
      }
    },

    created: function () {
      //监听小球下落的事件
      eventHub.$on('drop', this._drop);
    },

    computed: {
      totalPrice () {
        let totolPrice = 0;
        for (let i = 0; i < this.selectFoods.length; i++) {
          totolPrice += this.selectFoods[i].price * this.selectFoods[i].count;
        }
        return totolPrice;
      },

      totalCount () {
        let totalCount = 0;
        this.selectFoods.forEach((food) => {
          totalCount += food.count;
        });
        return totalCount;
      },

      pay () {
        //三种状态
        if (this.totalPrice === 0) {
          return '￥' + this.minPrice + '元起送';
        }
        else if (this.totalPrice > 0 && this.totalPrice < this.minPrice) {
          return '还差' + (this.minPrice - this.totalPrice) + '元起送';
        }
        else {
          return '去结算';
        }
      },

      enough () {
        if (this.totalPrice >= this.minPrice) {
          return 'enough';
        }
        else {
          return 'not-enough';
        }
      },

      //设置购物框list是否显示
      showList () {
        let show = false;
        this.selectFoods.forEach((food) => {
          if (food.count > 0) {
            show = true;
          }
        });

        //可展开
        if (show === false) {
          this.unfold = false;
        }
        return show;
      }
    },

    methods: {
      _drop: function (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (ball.show === false) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },

      beforeEnter: function (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          //为了找出显示的小球
          if (ball.show === true) {
            //console.log(ball.el.getBoundingClientRect());
            let offset = ball.el.getBoundingClientRect();

            //小球向右偏移的距离
            let offsetX = offset.left - 32;
            let offsetY = -(window.innerHeight - offset.bottom - 22);
            //小球显示
            el.style.display = '';
            el.style.webkitTransform = 'translateX(' + offsetX + 'px) translateY(' + offsetY + 'px)';
          }
        }
      },

      enter: function (el) {
        /* eslint-disable no-unused-vars*/
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translateX(0) translateY(0)';
          el.style.transition = 'all 0.4s cubic-bezier(0.28,-0.4,0.97,0.65)';
        });
      },

      afterEnter: function (el) {
        //从数组中取出头元素
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },

      //展开购物车
      toggleList: function () {
        //如果是可展开的情况下才让它展开
        if (this.showList === true && this.unfold === false) {
          this.unfold = true;//展开
          this.$nextTick(() => {
            if (!this.foodListScroll) {
              this.foodListScroll = new BScroll(this.$refs.foodList, {click: true});
            }
            else {
              this.foodListScroll.refresh();
            }
          });
        }
        else if (this.unfold === true) {
          this.unfold = false;//折叠
        }
      },

      //清空购物车
      empty: function () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
        this.selectFoods.splice(0, this.selectFoods.length);
      },

      //结算
      payThis: function () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        else {
          window.alert(`需要支付${this.totalPrice}元`);
        }
      }

    },

    components: {
      'v-cartcontrol': cartcontrol
    }

  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .blur
    position: fixed
    width: 100%
    height: 100%
    left: 0
    top: 0
    z-index: 40
    background-color: rgba(7, 17, 27, 0.6)
    &.blur-enter
      opacity: 0
    &.blur-enter-active
      transition: all 0.4s ease
      background-color: rgba(7, 17, 27, 0.6)
    &.blur-leave
      background-color: rgba(7, 17, 27, 0.6)
    &.blur-leave-active
      transition: all 0.4s ease
      opacity: 0

  .cart
    display: flex
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    height: 48px
    z-index: 80
    .desc-wrapper
      flex: 1
      background-color: #141d27
      font-size: 0
      .shopping-cart
        display: inline-block
        position: relative
        top: -10px
        padding: 6px
        margin: 0 12px
        width: 44px
        height: 44px
        background-color: #141d27
        border-radius: 50%
        .span-cart
          width: 100%
          height: 100%
          background-color: #2a333b
          border-radius: 50%
          text-align: center
          &.highLight
            background-color: rgb(0, 160, 220)
          .img-cart
            font-size: 24px
            color: rgba(255, 255, 255, 0.4)
            line-height: 44px
            &.highLight
              color: rgb(255, 255, 255)
          .ball-wrapper
            position: absolute
            width: 16px
            height: 16px
            z-index: 200
            top: 20px
            left: 20px
            .ball
              width: 100%
              height: 100%
              border-radius: 50%
              background-color: rgb(0, 160, 220)
        .count-wrapper
          position: absolute
          background-color: rgb(240, 20, 20)
          width: 24px
          height: 16px
          color: rgb(255, 255, 255)
          font-size: 10px
          font-weight 700
          text-align: center
          line-height: 16px
          border-radius: 7px
          top: 0
          left: 32px
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display: inline-block
        margin: 12px 0
        padding: 4px 12px 4px 0
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        vertical-align: top
        .text
          font-size: 16px
          color: rgba(255, 255, 255, 0.4)
          font-weight: 700
          &.highLight
            color: rgb(255, 255, 255)
      .deliveryPrice
        font-size: 14px
        color: rgba(255, 255, 255, 0.4)
        font-weight: 200
        vertical-align: top;
        line-height: 48px;
        margin-left: 12px;
    .pay-wrapper
      flex: 0 0 105px
      text-align: center
      line-height: 48px
      &.enough
        background-color: #00b43c
      &.not-enough
        background-color: #2b333b
      .pay
        font-size: 14px
        font-weight: 700
        &.not-enough
          color: rgba(255, 255, 255, 0.4)
        &.enough
          color: rgb(255, 255, 255)
    .cart-detail
      width: 100%
      position: absolute
      top: 0
      left: 0
      z-index: -1
      transform: translateY(-100%)
      &.unfold-enter,&.unfold-leave-active
        transform: translateY(0)
      &.unfold-enter-active,&.unfold-leave-active
        transition: all 0.5s ease
      .detail-header
        background-color: #f3f5f7
        height: 40px
        padding: 0 18px
        border-top: 1px solid rgba(7, 17, 27, 0.1)
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .text
          display: inline-block
          line-height: 40px
          font-size: 14px
          font-weight: 200
          color: rgb(7, 17, 27)
        .empty
          line-height: 40px
          font-size: 12px
          color: rgb(0, 160, 220)
          float: right
          font-weight: 200
      .content
        max-height: 206px
        overflow: hidden
        background-color: rgb(255, 255, 255)
        .food
          padding: 0 18px
          height: 48px
          .content-wrapper
            border-1px(rgba(7, 17, 27, 0.1))
            .name
              font-size: 14px
              color: rgb(7, 17, 27)
              line-height: 48px
            .rmb
              float: right
              font-size: 10px
              font-weight: 700
              color: rgb(240, 20, 20)
              line-height: 48px
              margin-right: 2px
            .price
              float: right
              font-size: 14px
              font-weight: 700
              color: rgb(240, 20, 20)
              line-height: 48px
              margin-right: 98px
            .cartcontrol
              bottom: 4px


</style>

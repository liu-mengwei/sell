<template>
  <transition name="slide">
    <div class="foodDetail" v-show="showFlag" ref="foodDetailEl">
      <!--加content是因为要BSsroll要用到-->
      <div class="content">
        <div class="header">
          <img class="image" :src="food.image">
          <span class="icon-arrow_lift" @click="back()"></span>
        </div>
        <div class="title">
          <div class="top"><span class="name">{{food.name}}</span></div>
          <div class="middle">
            <span class="sellCount">月售{{food.sellCount}}份</span>
            <span class="goodPercent">好评率{{food.rating}}%</span>
          </div>
          <div class="bottom">
            <span class="price">￥{{food.price}}</span>
            <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            <transition name="fade">
              <div class="joinCart" v-show="food.count==0 || !food.count" @click.stop="joinCartFirst($event)">加入购物车
              </div>
            </transition>
            <v-cartcontrol class="cartcontrol" :food="food"></v-cartcontrol>
          </div>
        </div>
        <v-split></v-split>
        <div class="introduce-wrapper" v-show="food.info">
          <h1 class="introduce">商品介绍</h1>
          <p class="info">{{food.info}}</p>
        </div>
        <v-split v-show="food.info"></v-split>
        <v-ratingselect v-on:ratingTypeChange="changeRatingType" v-on:contentOnlyChange="changeContentOnly"
          :selectType="selectType" :contentOnly="contentOnly" :ratings="food.ratings"></v-ratingselect>
        <ul class="rating" v-show="food.ratings && food.ratings.length>0">
          <li class="rating-item border-1px" v-show="showRating(rating)" v-for="rating in food.ratings">
            <div class="user">
              <span class="username">{{rating.username}}</span>
              <img class="useravator" :src="rating.avatar" width="12" height="12">
            </div>
            <div class="time">{{rating.rateTime | formatDate(rating.rateTime)}}</div>
            <p class="rating-text">
              <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
              <span class="rating-content">{{rating.text}}</span>
            </p>
          </li>
        </ul>
        <div class="no-rating" v-show="!food.ratings || food.ratings.length === 0">目前暂无评论</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import {eventHub} from '../eventHub/eventHub';
  import Vue from 'vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date';

  const ALL = 2;
  //const POSITIVE = 1;
  //const NEGATIVE = 2;

  export default{
    data () {
      return {
        showFlag: false,
        //better-scroll

        selectType: ALL, //默认全部评价
        contentOnly: true, //只看有内容的
        scroll: null
      };
    },

    props: {
      food: {
        type: Object
      }
    },

    //注册一些监听事件 //注意 箭头函数回掉有陷阱，箭头函数绑定父上下文
    methods: {
      showFood () {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodDetailEl, {click: true});
          }
          //如果不这样写的话会引发问题，会出来多个scroll
          else {
            this.scroll.refresh();
          }
        });
      },

      back () {
        this.showFlag = false;
      },

      joinCartFirst (event) {
        if (!event._constructed) {
          return;
        }
        else {
          Vue.set(this.food, 'count', 1);
          eventHub.$emit('drop', event.target);
        }
      },

      //此条评价是否显示
      showRating (rating) {
        //排除没有内容的
        if (this.contentOnly === true && rating.text === '') {
          return false;
        }

        if (this.selectType === ALL) {
          return true;
        }
        else {
          return (this.selectType === rating.rateType);
        }
      },

      changeRatingType (ratingType) {
        this.selectType = ratingType;//这个操作会引发dom更新
        //dom更新后重新计算滚动高度
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },

      changeContentOnly (contentOnly) {
        this.contentOnly = contentOnly;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },

    filters: {
      formatDate (time) {
        return formatDate(new Date(time), 'yyyy-MM-dd hh:mm');
      }
    },

    components: {
      'v-cartcontrol': cartcontrol,
      'v-split': split,
      'v-ratingselect': ratingselect
    }

  };

</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/css/style.css";
  @import "../../common/stylus/mixin.styl";

  .foodDetail
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    width: 100%
    z-index: 30
    background-color: #ffffff
    &.slide-enter
      transform: translateX(100%)
    &.slide-enter-active
      transition: all 0.3s ease
    &.slide-leave
      transform: translateX(0)
    &.slide-leave-active
      transition: all 0.3s ease
      transform: translateX(100%)
    .header
      width: 100%
      height: 0
      padding-bottom: 100%
      .image
        position: absolute
        width: 100%
        height: 100%
      .icon-arrow_lift
        position: absolute
        padding: 10px
        top: 10px
        left: 10px
        font-size: 20px
    .title
      font-size: 0
      padding: 18px 18px
      .top
        .name
          font-size: 14px
          color: rgb(7, 17, 27)
          font-weight: 700
      .middle
        margin-top: 8px
        color: rgb(147, 153, 159)
        font-size: 0
        .sellCount
          font-size: 10px
          margin-right: 12px
        .goodPercent
          font-size: 10px
      .bottom
        position: relative
        margin-top: 18px
        height: 28px
        .price
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
          float: left
          margin-right: 12px
          line-height: 28px
        .oldPrice
          font-size: 10px
          font-weight: 700
          color: rgb(147, 153, 159)
          line-height: 28px
          text-decoration: line-through
        .joinCart
          position: absolute
          right: 0
          width: 78px
          height: 28px
          border-radius: 14px
          background-color: rgb(0, 160, 220)
          color: rgb(255, 255, 255)
          font-size: 10px
          line-height: 28px
          text-align: center
          z-index: 30
          &.fade-enter-active
            transition: all 0.3s
            opacity: 1
          &.fade-enter
            opacity: 0
          &.fade-leave
            opacity: 1
          &.fade-leave-active
            opacity: 0
            transition: all 0.3s
        .cartcontrol
          bottom: -4px
          right: -2px
    .introduce-wrapper
      padding: 18px
      .introduce
        margin-bottom: 6px
        font-weight: 700
        font-size: 14px
      .info
        padding: 0 8px
        font-size: 12px
        font-weight: 200
        color: rgb(77, 85, 93)
        line-height: 24px
    .rating
      margin: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.2))
        .user
          position: absolute
          right: 0
          top: 16px
          font-size: 0
          .username
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 12px
            margin-right: 6px
            vertical-align: top
          .avatar
            vertical-align: top
            line-height: 12px
        .time
          font-size: 10px
          line-height: 12px
          color: rgb(147, 153, 159)
          margin-bottom: 6px
        .rating-text
          font-size: 0
          .icon-thumb_up, .icon-thumb_down
            font-size: 12px
            margin-right: 4px
            vertical-align: top
            line-height: 16px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)
          .rating-content
            font-size: 12px
            color: rgb(7, 17, 27)
            vertical-align: top
            line-height: 16px
    .no-rating
      padding: 16px
      font-size: 12px
      color: rgb(147, 153, 159)


</style>



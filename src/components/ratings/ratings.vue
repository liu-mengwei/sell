<template>
  <div class="ratingComponent">
    <div class="wrapper" ref="ratingContent">
      <div class="rating-content">
        <div class="rating-header">
          <div class="header-left">
            <div class="score">{{seller.score}}</div>
            <div class="score-text">综合评分</div>
            <div class="better">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="header-right">
            <div class="row">
              <span class="row-text">服务态度</span>
              <v-star class="score-star" :size="36" :score="seller.serviceScore"></v-star>
              <span class="serviceScore">{{seller.serviceScore}}</span>
            </div>
            <div class="row">
              <span class="row-text">食物评分</span>
              <v-star class="score-star" :size="36" :score="seller.foodScore"></v-star>
              <span class="foodScore">{{seller.foodScore}}</span>
            </div>
            <div class="row">
              <span class="row-text">送达时间</span>
              <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <v-split></v-split>
        <v-ratingselect :desc='{all:"全部",positive:"满意",negative:"不满意"}'
                        :selectType='selectType' :contentOnly='contentOnly' :ratings='ratings'
                        v-on:ratingTypeChange="changeRatingType"
                        v-on:contentOnlyChange="changeContentOnly"></v-ratingselect>
        <div class="ratings-wrapper">
          <ul class="ratings-list" v-show="ratings.length>0">
            <li class="ratings-item" v-for="rating in ratings" v-show="showRating(rating)">
              <div class="user-avatar">
                <img :src="rating.avatar" width="28" height="28">
              </div>
              <div class="item-content">
                <span class="user-name">{{rating.username}}</span>
                <span class="rateTime">{{rating.rateTime | formatDate}}</span>
                <div class="row-middle">
                  <v-star class="user-score" :size='24' :score='rating.score'></v-star>
                  <span class="deliveryTime-text" v-show="rating.deliveryTime!==''">{{rating.deliveryTime}}分钟送达</span>
                </div>
                <p class="rating-text">
                  {{rating.text}}
                </p>
                <div class="row-bottom" v-show="rating.recommend && rating.recommend.length>0">
                  <span class="icon-thumb_up"></span>
                  <ul class="recommend-list">
                    <li class="recommend-item" v-for="recommend in rating.recommend">
                      <span class="recommend-name">{{recommend}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <v-cart ref="cart" v-bind:deliveryPrice="seller.deliveryPrice" v-bind:minPrice="seller.minPrice"
            v-bind:selectFoods="selectFoods"></v-cart>
  </div>
</template>


<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date';
  import cart from '../cart/cart.vue';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    data () {
      return {
        ratings: [],
        selectType: ALL, //默认全部评价
        contentOnly: true, //只看有内容的
        scroll: null
      };
    },

    created () {
      console.log('rating组件创建');

      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
        }
        this.$nextTick(() => {
          //初始化bsscroll
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.ratingContent, {click: true});
          }
          else {
            this.scroll.refresh();
          }
        });
      });
    },

    props: {
      seller: {
        type: Object,
        default () {
          return {};
        }
      },
      selectFoods: {
        type: Array,
        default () {
          return [];
        }
      }
    },

    methods: {
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

      //监听下面穿上来的事件
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

    destroyed () {
      console.log('rating组件销毁');
    },

    components: {
      'v-star': star,
      'v-split': split,
      'v-ratingselect': ratingselect,
      'v-cart': cart
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  @import "../../common/css/style.css";

  .ratingComponent
    .wrapper
      position: absolute
      left: 0
      top: 174px
      bottom: 48px
      width: 100%
      overflow: hidden
      .rating-content
        .rating-header
          padding: 18px 0
          display: flex
          border-bottom: 1px solid rgba(147, 153, 159, 0.2)
          .header-left
            flex: 0 0 160px
            text-align: center
            @media only screen and (max-width: 320px)
              flex: 0 0 120px
            .score
              font-size: 24px
              color: rgb(255, 153, 0)
              line-height: 28px
              margin-bottom: 6px
            .score-text
              font-size: 12px
              color: rgb(7, 17, 27)
              line-height: 12px
              margin-bottom: 8px
            .better
              font-size: 10px
              color: rgb(147, 153, 159)
              margin-bottom: 6px
          .header-right
            flex: 1
            padding: 0 20px 0 32px
            border-left: 1px solid rgba(147, 153, 159, 0.2)
            @media only screen and (max-width: 320px)
              padding: 0 6px 0 14px
            .row
              font-size: 0
              margin-bottom: 8px
              .row-text
                display: inline-block
                font-size: 12px
                color: rgb(7, 17, 27)
                vertical-align: top
                line-height: 18px
                margin-right: 12px
                @media only screen and (max-width: 320px)
                  margin-right: 2px
              .score-star
                display: inline-block
                margin-right: 12px
                position: relative
                top: 1px
                @media only screen and (max-width: 320px)
                  margin-right: 4px
              .serviceScore, .foodScore
                display: inline-block
                font-size: 12px
                color: rgb(255, 153, 0)
                line-height: 18px
                vertical-align: top
              .deliveryTime
                font-size: 12px
                color: rgb(147, 153, 159)
                line-height: 18px
        .ratings-wrapper
          padding: 0 18px
          .ratings-list
            .ratings-item
              position: relative
              .user-avatar
                position: absolute
                left: 0
                top: 18px
                width: 28px
                height: 28px
                img
                  border-radius: 50%
              .item-content
                margin-left: 40px
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                padding: 18px 0 14px 0
                .user-name
                  font-size: 10px
                  color: rgb(7, 17, 27)
                  line-height: 12px
                .rateTime
                  float: right
                  font-size: 10px
                  font-weight: 200
                  color: rgb(147, 153, 159)
                  line-height: 12px
                .row-middle
                  margin: 4px 0 6px 0
                  font-size: 0
                  .user-score
                    display: inline-block
                  .deliveryTime-text
                    vertical-align: top
                    font-size: 12px
                    color: rgb(147, 153, 159)
                    line-height: 12px
                    margin-left: 6px
                .rating-text
                  font-size: 12px
                  color: rgb(7, 17, 27)
                  line-height: 18px
                .row-bottom
                  margin-top: 8px
                  overflow: hidden
                  .icon-thumb_up
                    font-size: 12px
                    color: rgb(0, 160, 220)
                    line-height: 16px
                    vertical-align: top
                  .recommend-list
                    display: inline
                    .recommend-item
                      display: inline-block
                      padding: 0 6px
                      line-height: 16px
                      font-size: 12px
                      vertical-align: top
                      color: rgb(147, 153, 159)
                      max-width: 70px
                      overflow: hidden
                      text-overflow: ellipsis
                      white-space: nowrap
                      border: 1px solid rgba(7, 17, 27, 0.1)
                      border-radius: 1px
                      margin: 0 8px 4px 0


</style>


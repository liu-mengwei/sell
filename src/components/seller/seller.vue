<template>
  <div class="sellerComponent">
    <div class="seller-content" ref="sellerComponent">
      <!--bsscroll需要这里面的一个包装 即content-wrapper-->
      <div class="content-wrapper">
        <div class="seller-header">
          <div class="seller-title">
            <span class="seller-name">{{seller.name}}</span>
            <div class="seller-rating">
              <v-star class="seller-star" :size="36" :score="seller.score"></v-star>
              <span class="ratingCount">({{seller.ratingCount}})</span>
              <span class="sellCount">月售{{seller.sellCount}}单</span>
            </div>
            <div class="seller-favorite">
              <span class="icon-favorite" @click.stop="favorite($event)" :class="{'active':favoriteFlag}"></span>
              <span class="favorite-text">{{(favoriteFlag===true)?'已收藏':'收藏'}}</span>
            </div>
          </div>
          <div class="seller-basic">
            <div class="basic-block">
              <span class="block-text">起送价</span>
              <span class="block-value">{{seller.minPrice}}<span class="unit">元</span></span>
            </div>
            <div class="basic-block">
              <span class="block-text">商家配送</span>
              <span class="block-value">{{seller.deliveryPrice}}<span class="unit">元</span></span>
            </div>
            <div class="basic-block">
              <span class="block-text">平均配送时间</span>
              <span class="block-value">{{seller.deliveryTime}}<span class="unit">分钟</span></span>
            </div>
          </div>
        </div>
        <v-split></v-split>
        <div class="seller-supports">
          <h1 class="supports-title">公告与活动</h1>
          <p class="supports-info" v-show="seller.bulletin && seller.bulletin!==''">{{seller.bulletin}}</p>
          <ul class="supports-list" v-show="seller.supports && seller.supports.length>0">
            <li class="support-item" v-for="support in seller.supports">
              <span class="support-icon" :class="classMap[support.type]"></span>
              <span class="support-description">{{support.description}}</span>
            </li>
          </ul>
        </div>
        <v-split></v-split>
        <div class="seller-image" v-show="seller.pics && seller.pics.length>0">
          <h1 class="image-title">商家实景</h1>
          <div class="image-wrapper" ref="imageList">
            <ul class="image-list" ref="imageListEl">
              <li class="image-item" v-for="pic in seller.pics">
                <img width="120px" height="90px" :src="pic">
              </li>
            </ul>
          </div>
        </div>
        <v-split></v-split>
        <div class="seller-info">
          <h1 class="info-title">商家信息</h1>
          <ul class="info-list">
            <li class="info-item" v-for="info in seller.infos"><span class="info-text">{{info}}</span></li>
          </ul>
        </div>
      </div>
    </div>
    <v-cart ref="cart" v-bind:deliveryPrice="seller.deliveryPrice" v-bind:minPrice="seller.minPrice"
            v-bind:selectFoods="selectFoods"></v-cart>
  </div>
</template>


<script type="text/ecmascript-6">
  import split from '../split/split.vue';
  import star from '../star/star.vue';
  import BScroll from 'better-scroll';
  import cart from '../cart/cart.vue';
  import {saveToLocal} from '../../common/js/localStorageUtil';

  export default {

    data () {
      return {
        scroll: null, //大的滚动框
        imgListScroll: null,
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      };
    },

    created () {
      console.log('seller组件创建');
      this._initSellerScroll();
    },

    mounted () {
      console.log('seller mount方法执行');
      this._initImgListWidth();
      this._initImgListScroll();
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
      },
      favoriteFlag: {
        type: Boolean,
        default: false
      }
    },

    watch: {
      'seller' () {
        this.$nextTick(() => {
          this.scroll.refresh();
        });

        //这里需要用js原生方法设置宽度。
        this._initImgListWidth();
        this._initImgListScroll();
      }
    },

    methods: {
      favorite (event) {
        if (!event._constructed) {
          return;
        }
        this.favoriteFlag = !this.favoriteFlag; //基本值是传不到父组件上去的
        if (this.seller.id) {
          saveToLocal(this.seller.id, 'favorite', this.favoriteFlag);
        }
        this.$emit('changeFavFlag', this.favoriteFlag);
      },

      _initSellerScroll () {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.sellerComponent, {click: true});
          }
          else {
            this.scroll.refresh();
          }
        });
      },

      _initImgListScroll () {
        this.$nextTick(() => {
          if (!this.imgListScroll) {
            this.imgListScroll = new BScroll(this.$refs.imageList, {scrollX: true, eventPassthrough: 'vertical'});
          }
          else {
            this.imgListScroll.refresh();
          }
        });
      },

      _initImgListWidth () {
        let totalWidth = '';
        let width = 120;
        let margin = 6;
        if (this.seller.pics && this.seller.pics.length > 0) {
          totalWidth = (width + margin) * this.seller.pics.length - margin + 'px';
        }
        this.$refs.imageListEl.style.width = totalWidth;
      }
    },

    destroyed () {
      console.log('seller组件销毁');
    },

    components: {
      'v-split': split,
      'v-star': star,
      'v-cart': cart
    }

  };
</script>


<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";

  .sellerComponent
    .seller-content
      position: absolute
      left: 0
      top: 174px
      bottom: 48px
      width: 100%
      overflow: hidden
      .seller-header
        padding: 18px
        .seller-title
          position: relative
          padding-bottom: 18px
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .seller-name
            font-size: 14px
            color: rgb(7, 17, 27)
            line-height: 14px
            display: inline-block
            margin-bottom: 8px
          .seller-rating
            font-size: 0
            .seller-star
              display: inline
            .ratingCount, .sellCount
              font-size: 10px
              vertical-align: top
              line-height: 18px
              color: rgb(77, 85, 93)
            .ratingCount
              margin-left: 8px
              margin-right: 12px
          .seller-favorite
            position: absolute
            right: 0
            top: 4px
            text-align: center
            .icon-favorite
              font-size: 24px
              display: block
              color: rgb(147, 153, 159)
              &.active
                color: rgb(240, 20, 20)
            .favorite-text
              font-size: 10px
              color: rgb(77, 85, 93)
              line-height: 10px
        .seller-basic
          padding-top: 18px
          display: flex
          .basic-block
            flex: 1
            border-right: 1px solid rgba(7, 17, 27, 0.1)
            text-align: center
            .block-text
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 10px
              margin-bottom: 4px
              display: block
            .block-value
              font-size: 24px
              color: rgb(7, 17, 27)
              line-height: 24px
              .unit
                font-size: 10px
                margin-left: 2px
            &:last-child
              border-right: none
      .seller-supports
        padding: 18px 18px 0 18px
        .supports-title
          font-size: 14px
          margin-bottom: 8px
        .supports-info
          padding: 0 12px 16px 12px
          font-size: 12px
          line-height: 24px
          color: rgb(240, 20, 20)
        .supports-list
          .support-item
            padding: 16px 12px
            border-top: 1px solid rgba(147, 153, 159, 0.1)
          .support-icon
            display: inline-block
            width: 16px
            height: 16px
            background-size: 16px 16px
            background-repeat: no-repeat
            margin-right: 2px
            vertical-align: top
            &.decrease
              img-fit('decrease_4')
            &.discount
              img-fit('discount_4')
            &.guarantee
              img-fit('guarantee_4')
            &.invoice
              img-fit('invoice_4')
            &.special
              img-fit('special_4')
          .support-description
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 16px
      .seller-image
        padding: 18px 0 18px 18px
        .image-title
          font-size: 14px
          margin-bottom: 12px
        .image-wrapper
          white-space: nowrap
          overflow: hidden
          width: 100%
          .image-list
            .image-item
              display: inline-block
              margin-right: 6px
      .seller-info
        padding: 18px 18px 0 18px
        .info-title
          font-size: 14px
          margin-bottom: 12px
        .info-list
          .info-item
            padding: 16px 12px
            border-top: 1px solid rgba(7, 17, 27, 0.1)
            .info-text
              font-size: 12px
              color: rgb(7, 17, 27)
              line-height: 16px

</style>



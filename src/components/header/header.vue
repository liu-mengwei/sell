<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="header">
    <div class="header-title">
      <div class="avatar">
        <img width="64" height="64" class="avatar" v-bind:src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <div class="name">
            {{seller.name}}
          </div>
        </div>
        <span class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </span>
        <div class="supports" v-if="seller.supports">
          <span class="supports-img" v-bind:class="classMap[seller.supports[0].type]">
          </span>
          <span class="supports-description">
            {{seller.supports[0].description}}
          </span>
        </div>
      </div>
      <div v-if="seller.supports" class="supports-count" @click="showDetail()">
        <span class="count">
          {{seller.supports.length}}个
        </span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin" @click="showDetail()">
      <span class="bulletin-img"></span><span class="bulletin-text">
        {{seller.bulletin}}
      </span><span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img width="100%" height="100%" v-bind:src="seller.avatar" class="background-img">
    </div>
    <transition name="fade">
      <div v-show="detailFlag" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-content">
            <h2 class="seller-name">
              {{seller.name}}
            </h2>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <div class="supports" v-if="seller.supports">
              <div class="support-item" v-for="support in seller.supports">
                <span class="icon" :class="classMap[support.type]"></span>
                <span class="text">{{support.description}}</span>
              </div>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="detail-bulletin">
              <p class="content">
                {{seller.bulletin}}
              </p>
            </div>
          </div>

        </div>
        <div class="detail-close" @click="closeDetail">
          <i class="btn icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';

  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data: function () {
      return {
        detailFlag: false
      };
    },
    methods: {
      // 是否显示商家详情的标志
      showDetail: function () {
        this.detailFlag = true;
      },
      closeDetail: function () {
        this.detailFlag = false;
      }
    },
    created: function () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    components: {
      'star': star
    }

  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .header
    position: relative
    overflow: hidden
    width: 100%
    color: rgb(255, 255, 255)
    background: rgba(7, 17, 27, 0.5)
    font-size: 0
    .header-title
      position: relative
      padding: 24px 12px 18px 24px
      .avatar
        display: inline-block
        vertical-align: top
        border-radius: 2px
      .content
        display: inline-block
        font-size: 14px
        margin-left: 16px
        .brand
          display: inline-block
          width: 30px
          height: 18px
          img-fit('brand')
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          display: inline-block
          font-weight: bold
          vertical-align: top
          margin-top: 2px
          margin-bottom: 8px
          margin-left 6px
        .description
          display: inline-block
          margin-bottom: 10px
          font-size: 12px
        .supports
          font-size: 0px
          .supports-img
            display: inline-block
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              img-fit('decrease_1')
            &.discount
              img-fit('discount_1')
            &.guarantee
              img-fit('guarantee_1')
            &.invoice
              img-fit('invoice_1')
            &.special
              img-fit('special_1')
          .supports-description
            font-size: 10px
            line-height: 12px
            vertical-align: top
            margin-left: 4px
    .supports-count
      position: absolute
      width: 48px
      height: 24px
      bottom: 18px
      right: 24px
      border-radius: 14px
      font-size: 10px
      font-weight: 200
      line-height: 24px
      text-align: center
      background-color: rgba(0, 0, 0, 0.2)
      .count
        margin-left: 3px
        vertical-align: top
      .icon-keyboard_arrow_right
        line-height: 24px
    .bulletin
      position: relative
      padding: 0 26px 0 12px
      height: 28px
      line-height: 28px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background-color: rgba(7, 17, 27, 0.2)
      font-size: 10px
      .bulletin-img
        display: inline-block
        width: 30px
        height: 18px
        img-fit('bulletin')
        background-size: 30px 18px
        background-repeat: no-repeat
        margin-top: 5px
      .bulletin-text
        vertical-align: top
        margin-left: 4px
      .icon-keyboard_arrow_right
        position: absolute
        right: 12px
        bottom: 7px
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      -webkit-filter: blur(10px)
    .fade-enter-active, .fade-leave
      opacity: 1
      transition: all .5s
      background: rgba(7, 17, 27, 0.8)
    .fade-enter, .fade-leave-active
      opacity: 0
      transition: all .5s
      background: rgba(7, 17, 27, 0)
    .detail
      position: fixed
      left: 0
      top: 0
      z-index: 100
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.8)
      .detail-wrapper
        width: 100%
        min-height: 100%
        .detail-content
          font-size: 12px
          height: 100%
          margin-top: 64px
          padding-bottom: 64px
          text-align: center
          .seller-name
            font-size: 16px
            font-weight: 700
            line-height: 16px
          .star-wrapper
            margin-top: 16px
            text-align: center
          .title
            display: flex
            padding: 28px 36px 24px 36px
            .line
              display: inline-block
              flex: 1
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
              position: relative
              bottom: 6px
            .text
              display: inline-block
              padding: 0px 12px
              font-size: 14px
              font-weight: 700
          .supports
            padding: 0 36px
            text-align: left
            font-size: 0
            .support-item
              margin-bottom: 12px
              .icon
                display: inline-block
                width: 16px
                height: 16px
                background-size: 16px 16px
                background-repeat: no-repeat
                vertical-align: top
                margin: 0 6px 0 12px
                &.decrease
                  img-fit('decrease_2')
                &.discount
                  img-fit('discount_2')
                &.guarantee
                  img-fit('guarantee_2')
                &.invoice
                  img-fit('invoice_2')
                &.special
                  img-fit('special_2')
              .text
                font-size: 12px
                font-weight: 200
                line-height: 16px
          .detail-bulletin
            padding: 0 48px
            text-align: left
            .content
              font-size: 12px
              line-height: 24px
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        font-size: 32px
</style>


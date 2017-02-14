<template>
  <div class="ratingselect">
    <h1 class="rating-title">商品评价</h1>
    <div class="rating-type border-1px">
      <span class="block positive" @click="changeRatingType(2,$event)"
            :class="{'active':ratingType == 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" @click="changeRatingType(0,$event)" :class="{'active':ratingType == 0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span class="block negative" @click="changeRatingType(1,$event)" :class="{'active':ratingType == 1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div class="content-only" @click="toggleContent($event)">
      <span class="icon-check_circle" :class="{'on':m_contentOnly}"></span>
      <span class="only-text">只看有内容的评价</span>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  const ALL = 2;
  const POSITIVE = 0;
  const NEGATIVE = 1;

  export default {
    data () {
      //接受传进来的值 props不允许改值
      return {
        ratingType: this.selectType,
        m_contentOnly: this.contentOnly
      };
    },

    props: {
      ratings: {
        type: Array,
        default () {
          return [];
        }
      },

      //组件所传进来的三个类别之一
      selectType: {
        type: Number,
        default: ALL
      },

      contentOnly: {
        type: Boolean,
        default: true
      },

      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          };
        }
      }
    },

    methods: {
      changeRatingType (ratingType, event) {
        if (!event._constructed) {
          return;
        }
        this.ratingType = ratingType;
        //给父组件传值
        this.$emit('ratingTypeChange', this.ratingType);
      },

      //切换是否只显示内容
      toggleContent (event) {
        if (!event._constructed) {
          return;
        }
        this.m_contentOnly = !this.m_contentOnly;
        this.$emit('contentOnlyChange', this.m_contentOnly);
      }
    },

    computed: {
      //正面评价
      positives () {
        let arr = this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
        return arr;
      },

      negatives () {
        let arr = this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
        return arr;
      }
    }

  };

</script>


<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl";

  .ratingselect
    border-bottom: 1px solid rgba(147, 153, 159, 0.2)
    .rating-title
      padding: 18px 18px 6px 18px
      font-weight: 700
      font-size: 14px
    .rating-type
      margin: 12px 18px 0 18px
      padding-bottom: 18px
      font-size: 0
      border-1px(rgba(7, 17, 27, 0.1))
      .block
        display: inline-block
        border-radius: 1px
        text-align: center
        line-height: 36px
        color: rgb(77, 85, 93)
        font-size: 12px
        padding: 0 12px
        margin-right: 8px
        &.positive
          background-color: rgba(0, 160, 220, 0.2)
          &.active
            background-color: rgb(0, 160, 220)
            color: #ffffff
        &.negative
          background-color: rgba(77, 85, 93, 0.2)
          &.active
            background-color: rgb(77, 85, 93)
            color: #ffffff
        .count
          font-size: 8px
          margin-left: 2px
    .content-only
      padding: 12px 18px 12px 18px
      .icon-check_circle
        vertical-align: top
        font-size: 24px
        color: rgb(147, 153, 159)
        &.on
          color: #00c850
      .only-text
        vertical-align: top
        line-height: 24px
        font-size: 12px
        color: rgb(147, 153, 159)

</style>

<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="star" v-bind:class="starType">
    <span class="star-item" v-for="itemClass in itemClasses" v-bind:class="itemClass">
    </span>
  </div>
</template>


<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_OFF = 'off';
  const CLS_HALF = 'half';

  export default{
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },

    computed: {
      starType: function () {
        return 'star-' + this.size;
      },

      itemClasses: function () {
        let itemClasses = [];

        // 获得传进来的商家分数
        let score = Math.floor(this.score * 2) / 2;// 向0.5取整
        let hasDecimals = (score % 1) !== 0;

        // 获得整数部分
        let integer = Math.floor(score);
        for (let i = 1; i <= integer; i++) {
          itemClasses.push(CLS_ON);
        }

        // 如果有小数部分
        if (hasDecimals) {
          itemClasses.push(CLS_HALF);
        }
        // 剩下的没有星的部分
        let i = 0;
        while (i < LENGTH - Math.ceil(score)) {
          itemClasses.push(CLS_OFF);
          i++;
        }
        return itemClasses;
      }
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat


    &.star-24
      .star-item
        width: 10px
        height: 10px
        background-size: 10px 10px
        margin-right: 3px
        &:last-child
         margin-right: 0
        &.on
          img-fit('star24_on')
        &.off
          img-fit('star24_off')
        &.half
          img-fit('star24_half')

    &.star-36
      .star-item
        width: 15px
        height: 15px
        background-size: 15px 15px
        margin-right: 6px
        &:last-child
          margin-right: 0
        &.on
          img-fit('star36_on')
        &.off
          img-fit('star36_off')
        &.half
          img-fit('star36_half')

    &.star-48
      .star-item
        width: 20px
        height: 20px
        background-size: 20px 20px
        margin-right: 22px
        &:last-child
          margin-right: 0
        &.on
          img-fit('star48_on')
        &.off
          img-fit('star48_off')
        &.half
          img-fit('star48_half')


</style>

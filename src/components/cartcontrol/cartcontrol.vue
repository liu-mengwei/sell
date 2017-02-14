<template>
  <div class="cartcontrol-wrapper">
    <transition name="roll">
      <div class="decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart($event)">
      </div>
    </transition>
    <span class="count" v-show="food.count>0">{{food.count}}</span>
    <div class="plus icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>


<script type="text/ecmascript-6">
  import Vue from 'vue';
  import {eventHub} from '../eventHub/eventHub';

  export default{
    props: {
      food: {
        type: Object
      }
    },

    methods: {
      addCart (event) {
        //禁止浏览器的点击事件
        if (!event._constructed) {
          return;
        }
        //需要用vue.set给data-food添加属性才能生效
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
          this.food.count = 1;
        }
        else {
          this.food.count++;
        }

        //发给cart组件
        eventHub.$emit('drop', event.target);
      },

      decreaseCart (event) {
        if (!event._constructed) {
          return;
        }
        this.food.count--;
      }
    }
  };

</script>


<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol-wrapper
    position: absolute
    right: 0
    bottom: 12px
    .decrease, .plus
      padding: 6px
      display: inline-block
      width: 24px
      height: 24px
      font-size: 24px
      line-height: 24px
      color: #00a0dc
      &.roll-enter
        opacity: 0
        transform: translateX(20px) rotate(180deg)
      &.roll-enter-active
        transition: all 0.4s ease
      &.roll-leave-active
        transition: all 0.4s ease
        transform: translateX(20px) rotate(180deg)
        opacity: 0
    .count
      display: inline-block
      width: 12px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
      vertical-align: top
      line-height: 36px

</style>

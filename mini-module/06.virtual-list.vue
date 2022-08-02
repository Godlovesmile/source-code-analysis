<template>
  <div id="VirtualList" ref="VirtualList" @scroll.passive="handleScroll">
    <div :style="{ height: items.length * size + 'px' }"></div>
    <div id="container" ref="container" :style="{ top: offsetTop }">
      <div
        v-for="(v, i) in itemList"
        :key="i"
        class="item"
        :style="{ height: size + 'px' }"
      >
        <slot name="content" :item="v" :index="i"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  props: {
    size: { type: Number },
    shownums: { type: Number },
    items: { type: Array },
  },
  computed: {
    itemList: function () {
      const list = this.items.slice(this.start, this.end)
      console.log('=== item list ===', this.start, this.end, list)
      return list
    },
  },
  data () {
    return {
      start: 0,
      end: this.shownums,
      offsetTop: 0,
    };
  },
  methods: {
    handleScroll: _.debounce(function () {
      // 从第几个item开始显示
      this.start = this.$refs.VirtualList.scrollTop / this.size;
      // 开始位置加上要显示几个 = end
      this.end = this.start + this.shownums;
      // 动态更改定位的top值，保证不会随父元素一起滚动
      this.offsetTop = this.$refs.VirtualList.scrollTop + "px";
    }, 1000),
    handleScroll1 () {
      // 从第几个item开始显示
      this.start = this.$refs.VirtualList.scrollTop / this.size;
      // 开始位置加上要显示几个 = end
      this.end = this.start + this.shownums;
      // 动态更改定位的top值，保证不会随父元素一起滚动
      this.offsetTop = this.$refs.VirtualList.scrollTop + "px";
    },
  },
  mounted () {
    this.$refs.VirtualList.style.height = this.size * this.shownums + "px";
  }
};
</script>
<style>
#VirtualList {
  overflow: auto;
  width: 100%;
  position: relative;
}
#container {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
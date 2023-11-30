<template>
  <div id="zoom-control">
    <ul v-show="show" class="zoom-selecter">
      <li v-for="(item, index) in zoomList" :key="index" :class="['zoom-item', { 'zoom-item-active': activezoomIndex === index }]" @click.stop="selectItem(index)">
        <!-- <i v-if="item.icon" :class="['iconfont', item.icon]"></i> -->
        <span>{{ item.text }}</span>
        <i v-if="activezoomIndex === index" class="iconfont icon-selected"></i>
      </li>
    </ul>
    <div v-if="!hideControl" class="zoom-control-wrap">
      <div :class="['zoom-icon radius-left', { disable: activezoomIndex === 0 }]" @click.stop="activezoomIndex > 0 ? sub() : ''">
        <i class="iconfont icon-sub"></i>
      </div>
      <div :class="['zoom-text', { 'zoom-text-active': show }]" @click.stop="show = !show">{{ zoom.text }}</div>
      <div :class="['zoom-icon radius-right', { disable: otherIndex === otherList.length - 1 }]" @click.stop="otherIndex < otherList.length - 1 ? add() : ''">
        <i class="iconfont icon-add"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import addMouseWheel from '@/common/methods/addMouseWheel'

// 组件大小控制器
const NAME = 'zoom-control'
let holder = null

export default {
  name: NAME,
  data() {
    return {
      hideControl: false,
      activezoomIndex: 0,
      zoomList: [
        {
          text: '25%',
          value: 25,
        },
        {
          text: '50%',
          value: 50,
        },
        {
          text: '75%',
          value: 75,
        },
        {
          text: '100%',
          value: 100,
        },
        {
          text: '125%',
          value: 125,
        },
        {
          text: '150%',
          value: 150,
        },
        {
          text: '200%',
          value: 200,
        },
        {
          text: '最佳尺寸',
          value: -1,
          // icon: 'icon-best-size',
        },
      ],
      show: false,
      zoom: {
        value: 0,
        text: 0,
      },
      otherList: [
        {
          text: '250%',
          value: 250,
        },
        {
          text: '300%',
          value: 300,
        },
        {
          text: '350%',
          value: 350,
        },
        {
          text: '400%',
          value: 400,
        },
        {
          text: '450%',
          value: 450,
        },
        {
          text: '500%',
          value: 500,
        },
      ],
      otherIndex: -1,
      bestZoom: 0,
    }
  },
  computed: {
    ...mapGetters(['dPage', 'dScreen', 'zoomScreenChange', 'dZoom']),
  },
  watch: {
    activezoomIndex(value) {
      if (value < 0 || value > this.zoomList.length - 1) {
        return
      }
      this.zoom = JSON.parse(JSON.stringify(this.zoomList[value]))
    },
    otherIndex(value) {
      if (value < 0 || value > this.otherList.length - 1) {
        return
      }
      this.zoom = JSON.parse(JSON.stringify(this.otherList[value]))
    },
    zoom(value) {
      let realValue = value.value
      if (realValue === -1) {
        realValue = this.calcZoom()
      }
      this.updateZoom(realValue)
      this.autoFixTop()
    },
    dScreen: {
      handler() {
        this.screenChange()
      },
      deep: true,
    },
    zoomScreenChange() {
      this.activezoomIndex = this.zoomList.length - 1
      this.screenChange()
    },
    dPage: {
      handler(val) {
        this.screenChange()
      },
      deep: true,
    },
  },
  async mounted() {
    await this.$nextTick()
    window.addEventListener('click', this.close)
    if (this.$route.path === '/draw') {
      this.activezoomIndex = 3
      this.hideControl = true
    } else {
      this.activezoomIndex = this.zoomList.length - 1
    }
    // 添加滚轮监听
    addMouseWheel('page-design', (isDown) => {
      this.mousewheelZoom(isDown)
    })
    // 添加窗口大小监听
    window.addEventListener('resize', (event) => {
      this.changeScreen()
    })
  },
  beforeUnmount() {
    window.removeEventListener('click', this.close)
  },
  methods: {
    ...mapActions(['updateZoom', 'updateScreen']),
    changeScreen() {
      clearTimeout(holder)
      holder = setTimeout(() => {
        const screen = document.getElementById('page-design')
        this.updateScreen({
          width: screen.offsetWidth,
          height: screen.offsetHeight,
        })
      }, 300)
    },
    screenChange() {
      // 弹性尺寸即时修改
      if (this.activezoomIndex === this.zoomList.length - 1) {
        this.updateZoom(this.calcZoom())
        this.autoFixTop()
      }
    },
    selectItem(index) {
      this.activezoomIndex = index
      this.otherIndex = -1
      this.show = false
    },
    close(e) {
      this.show = false
    },
    add() {
      this.curAction = 'add'
      this.show = false
      if (this.activezoomIndex === this.zoomList.length - 2 || this.activezoomIndex === this.zoomList.length - 1) {
        this.activezoomIndex = this.zoomList.length
        // this.otherIndex += 1
        if (this.bestZoom) {
          this.nearZoom(true)
        } else {
          this.otherIndex += 1
        }
        return
      }
      if (this.activezoomIndex != this.zoomList.length) {
        this.activezoomIndex++
        return
      }
      if (this.otherIndex < this.otherList.length - 1) {
        this.otherIndex++
      }
    },
    sub() {
      this.curAction = null
      this.show = false
      if (this.otherIndex === 0) {
        this.otherIndex = -1
        this.activezoomIndex = this.zoomList.length - 2
        return
      }
      if (this.otherIndex != -1) {
        this.otherIndex--
        return
      }
      if (this.activezoomIndex === this.zoomList.length - 1) {
        if (this.bestZoom) {
          this.nearZoom()
        } else {
          this.activezoomIndex = this.zoomList.length - 2
        }
        return
      }
      if (this.activezoomIndex != 0) {
        this.activezoomIndex--
      }
    },
    mousewheelZoom(down) {
      const value = Number(this.dZoom.toFixed(0))
      if (down && value <= 1) return
      this.updateZoom(down ? value - 1 : value + 1)
      this.zoom.text = value + '%'
      this.autoFixTop()
    },
    nearZoom(add) {
      for (let i = 0; i < this.zoomList.length; i++) {
        this.activezoomIndex = i
        if (this.zoomList[i].value > this.bestZoom) {
          if (add) break
        } else if (this.zoomList[i].value < this.bestZoom) {
          if (!add) break
        }
      }
      this.bestZoom = 0
    },
    calcZoom() {
      let widthZoom = ((this.dScreen.width - 142) * 100) / this.dPage.width
      let heightZoom = ((this.dScreen.height - 122) * 100) / this.dPage.height

      this.bestZoom = Math.min(widthZoom, heightZoom)
      return this.bestZoom
    },
    async autoFixTop() {
      await this.$nextTick()
      const presetPadding = 60
      const el = document.getElementById('out-page')
      // const clientHeight = document.body.clientHeight - 54
      const parentHeight = el.offsetParent.offsetHeight - 54
      let padding = (parentHeight - el.offsetHeight) / 2
      if (typeof this.curAction === 'undefined') {
        padding += presetPadding / 2
      }
      this.curAction === 'add' && (padding -= presetPadding)
      this.$store.commit('updatePaddingTop', padding > 0 ? padding : 0)
    },
  },
}
</script>

<style lang="less" scoped>
@color-select: #1b1634;
@color1: #ffffff; // 选项板背景
@color2: #ffffff; // Appears 3 times
@color3: #666666; // 文字主颜色
@color4: #c2c2c2; // 禁用
@color5: rgba(0, 0, 0, 0.12); // 高亮选项背景
@z-border-color: #e6e6e6;

#zoom-control {
  bottom: 20px;
  position: absolute;
  right: 302px;
  z-index: 1000;
  .zoom-control-wrap {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    height: 40px;
    .radius-left {
      border-bottom-left-radius: 50%;
      border-top-left-radius: 50%;
      border-block-end: 1px solid @z-border-color;
      border-block-start: 1px solid @z-border-color;
    }
    .radius-right {
      border-bottom-right-radius: 50%;
      border-top-right-radius: 50%;
      border-block-end: 1px solid @z-border-color;
      border-block-start: 1px solid @z-border-color;
    }
    .zoom-icon {
      align-items: center;
      background-color: @color2;
      color: @color3;
      cursor: pointer;
      display: flex;
      justify-content: center;
      width: 40px;
      &:hover {
        background-color: @color1;
        color: @color-select;
      }
    }
    .disable {
      color: @color4;
      &:hover {
        background-color: @color2;
        color: @color4;
        cursor: not-allowed;
      }
    }
    .zoom-text {
      user-select: none;
      align-items: center;
      background-color: @color2;
      color: @color3;
      cursor: pointer;
      display: flex;
      justify-content: center;
      width: 60px;
      border-block-end: 1px solid @z-border-color;
      border-block-start: 1px solid @z-border-color;
      &:hover {
        background-color: @color1;
        color: @color-select;
      }
    }
  }
  .zoom-selecter {
    background-color: @color1;
    color: @color3;
    position: absolute;
    top: -8px;
    transform: translateY(-100%);
    width: 100%;
    z-index: 1000;
    &:after {
      bottom: -8px;
      content: '';
      left: 50%;
      position: absolute;
      transform: translateX(-50%);
    }
    .zoom-item {
      align-items: center;
      cursor: pointer;
      display: flex;
      font-size: 14px;
      height: 34px;
      padding: 10px;
      width: 100%;
      i {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
      span {
        flex: 1;
      }
      &:hover {
        background-color: @color5;
        color: @color-select;
      }
    }
  }
}
// #zoom-control-active {
//   background-color: @color1;
//   background-color: @color5;
//   color: @color-select;
//   color: @color-select;
// }
</style>

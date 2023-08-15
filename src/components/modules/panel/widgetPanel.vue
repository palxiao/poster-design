<template>
  <div id="widget-panel">
    <div class="widget-classify">
      <ul class="classify-wrap">
        <li v-for="(item, index) in widgetClassifyList" :key="index" :class="['classify-item', { 'active-classify-item': activeWidgetClassify === index }]" @click="clickClassify(index)">
          <i :class="['iconfont', 'icon', item.icon]" :style="item.style"></i>
          <p>{{ item.name }}</p>
        </li>
      </ul>
      <a href="https://github.com/palxiao/poster-design" target="_blank" class="github"><img src="https://fe-doc.palxp.com/images/github.svg" alt="Github" title="Github" /> 源码</a>
    </div>
    <div v-show="active" class="widget-wrap">
      <temp-list-wrap :style="getStyle(0)" />
      <graph-list-wrap v-show="+activeWidgetClassify === 1" :active="+activeWidgetClassify === 1" />
      <text-list-wrap v-show="+activeWidgetClassify === 2" :active="+activeWidgetClassify === 2" />
      <photo-list-wrap v-show="+activeWidgetClassify === 3" :active="+activeWidgetClassify === 3" />
      <bg-img-list-wrap v-show="+activeWidgetClassify === 4" :active="+activeWidgetClassify === 4" />
      <tools-list-wrap v-show="+activeWidgetClassify === 5" :active="+activeWidgetClassify === 5" />
      <user-wrap v-show="+activeWidgetClassify === 6" :active="+activeWidgetClassify === 6" />
    </div>
    <!-- <div v-show="active" class="side-wrap"><div class="pack__up" @click="active = false">&lt;</div></div> -->
    <div v-show="active" class="side-wrap">
      <el-tooltip effect="dark" content="收起侧边栏" placement="right">
        <div class="pack__up" @click="active = false"></div>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
// 组件面板
const NAME = 'widget-panel'
import widgetClassifyListData from '@/assets/data/widgetClassifyList'
import { reactive, toRefs, onMounted, watch, nextTick, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { mapActions } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: NAME,
  setup() {
    // const store = useStore()
    const route = useRoute()
    const state = reactive({
      widgetClassifyList: widgetClassifyListData,
      activeWidgetClassify: -1,
      active: true,
    })
    const clickClassify = (index: number) => {
      state.activeWidgetClassify = index
      state.active = true
    }
    const getStyle = (index: number) => {
      return {
        display: state.activeWidgetClassify === index ? '' : 'none',
      }
    }

    onMounted(async () => {
      state.activeWidgetClassify = 0
      await nextTick()
      const { koutu } = route.query
      koutu && (state.activeWidgetClassify = 5)
    })

    watch(
      () => state.activeWidgetClassify,
      (index) => {
        if (index >= 0 && index < state.widgetClassifyList.length) {
          state.widgetClassifyList[index].show = true
        }
      },
    )
    // const { proxy } = getCurrentInstance() as ComponentInternalInstance
    // watch(
    //   () => state.active,
    //   () => {
    //     let screen = document.getElementById('page-design')
    //     nextTick(() => {
    //       proxy?.updateScreen({
    //         width: screen.offsetWidth,
    //         height: screen.offsetHeight,
    //       })
    //     })
    //   },
    // )

    return {
      clickClassify,
      getStyle,
      ...toRefs(state),
    }
  },
  methods: {
    ...mapActions(['updateScreen']),
  },
}
</script>

<style lang="less" scoped>
// Color variables (appears count calculates by raw css)
@color1: #3e4651; // Appears 2 times

#widget-panel {
  transition: all 1s;
  color: @color1;
  display: flex;
  flex-direction: row;
  font-weight: 600;
  height: 100%;
  position: relative;
  // width: 360px;
  .widget-classify {
    position: relative;
    border-right: 1px solid rgba(0, 0, 0, 0.07);
    background-color: #ffffff;
    height: 100%;
    text-align: center;
    width: 66px;
    .icon {
      font-size: 24px;
      color: #070707c9;
    }
    .classify-wrap {
      padding-top: 3px;
      user-select: none;
      width: 100%;
      .classify-item {
        position: relative;
        align-items: center;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        font-weight: 500;
        height: 68px;
        justify-content: center;
        width: 100%;
        p {
          color: #9da3ac;
          margin-top: 2px;
        }
        .icon {
          color: #070707;
        }
      }
      .classify-item:hover > .icon {
        transform: scale3d(1.2, 1.2, 1);
      }
      .active-classify-item {
        position: relative;
        .icon,
        p {
          color: @active-text-color;
        }
      }
      .active-classify-item::after,
      .classify-item:hover::after {
        position: absolute;
        content: '';
        left: 0;
        top: 17px;
        width: 4px;
        height: 37px;
        background: @active-text-color;
      }
    }
  }
  .widget-wrap {
    width: 328px;
    background-color: @color-white;
    flex: 1;
    height: 100%;
  }
  .side-wrap {
    position: absolute;
    left: 394px;
    pointer-events: none;
    z-index: 99;
    width: 20px;
    height: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    .pack__up {
      // user-select: none;
      // opacity: 0.7;
      // color: rgba(0, 0, 0, 0.5);
      // background: @color-white;
      // height: 50px;
      // width: 15px;
      // border-radius: 0 100% 100% 0;
      // cursor: pointer;
      // line-height: 45px;
      pointer-events: all;
      border-radius: 0 100% 100% 0;
      cursor: pointer;
      width: 20px;
      height: 64px;
      cursor: pointer;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      filter: drop-shadow(5px 0px 4px rgba(0, 0, 0, 0.03));
    }
    .pack__up:hover {
      color: rgba(0, 0, 0, 0.9);
      opacity: 0.9;
    }
  }
}

.github {
  cursor: pointer;
  position: absolute;
  bottom: 12px;
  font-size: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  img {
    width: 21px;
    height: 21px;
    margin: 0 2px;
  }
}
</style>

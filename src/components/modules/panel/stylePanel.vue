<template>
  <div id="style-panel">
    <div class="style-tab">
      <span :class="['tab', { 'active-tab': activeTab === 0 }]" @click="activeTab = 0">设置</span>
      <span :class="['tab', { 'active-tab': activeTab === 1 }]" @click="activeTab = 1">图层</span>
    </div>
    <div v-show="activeTab === 0" class="style-wrap">
      <div v-show="showGroupCombined" style="padding: 2rem 0">
        <el-button plain type="primary" class="gounp__btn" @click="realCombined">成组</el-button>
        <icon-item-select label="" :data="alignIconList" @finish="alignAction" />
      </div>
      <component :is="dActiveElement.type + '-style'" v-show="!showGroupCombined" v-if="dActiveElement.type" />
    </div>
    <div v-show="activeTab === 1" class="layer-wrap">
      <layer-list :data="dWidgets" @change="layerChange" />
    </div>
  </div>
</template>

<script>
// 样式设置面板
const NAME = 'style-panel'
import { mapGetters, mapActions } from 'vuex'
import alignIconList from '@/assets/data/AlignListData'
import iconItemSelect from '../settings/iconItemSelect.vue'

export default {
  name: NAME,
  components: { iconItemSelect },
  data() {
    return {
      activeTab: 0,
      alignIconList,
      showGroupCombined: false,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dWidgets', 'dSelectWidgets']),
  },
  watch: {
    dSelectWidgets: {
      handler(items) {
        setTimeout(() => {
          this.showGroupCombined = items.length > 1
        }, 100)
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(['selectWidget', 'updateAlign', 'updateHoverUuid', 'getCombined', 'realCombined', 'ungroup', 'pushHistory']),
    alignAction(item) {
      const sWidgets = JSON.parse(JSON.stringify(this.dSelectWidgets))
      this.getCombined().then((group) => {
        for (let i = 0; i < sWidgets.length; i++) {
          const element = sWidgets[i]
          this.updateAlign({
            align: item.value,
            uuid: element.uuid,
            group,
          })
        }
        this.pushHistory()
      })
    },
    layerChange(newLayer) {
      this.$store.commit('setDWidgets', newLayer.reverse())
      this.$store.commit('setShowMoveable', false)
    },
  },
}
</script>

<style lang="less" scoped>
@color0: #ffffff; // Appears 5 times
@color1: #999999; // Appears 3 times
@color2: #d7d7d7; // Appears 2 times

#style-panel ::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
#style-panel {
  background-color: @color0;
  border-left: 1px solid @color2;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  width: 280px;
  .style-tab {
    box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    text-align: center;
    width: 100%;
    z-index: 10;
    .tab {
      user-select: none;
      background-color: @color0;
      font-size: 14px;
      color: @color1;
      cursor: pointer;
      flex: 1;
      padding: 14px 10px;
    }
    .tab.active-tab {
      // background-color: #3e4651;
      font-size: 15px;
      color: #444444;
      font-weight: 600;
    }
  }
  .style-wrap {
    flex: 1;
    overflow: auto;
    width: 100%;
    padding: 0px 20px;
  }
  .layer-wrap {
    flex: 1;
    overflow: auto;
    width: 100%;
  }
}

.gounp {
  &__btn {
    width: 100%;
    margin-bottom: 2.7rem;
  }
}
</style>

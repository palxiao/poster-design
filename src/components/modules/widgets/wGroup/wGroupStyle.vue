<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 11:21:37
 * @Description: 组合设置
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 17:57:24
-->
<template>
  <div id="w-group-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置尺寸" name="1">
        <div class="line-layout">
          <number-input v-model="innerElement.left" label="X" @finish="(value) => finish('left', value)" />
          <number-input v-model="innerElement.top" label="Y" @finish="(value) => finish('top', value)" />
          <number-input v-model="innerElement.width" style="margin-top: 0.5rem" label="宽" @finish="(value) => finish('width', value)" />
          <number-input v-model="innerElement.height" style="margin-top: 0.5rem" label="高" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="2">
        <el-button plain type="primary" class="block-btn" @click="ungroup(innerElement.uuid)">取消组合</el-button>
        <!-- <div class="ungroup style-item" @click="ungroup(innerElement.uuid)">取消组合</div> -->
        <number-slider v-model="innerElement.opacity" class="style-item" label="不透明" :step="0.05" :maxValue="1" @finish="(value) => finish('opacity', value)" />
        <br />
        <icon-item-select class="style-item" label="" :data="layerIconList" @finish="layerAction" />
        <icon-item-select label="" :data="alignIconList" @finish="alignAction" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// 组合组件样式
const NAME = 'w-group-style'
import { mapGetters, mapActions } from 'vuex'
import numberInput from '../../settings/numberInput.vue'
import iconItemSelect from '../../settings/iconItemSelect.vue'
import numberSlider from '../../settings/numberSlider.vue'
import layerIconList from '@/assets/data/LayerIconList'
import alignIconList from '@/assets/data/AlignListData'

export default {
  name: NAME,
  components: { numberInput, iconItemSelect, numberSlider },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      // defaultValue: 0,
      innerElement: {},
      tag: false,
      ingoreKeys: ['name', 'width', 'height'],
      layerIconList,
      alignIconList,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement']),
  },
  watch: {
    dActiveElement: {
      handler(newValue, oldValue) {
        this.change()
      },
      deep: true,
    },
    innerElement: {
      handler(newValue, oldValue) {
        this.changeValue()
      },
      deep: true,
    },
  },
  created() {
    this.change()
  },
  methods: {
    ...mapActions(['updateWidgetData', 'updateAlign', 'updateLayerIndex', 'ungroup']),
    change() {
      this.tag = true
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement))
    },
    changeValue() {
      if (this.tag) {
        this.tag = false
        return
      }
      if (this.dMoving) {
        return
      }
      for (let key in this.innerElement) {
        if (this.ingoreKeys.indexOf(key) !== -1) {
          this.dActiveElement[key] = this.innerElement[key]
        } else if (key !== 'setting' && key !== 'record' && this.innerElement[key] !== this.dActiveElement[key]) {
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: key,
            value: this.innerElement[key],
          })
        }
      }
    },
    finish(key, value) {
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: key,
        value: value,
        pushHistory: true,
      })
    },
    layerAction(item) {
      this.updateLayerIndex({
        uuid: this.dActiveElement.uuid,
        value: item.value,
        isGroup: true,
      })
    },
    alignAction(item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid,
      })
    },
  },
}
</script>

<style lang="less" scoped>
#w-group-style {
  height: 100%;
  width: 100%;
}
// .position-size {
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
// }
.line-layout {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.select {
  margin-bottom: 10px;
}
.ungroup {
  background-color: #3b74f1;
  color: #ffffff;
  cursor: pointer;
  margin: 10px;
  padding: 5px;
  text-align: center;
  &:hover {
    background-color: #4f82f2;
  }
}
.block-btn {
  width: 100%;
  margin-bottom: 1rem;
}
</style>

<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 11:41:53
 * @Description: 
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 17:53:23
-->
<template>
  <div id="w-image-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置尺寸" name="1">
        <div class="line-layout">
          <number-input v-model="innerElement.left" label="X" @finish="(value) => finish('left', value)" />
          <number-input v-model="innerElement.top" label="Y" @finish="(value) => finish('top', value)" />
          <number-input v-model="innerElement.width" style="margin-top: 0.5rem" label="宽" @finish="(value) => finish('width', value)" />
          <number-input v-model="innerElement.height" style="margin-top: 0.5rem" label="高" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="样式设计" name="2">
        <div style="flex-wrap: nowrap" class="line-layout">
          <el-select v-model="innerElement.dotColorType">
            <el-option v-for="ctype in localization.dotColorTypes" :key="ctype.key" :label="ctype.value" :value="ctype.key" />
          </el-select>
          <el-select v-model="innerElement.dotType" class="selector">
            <el-option v-for="dtype in localization.dotTypes" :key="dtype.key" :label="dtype.value" :value="dtype.key" />
          </el-select>
        </div>
        <div style="flex-wrap: nowrap; margin-top: 1rem" class="line-layout">
          <color-select v-model="innerElement.dotColor" @finish="(value) => finish('dotColor', value)" />
          <color-select v-show="innerElement.dotColorType !== 'single'" v-model="innerElement.dotColor2" @finish="(value) => finish('dotColor2', value)" />
        </div>
        <number-slider v-show="innerElement.dotColorType !== 'single'" v-model="innerElement.dotRotation" style="margin-top: 8px" label="渐变角度" :step="1" :minValue="0" :maxValue="360" @finish="(value) => finish('dotRotation', value)" />
      </el-collapse-item>
      <el-collapse-item title="内容设置" name="3">
        <text-input-area v-model="innerElement.value" :max="40" label="" @finish="(value) => finish('value', value)" />
        <br />
        <div class="slide-wrap logo__layout">
          <img v-show="innerElement.url" :src="innerElement.url" class="logo" />
          <uploader class="options__upload" @done="uploadImgDone">
            <el-button size="small" plain>{{ innerElement.url ? '替换图片' : '上传 Logo' }}</el-button>
          </uploader>
          <el-button v-show="innerElement.url" size="small" link @click="finish('url', '')">删除</el-button>
        </div>
        <br />
        <div class="slide-wrap">
          <number-slider v-model="innerElement.opacity" label="不透明" :step="0.01" :maxValue="1" @finish="(value) => finish('opacity', value)" />
        </div>
      </el-collapse-item>
      <br />
      <icon-item-select class="style-item" label="" :data="layerIconList" @finish="layerAction" />
      <icon-item-select :data="alignIconList" @finish="alignAction" />
      <br />
    </el-collapse>
  </div>
</template>

<script>
// 图片组件样式
const NAME = 'w-image-style'
import { mapGetters, mapActions } from 'vuex'
import { ElSelect, ElOption } from 'element-plus'
import numberInput from '../../settings/numberInput.vue'
import iconItemSelect from '../../settings/iconItemSelect.vue'
import numberSlider from '../../settings/numberSlider.vue'
import textInputArea from '../../settings/textInputArea.vue'
import colorSelect from '../../settings/colorSelect.vue'
// import { getImage } from '@/common/methods/getImgDetail'
import api from '@/api'
import localization from '@/assets/data/QrCodeLocalization'
import uploader from '@/components/common/Uploader/index.vue'
import layerIconList from '@/assets/data/LayerIconList'
import alignIconList from '@/assets/data/AlignListData'

export default {
  name: NAME,
  components: { ElSelect, ElOption, numberInput, numberSlider, iconItemSelect, textInputArea, colorSelect, uploader },
  data() {
    return {
      activeNames: ['2', '3', '4'],
      innerElement: {},
      tag: false,
      ingoreKeys: ['left', 'top', 'name', 'width', 'height', 'radiusTopLeft', 'radiusTopRight', 'radiusBottomLeft', 'radiusBottomRight'],
      layerIconList,
      alignIconList,
      localization,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dMoving', 'dWidgets']),
  },
  watch: {
    dActiveElement: {
      handler(newValue, oldValue) {
        this.change()
        // 失焦取消编辑模式
        if (newValue.uuid == -1) {
          this.innerElement.cropEdit = false
          this.updateWidgetData({
            uuid: this.lastUuid,
            key: 'cropEdit',
            value: false,
          })
        } else {
          this.lastUuid = newValue.uuid
        }
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
    ...mapActions(['updateWidgetData', 'updateAlign', 'updateLayerIndex', 'addWidget']),
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
      console.log(item)
      this.updateLayerIndex({
        uuid: this.dActiveElement.uuid,
        value: item.value,
      })
    },
    async alignAction(item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid,
      })
      await this.$nextTick()
      this.$store.commit('updateRect')
    },
    async uploadImgDone(img) {
      this.$store.commit('setShowMoveable', false)
      await api.material.addMyPhoto(img)
      // this.innerElement.width = img.width
      // this.innerElement.height = img.height * (this.innerElement.width / img.width)
      this.innerElement.url = img.url
      this.$store.commit('setShowMoveable', true)
    },
  },
}
</script>

<style lang="less" scoped>
.slide-wrap {
  width: 100%;
  padding: 16px;
  background: #f3f5f7;
  border-radius: 6px;
}
#w-image-style {
  height: 100%;
  width: 100%;
}
.line-layout {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.style-item {
  margin-bottom: 10px;
}
.setting-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.options {
  // margin-bottom: 0.7rem;
  &__upload {
    width: auto;
    // margin-left: 10px;
    display: inline-block;
  }
}

.selector {
  width: 340px;
  transform: scale(0.94);
}
.logo__layout {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.logo {
  height: 40px;
}
</style>

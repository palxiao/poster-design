<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-09 11:41:53
 * @Description: 
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-12 12:50:39
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
      <el-collapse-item title="设置" name="2">
        <!-- <el-button size="mini" style="width: 100%; margin-top: 0.5rem" plain @click="openCropper">替换图片</el-button> -->
        <el-button style="width: 100%; margin-bottom: 12px" plain @click="openPicBox">替换图片</el-button>
        <div class="options">
          <el-button v-if="innerElement.cropEdit" plain type="primary" @click="imgCrop(false)">完成</el-button>
          <el-button v-else plain type="primary" @click="imgCrop(true)"><i class="icon sd-caijian" />裁剪</el-button>
          <el-button @click="openImageCutout" plain>抠图</el-button>
          <!-- <uploader class="options__upload" @done="uploadImgDone">
            <el-button size="small" plain>替换图片</el-button>
          </uploader> -->
          <el-button size="small" disabled plain @click="openCropper">图片美化</el-button>
        </div>
        <!-- <container-wrap @change="changeContainer" />
        <br /> -->
        <div class="slide-wrap">
          <number-slider v-model="innerElement.opacity" style="font-size: 14px" label="不透明" :step="0.05" :maxValue="1" @finish="(value) => finish('opacity', value)" />
          <number-slider v-model="innerElement.radius" style="font-size: 14px" label="圆角" :maxValue="Math.min(innerElement.record.width, innerElement.record.height)" @finish="(value) => finish('radius', value)" />
          <!-- <number-slider v-model="innerElement.letterSpacing" style="font-size: 14px" label="字距" labelWidth="40px" :step="0.05" :minValue="-50" :maxValue="innerElement.fontSize" @finish="(value) => finish('letterSpacing', value)" />
        <number-slider v-model="innerElement.lineHeight" style="font-size: 14px" label="行距" labelWidth="40px" :step="0.05" :minValue="0" :maxValue="2.5" @finish="(value) => finish('lineHeight', value)" /> -->
        </div>
      </el-collapse-item>
      <el-collapse-item v-if="innerElement.isNinePatch" title="点九图设置" name="3">
        <number-slider v-model="innerElement.sliceData.ratio" :step="0.01" label="比率" :maxValue="10" @finish="(value) => finishSliceData('ratio', value)" />
        <number-slider v-model="innerElement.sliceData.left" :step="0.5" label="大小" @finish="(value) => finishSliceData('left', value)" />
      </el-collapse-item>
      <br />
      <icon-item-select class="style-item" label="" :data="layerIconList" @finish="layerAction" />
      <icon-item-select :data="alignIconList" @finish="alignAction" />
      <br />
    </el-collapse>
    <!-- <CropImage ref="crop" @done="cropDone" /> -->
    <inner-tool-bar v-show="innerElement.cropEdit" :style="toolBarStyle">
      <number-slider v-model="innerElement.zoom" class="inner-bar" label="缩放" labelWidth="40px" :step="0.01" :minValue="1" :maxValue="3" />
      <i style="padding: 0 8px; cursor: pointer" class="icon sd-queren" @click="imgCrop(false)" />
    </inner-tool-bar>
    <picBox ref="picBox" @select="selectDone" />
    <imageCutout ref="imageCutout" />
  </div>
</template>

<script>
// 图片组件样式
const NAME = 'w-image-style'
import { mapGetters, mapActions } from 'vuex'
import numberInput from '../../settings/numberInput.vue'
import iconItemSelect from '../../settings/iconItemSelect.vue'
import numberSlider from '../../settings/numberSlider.vue'
// import textInput from '../../settings/textInput.vue'
// import CropImage from '@/components/business/cropper/CropImage.vue'
// import ContainerWrap from '../../settings/EffectSelect/ContainerWrap.vue'
// import uploader from '@/components/common/Uploader/index.vue'
import { getImage } from '@/common/methods/getImgDetail'
import api from '@/api'
import layerIconList from '@/assets/data/LayerIconList'
import alignIconList from '@/assets/data/AlignListData'
import picBox from '@/components/business/picture-selector'
import imageCutout from '@/components/business/image-cutout'

export default {
  name: NAME,
  components: { numberInput, numberSlider, iconItemSelect, picBox, imageCutout },
  data() {
    return {
      picBoxShow: false,
      activeNames: ['2', '3', '4'],
      innerElement: {},
      tag: false,
      ingoreKeys: ['left', 'top', 'name', 'width', 'height', 'radiusTopLeft', 'radiusTopRight', 'radiusBottomLeft', 'radiusBottomRight'],
      layerIconList: layerIconList.concat([
        {
          key: 'flip',
          icon: 'sd-zuoyoufanzhuan',
          extraIcon: true,
          tip: '水平翻转',
          value: 'Y',
        },
        {
          key: 'flip',
          icon: 'sd-shangxiafanzhuan',
          extraIcon: true,
          tip: '垂直翻转',
          value: 'X',
        },
      ]),
      alignIconList,
      toolBarStyle: {},
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
        if (newValue.uuid != this.lastUuid && typeof this.lastUuid !== 'undefined') {
          this.innerElement.cropEdit = false
          this.$store.commit('setShowRotatable', true) // 失焦会导致大小变化锁定的错误
        }
        this.lastUuid = newValue.uuid
      },
      deep: true,
    },
    innerElement: {
      handler(newValue, oldValue) {
        this.changeValue()
        this.cropHandle()
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
      this.innerElement = JSON.parse(JSON.stringify({ ...this.innerElement, ...this.dActiveElement }))
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
        } else if (key !== 'cropEdit' && key !== 'record' && this.innerElement[key] !== this.dActiveElement[key]) {
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: key,
            value: this.innerElement[key],
          })
        }
      }
    },
    finishSliceData(key, value) {
      const data = this.dActiveElement.sliceData
      if (data) {
        data[key] = value
        this.updateWidgetData({
          uuid: this.dActiveElement.uuid,
          key: 'sliceData',
          value: data,
          pushHistory: true,
        })
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
      if (item.key === 'zIndex') {
        this.updateLayerIndex({
          uuid: this.dActiveElement.uuid,
          value: item.value,
        })
      } else {
        this.finish(item.key, item.value === this.dActiveElement.flip ? null : item.value)
      }
    },
    async alignAction(item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid,
      })
      await this.$nextTick()
      this.$store.commit('updateRect')
    },
    openCropper() {
      this.$refs.crop.open(this.innerElement, this.innerElement.cropData)
    },
    cropDone({ newImg, data, width, height }) {
      this.innerElement.imgUrl = newImg
      this.innerElement.cropData = data
      this.innerElement.width = width.toFixed(0)
      this.innerElement.height = height.toFixed(0)
    },
    async changeContainer(setting) {
      const index = this.dWidgets.findIndex((x) => x.uuid == this.innerElement.uuid)
      const img = await getImage(setting.svgUrl)
      setting.width = this.innerElement.width
      setting.height = img.height * (this.innerElement.width / img.width)
      setting.left = this.innerElement.left
      setting.top = this.innerElement.top
      setting.imgUrl = this.innerElement.imgUrl
      this.dWidgets.splice(index, 1)
      this.addWidget(setting)
    },
    async uploadImgDone(img) {
      this.$store.commit('setShowMoveable', false)
      await api.material.addMyPhoto(img)
      // this.innerElement.width = img.width
      this.innerElement.height = img.height * (this.innerElement.width / img.width)
      this.innerElement.imgUrl = img.url
      this.$store.commit('setShowMoveable', true)
    },
    selectDone(img) {
      this.innerElement.imgUrl = img.url
      // this.imgCrop(true)
    },
    imgCrop(val) {
      // TODO: 画布内图像裁剪
      const { left, top } = document.getElementById(this.innerElement.uuid).getBoundingClientRect()
      this.toolBarStyle = { left: left + 'px', top: top + 'px' }
      this.innerElement.cropEdit = val
      this.$store.commit('setShowRotatable', !val)
    },
    cropHandle() {
      this.$store.commit('setCropUuid', this.innerElement.cropEdit ? this.innerElement.uuid : -1)
    },
    // 图库选择器
    openPicBox() {
      this.$refs.picBox.open()
    },
    openImageCutout() {
      this.$refs.imageCutout.open()
    },
  },
}
</script>

<style lang="less" scoped>
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
  margin-bottom: 0.7rem;
  &__upload {
    width: auto;
    margin-left: 10px;
    display: inline-block;
  }
}

.slide-wrap {
  margin-top: 18px;
  width: 100%;
  padding: 16px;
  background: #f3f5f7;
  border-radius: 6px;
}

.inner-bar {
  margin: 0 10px;
  width: 240px;
}
</style>

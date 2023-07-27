<template>
  <div id="page-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="画布尺寸" name="1">
        <div class="position-size">
          <number-input v-model="innerElement.width" label="宽" :maxValue="5000" @finish="(value) => finish('width', value)" />
          <number-input v-model="innerElement.height" label="高" :maxValue="5000" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="背景设置" name="2">
        <Tabs :value="mode" @update:value="onChangeMode">
          <TabPanel v-for="label in modes" :key="label" :label="label"></TabPanel>
        </Tabs>
        <color-select v-show="mode === '颜色'" v-model="innerElement.backgroundColor" @finish="(value) => finish('backgroundColor', value)" />
        <!-- <bg-img-select :img="innerElement.backgroundImage"/> -->
        <div v-if="mode === '图片' && innerElement.backgroundImage" style="margin-top: 2rem">
          <el-image style="max-height: 428px" :src="innerElement.backgroundImage" fit="contain"></el-image>
          <el-button style="width: 100%; margin-top: 0.7rem" size="small" @click="deleteBg">删除</el-button>
        </div>
        <uploader v-show="mode === '图片'" style="width: 100%; margin-top: 0.7rem" @done="uploadImgDone">
          <el-button style="width: 100%" plain>{{ innerElement.backgroundImage ? '替换背景' : '上传背景' }}图</el-button>
        </uploader>
        <el-button v-show="mode === '图片' && innerElement.backgroundImage" style="width: 100%; margin-top: 0.7rem" size="small" @click="downloadBG">{{ downP ? downP + ' %' : '下载背景图' }}</el-button>
      </el-collapse-item>
      <!-- <el-collapse-item title="其他设置" name="3">
        <el-input v-model="innerElement.name" label="名称" @finish="(value) => finish('name', value)" />
      </el-collapse-item> -->
      <!-- <el-collapse-item title="客户端配置(设置客户端是否允许修改)" name="4">
        <setting-switch v-for="item in dActiveElement.setting" :key="item.key" v-model="item.value" :label="item.label" />
      </el-collapse-item> -->
      <!-- <el-button v-loading="canvasRunning" size="small" @click="pickColor">取色器测试</el-button> -->
    </el-collapse>
  </div>
</template>

<script>
// 画布组件样式
const NAME = 'page-style'
import { mapGetters, mapActions } from 'vuex'
import numberInput from '../settings/numberInput.vue'
import colorSelect from '../settings/colorSelect.vue'
import uploader from '@/components/common/Uploader/index.vue'
import api from '@/api'
import _dl from '@/common/methods/download'
// import ColorPipette from '@/utils/plugins/color-pipette'
import Tabs from '@palxp/color-picker/comps/Tabs.vue'
import TabPanel from '@palxp/color-picker/comps/TabPanel.vue'

export default {
  name: NAME,
  components: { numberInput, colorSelect, uploader, Tabs, TabPanel },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      innerElement: {},
      tag: false,
      ingoreKeys: ['backgroundColor', 'name', 'width', 'height'],
      downP: 0,
      // canvasRunning: false,
      mode: '颜色',
      modes: ['颜色', '图片'],
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
    ...mapActions(['updatePageData']),
    onChangeMode(value) {
      this.mode = value
      if (value === '颜色') {
        this._localTempBG = this.innerElement.backgroundImage
        this.finish('backgroundImage', '')
      } else {
        this._localTempBG && this.finish('backgroundImage', this._localTempBG)
      }
    },
    change() {
      this.mode = this.modes[0]
      this.tag = true
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement))
      this.innerElement.backgroundImage && (this.mode = this.modes[1])
    },
    changeValue() {
      if (this.tag) {
        this.tag = false
        return
      }
      for (let key in this.innerElement) {
        if (key !== 'setting' && key !== 'record' && this.innerElement[key] !== this.dActiveElement[key]) {
          if (this.ingoreKeys.indexOf(key) !== -1) {
            this.dActiveElement[key] = this.innerElement[key]
          } else {
            this.updatePageData({
              key: key,
              value: this.innerElement[key],
            })
          }
        }
      }
    },
    finish(key, value) {
      this.updatePageData({
        key: key,
        value: value,
        pushHistory: true,
      })
    },
    async uploadImgDone(img) {
      await api.material.addMyPhoto(img)
      this.updatePageData({
        key: 'backgroundTransform',
        value: {},
      })
      this.finish('backgroundImage', img.url)
    },
    async deleteBg() {
      this._localTempBG = null
      this.updatePageData({
        key: 'backgroundImage',
        value: '',
        pushHistory: true,
      })
      await this.$nextTick()
      this.mode = this.modes[1]
    },
    async downloadBG() {
      await _dl.downloadImg(this.innerElement.backgroundImage, (p) => {
        this.downP = p < 99 ? p / 100 : 0
      })
    },
  },
}
</script>

<style>
/* :deep(.el-collapse-item__header) {
  padding: 0;
  font-size: 14px;
  color: #666666;
} */
.el-collapse-item__header {
  padding: 0 !important;
  font-size: 14px !important;
  color: #666666 !important;
}
.el-collapse-item__wrap {
  padding: 0 !important;
}
.el-collapse-item__content {
  padding-bottom: 18px !important;
}
</style>

<style lang="less" scoped>
#page-style {
  height: 100%;
  width: 100%;
}
.position-size {
  display: flex;
  // justify-content: space-between;
  width: 100%;
  .number-input {
    flex: 0.25;
  }
}
.select {
  margin-bottom: 10px;
}
</style>

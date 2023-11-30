<template>
  <div id="w-text-style">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置尺寸" name="1">
        <div class="line-layout">
          <number-input v-model="innerElement.left" label="X" @finish="(value) => finish('left', value)" />
          <number-input v-model="innerElement.top" label="Y" @finish="(value) => finish('top', value)" />
          <number-input v-model="innerElement.width" style="margin-top: 0.5rem" label="宽" :editable="true" @finish="(value) => finish('width', value)" />
          <number-input v-model="innerElement.height" style="margin-top: 0.5rem" label="高" :editable="true" @finish="(value) => finish('height', value)" />
        </div>
      </el-collapse-item>
      <!-- <el-collapse-item title="样式设置" name="2"> -->
      <div class="line-layout style-item">
        <value-select v-model="innerElement.fontClass" label="文字" :data="fontClassList" inputWidth="152px" :readonly="true" @finish="(font) => finish('fontClass', font)" />
        <value-select v-model="innerElement.fontSize" label="大小" suffix="px" :data="fontSizeList" @finish="(value) => finish('fontSize', value)" />
      </div>

      <icon-item-select class="style-item" :data="styleIconList1" @finish="textStyleAction" />
      <icon-item-select class="style-item" :data="styleIconList2" @finish="textStyleAction" />

      <!-- <div style="flex-wrap: nowrap" class="line-layout style-item">
        <value-select v-model="innerElement.lineHeight" label="行距" suffix="倍" :data="lineHeightList" @finish="(value) => finish('lineHeight', value)" />
        <value-select v-model="innerElement.letterSpacing" label="字距" suffix="%" :data="letterSpacingList" @finish="(value) => finish('letterSpacing', value)" />
      </div> -->
      <!-- <el-collapse-item title="位置尺寸" name="1"> -->
      <div class="style-item slide-wrap">
        <number-slider v-model="innerElement.letterSpacing" style="font-size: 14px" label="字距" labelWidth="40px" :step="0.05" :minValue="-innerElement.fontSize" :maxValue="innerElement.fontSize * 2" @finish="(value) => finish('letterSpacing', value)" />
        <number-slider v-model="innerElement.lineHeight" style="font-size: 14px" label="行距" labelWidth="40px" :step="0.05" :minValue="0" :maxValue="2.5" @finish="(value) => finish('lineHeight', value)" />
      </div>
      <!-- </el-collapse-item> -->

      <div style="flex-wrap: nowrap" class="line-layout style-item">
        <color-select v-model="innerElement.color" label="颜色" @finish="(value) => finish('color', value)" />
        <!-- <color-select v-model="innerElement.backgroundColor" label="背景颜色" @finish="(value) => finish('backgroundColor', value)" /> -->
      </div>
      <div class="line-layout style-item">
        <effect-wrap v-model="innerElement.textEffects" :data="innerElement" :degree="innerElement.degree" @select="testEffect" />
      </div>
      <icon-item-select class="style-item" :data="layerIconList" @finish="layerAction" />
      <icon-item-select class="style-item" :data="alignIconList" @finish="alignAction" />

      <!-- v-show="!innerElement.editable"  -->
      <div style="margin-top: 10px" class="line-layout style-item">
        <text-input-area v-model="innerElement.text" @finish="(value) => finish('text', value)" />
      </div>
      <!-- </el-collapse-item> -->
    </el-collapse>
  </div>
</template>

<script>
// 文本组件样式
const NAME = 'w-text-style'
// import api from '@/api'
// import _config from '@/config'
import { mapGetters, mapActions } from 'vuex'
import { styleIconList1, styleIconList2, alignIconList } from '../../../../assets/data/TextIconsData'
import layerIconList from '@/assets/data/LayerIconList'
import numberInput from '../../settings/numberInput.vue'
import numberSlider from '../../settings/numberSlider.vue'
import colorSelect from '../../settings/colorSelect.vue'
import iconItemSelect from '../../settings/iconItemSelect.vue'
import textInputArea from '../../settings/textInputArea.vue'
import valueSelect from '../../settings/valueSelect.vue'
import effectWrap from '../../settings/EffectSelect/TextWrap.vue'
import { useFontStore } from '@/common/methods/fonts'
import usePageFontsFilter from './pageFontsFilter.ts'

export default {
  name: NAME,
  components: { numberInput, colorSelect, iconItemSelect, textInputArea, valueSelect, effectWrap, numberSlider },
  data() {
    return {
      activeNames: [],
      innerElement: {},
      tag: false,
      ingoreKeys: ['left', 'top', 'name', 'width', 'height', 'text', 'color', 'backgroundColor'],
      fontSizeList: [12, 14, 24, 26, 28, 30, 36, 48, 60, 72, 96, 108, 120, 140, 180, 200, 250, 300, 400, 500],
      fontClassList: [], // 不能设空字体系统默认字体，因为截图服务的默认字体无法保证一致
      lineHeightList: [1, 1.5, 2],
      letterSpacingList: [0, 10, 25, 50, 75, 100, 200],
      layerIconList,
      styleIconList1,
      styleIconList2,
      alignIconList,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dMoving']),
    isDraw() {
      return this.$route.name === 'Draw'
    },
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
    this.timer = null
    this.change()
    setTimeout(() => {
      this.loadFonts()
    }, 100)
  },
  methods: {
    ...mapActions(['updateWidgetData', 'updateAlign', 'updateLayerIndex', 'pushHistory']),
    testEffect({ key, value, style }) {
      console.log('选择回调')
      const uuid = this.dActiveElement.uuid
      this.$store.commit('setWidgetStyle', { uuid, key, value })
      if (style) {
        this.finish('color', style.color || '')
      }
    },
    loadFonts() {
      // if (!this.isDraw) {
      // useFontStore().init()
      const localFonts = useFontStore.list
      const fontLists = { 当前页面: [], 中文: [], 英文: [] }
      for (const font of localFonts) {
        const { id, oid, value, url, alias, preview, lang } = font
        const item = { id, oid, value, url, alias, preview }
        lang === 'zh' ? fontLists['中文'].unshift(item) : fontLists['英文'].unshift(item)
      }
      fontLists['当前页面'] = usePageFontsFilter()
      this.fontClassList = fontLists
      // }
      // const isDev = process.env.NODE_ENV === 'development'
      // if (!isDev) {
      //   const { list } = await api.material.getFonts() // { name: 'SourceHanSansCN-Normal' }
      //   this.fontClassList = this.fontClassList.concat(list)
      // }
    },
    change() {
      if (this.timer) {
        return
      }
      this.timer = true
      setTimeout(() => {
        this.timer = null
      }, 300)
      this.tag = true
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement))
      this.changeStyleIconList()
    },
    changeValue() {
      if (this.tag) {
        this.tag = false
        return
      }
      if (this.dMoving) {
        return
      }
      // TODO 修改数值
      for (let key in this.innerElement) {
        if (this.ingoreKeys.indexOf(key) !== -1) {
          this.dActiveElement[key] = this.innerElement[key]
        } else if (key !== 'setting' && key !== 'record' && this.innerElement[key] !== this.dActiveElement[key]) {
          // console.log('???', key)
          // const pushHistory = !['textEffects', 'transformData', 'fontClass'].includes(key)
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key,
            value: this.innerElement[key],
            pushHistory: false,
          })
        }
      }
    },
    finish(key, value) {
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: key,
        value: value,
        pushHistory: false,
      })
      setTimeout(() => {
        key === 'fontClass' && (this.fontClassList['当前页面'] = usePageFontsFilter())
      }, 300)
    },
    layerAction(item) {
      this.updateLayerIndex({
        uuid: this.dActiveElement.uuid,
        value: item.value,
      })
    },
    async textStyleAction(item) {
      let value = item.key === 'textAlign' ? item.value : item.value[item.select ? 1 : 0]
      this.innerElement[item.key] = value
      // TODO: 对竖版文字的特殊处理
      item.key === 'writingMode' && this.relationChange()
      await this.$nextTick()
      this.$store.commit('updateRect')
    },
    async alignAction(item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid,
      })
      await this.$nextTick()
      this.$store.commit('updateRect')
    },
    changeStyleIconList() {
      for (let i = 0; i < this.styleIconList1.length; ++i) {
        let key = this.styleIconList1[i].key
        this.styleIconList1[i].select = false
        switch (key) {
          case 'fontWeight':
          case 'fontStyle':
            if (this.innerElement[key] !== 'normal') {
              this.styleIconList1[i].select = true
            }
            break
          case 'textDecoration':
            if (this.innerElement[key] !== this.styleIconList1[i].value[0] && this.innerElement[key] == this.styleIconList1[i].value[1]) {
              this.styleIconList1[i].select = !this.styleIconList1[i].select
            }
            break
          case 'writingMode':
            if (this.innerElement[key] !== this.styleIconList1[i].value[0]) {
              this.styleIconList1[i].select = true
            }
            break
        }
      }
      for (let i = 0; i < this.styleIconList2.length; i++) {
        let key = this.styleIconList2[i].key
        this.styleIconList2[i].select = false
        if (key === 'textAlign' && this.innerElement[key] === this.styleIconList2[i].value) {
          this.styleIconList2[i].select = true
          continue
        }
      }
    },
    relationChange() {
      setTimeout(() => {
        if (this.dActiveElement.writingMode) {
          const w_record = this.dActiveElement.width
          this.innerElement.width = this.dActiveElement.height
          this.innerElement.height = w_record
        }
      }, 10)
    },
  },
}
</script>

<style lang="less" scoped>
#w-text-style {
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
  margin-bottom: 12px;
}
.setting-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}

.slide-wrap {
  width: 100%;
  padding: 16px;
  background: #f3f5f7;
  border-radius: 6px;
}
</style>

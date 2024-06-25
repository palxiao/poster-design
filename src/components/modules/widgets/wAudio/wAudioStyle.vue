<template>
  <div id="w-audio-style">
    <el-collapse>
      <el-collapse-item title="设置">
        <menu-show :left="`音频:${state.innerElement.audioName}`">
          <template v-slot:right>
            <el-switch v-model="state.innerElement.isSet" />
          </template>
        </menu-show>
        <menu-show left="播放">
          <template v-slot:right>
            <el-switch v-model="state.innerElement.play" />
          </template>
        </menu-show>
        <menu-show left="颜色">
          <template v-slot:right>
            <color-select v-model="state.innerElement.color" @finish="(value) => finish(`color`, value)"/>
          </template>
        </menu-show>
        <menu-show left="循环">
          <template v-slot:right>
            <el-switch v-model="state.innerElement.loop" />
          </template>
        </menu-show>
        <el-divider content-position="left">选择音乐</el-divider>
        <div class="flex flex-wrap gap-4">
          <el-card v-for="(item, i) in audioList" :key="i" shadow="hover" size="small">
            <menu-show :left="item.name">
              <template v-slot:right>
                <el-button @click="changeAudio(item)">选择</el-button>
              </template>
            </menu-show>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
// 图片组件样式
// const NAME = 'w-audio-style'
import { nextTick, reactive, ref, watch, onBeforeUnmount } from 'vue'

import api from '@/api'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters'
import { TAudioSetting, wAudioSetting } from './wAudioSetting'
import colorSelect from '../../settings/colorSelect.vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useControlStore, useForceStore, useWidgetStore } from '@/store'
import { TUpdateWidgetPayload } from '@/store/design/widget/actions/widget'
import { TupdateLayerIndexData } from '@/store/design/widget/actions/layer'
import { TUpdateAlignData } from '@/store/design/widget/actions/align'

type TState = {
  innerElement: TAudioSetting
}

const state = reactive<TState>({
  innerElement: JSON.parse(JSON.stringify(wAudioSetting)),
})
const audioList = reactive([
  {src: 'https://hxdata.huanxiinv.com/system_assets_music/Tg2kxGdaCR2pfEiO.mp3?v=1705919546', name: '韩文歌', type: '欢快'},
  {src: 'https://hxdata.huanxiinv.com/system_assets_music/tTeTey4uNAdG90EY.mp3?v=1705919252', name: '千与千寻主题曲Always With Me钢琴版', type: '欢快'},
  {src: 'https://hxdata.huanxiinv.com/system_assets_music/DQF83hnjdrmFEaGW.mp3?v=1705919247', name: '玛吉阿米', type: '欢快'},
  {src: 'https://hxdata.huanxiinv.com/system_assets_music/ZWKwxXaHqBCCaBuy.mp3?v=1705919256', name: '震撼大气开场音乐', type: '欢快'},
])


const widgetStore = useWidgetStore()
const forceStore = useForceStore()
const canvasStore = useCanvasStore()
const controlStore = useControlStore()
const { dActiveElement, dWidgets } = storeToRefs(widgetStore)


let lastUuid: string | undefined = undefined


// watch(
//   () => dActiveElement.value,
//   (newValue, oldValue) => {
//     change()
//     if (!newValue) return
//     lastUuid = newValue.uuid
//   },
//   { deep: true }
// )

watch(
  () => state.innerElement,
  (newValue, oldValue) => {
    changeValue()
  },
  { deep: true }
)

function created() {
  change()
}

created()

function change() {
  state.innerElement = JSON.parse(JSON.stringify({ ...state.innerElement, ...dActiveElement.value }))
}

function changeValue() {
  for (let key in state.innerElement) {
    (dActiveElement.value as Record<string, any>)[key] = state.innerElement[(key as keyof TAudioSetting)]
    // if (state.ingoreKeys.indexOf(key) !== -1) {
    //   (dActiveElement.value as Record<string, any>)[key] = state.innerElement[(key as keyof TAudioSetting)]
    // } else if (
    //   key !== 'cropEdit' && key !== 'record' &&
    //   state.innerElement[(key as keyof TAudioSetting)] !== (dActiveElement.value as Record<string, any>)[key]
    // ) {
    //   widgetStore.updateWidgetData({
    //     uuid: dActiveElement.value?.uuid || "",
    //     key: (key as TUpdateWidgetPayload['key']),
    //     value: (state.innerElement[(key as keyof TAudioSetting)] as TUpdateWidgetPayload['value']),
    //   })
    // }
  }
}

// 选中音频
function changeAudio(item){
  state.innerElement.audioName = item.name;
  state.innerElement.src = item.src;
}
</script>

<style lang="less" scoped>
#w-audio-style {
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
  .icon {
    margin-right: 0.3em;
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

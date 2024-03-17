<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-12 11:26:53
 * @Description: 顶部操作按钮组
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-03-11 01:43:30
-->
<template>
  <div class="top-title"><el-input v-model="state.title" placeholder="未命名的设计" class="input-wrap" /></div>
  <div class="top-icon-wrap">
    <template v-if="tempEditing">
      <span style="color: #999; font-size: 14px; margin-right: 0.5rem">{{ state.stateBollean ? '启用' : '停用' }}</span> <el-switch v-model="state.stateBollean" @change="stateChange" />
      <div class="divide__line">|</div>
      <el-button plain type="primary" @click="saveTemp">保存模板</el-button>
      <el-button @click="$store.commit('managerEdit', false)">取消</el-button>
      <div class="divide__line">|</div>
    </template>
    <!-- <el-button @click="draw">绘制(测试)</el-button> -->
    <el-button size="large" class="primary-btn" :disabled="tempEditing" @click="save(false)">保存</el-button>
    <copyRight>
      <el-button :loading="state.loading" size="large" class="primary-btn" :disabled="tempEditing" plain type="primary" @click="download">下载作品</el-button>
    </copyRight>
  </div>
  <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
</template>

<script lang="ts" setup>
import api from '@/api'
import { reactive, toRefs, ref } from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import _dl from '@/common/methods/download'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
import copyRight from './CopyRight.vue'
import _config from '@/config'
import useConfirm from '@/common/methods/confirm'
// import wGroup from '@/components/modules/widgets/wGroup/wGroup.vue'
import { useSetupMapGetters } from '@/common/hooks/mapGetters'

type TProps = {
  modelValue?: boolean
}

type TEmits = {
  (event: 'change', data: {downloadPercent: number, downloadText: string}): void
  (event: 'update:modelValue', data: boolean): void
}

type TState= {
  stateBollean: boolean,
  title: string,
  loading: boolean,
}

const props = defineProps<TProps>()
const emit = defineEmits<TEmits>()
const route = useRoute()
const router = useRouter()
const store = useStore()
const canvasImage = ref<typeof SaveImage | null>(null)
const {
  dPage, dWidgets, tempEditing, dHistory, dPageHistory
} = useSetupMapGetters(['dPage', 'dWidgets', 'tempEditing', 'dHistory', 'dPageHistory'])

const state = reactive<TState>({
  stateBollean: false,
  title: '',
  loading: false,
})

// 保存作品
async function save(hasCover: boolean = false) {
  // Bugs: 历史操作有问题，且page操作未及时入栈 proxy?.dPageHistory
  if (dHistory.value.length <= 0) {
    return
  }
  store.commit('setShowMoveable', false) // 清理掉上一次的选择框
  // console.log(proxy?.dPage, proxy?.dWidgets)
  const { id, tempid } = route.query
  const cover = hasCover ? await draw() : undefined
  const widgets = dWidgets.value // reviseData()
  const { id: newId, stat, msg } = await api.home.saveWorks({ cover, id: (id as string), title: state.title || '未命名设计', data: JSON.stringify({ page: dPage.value, widgets }), temp_id: (tempid as string), width: dPage.value.width, height: dPage.value.height })
  stat !== 0 ? useNotification('保存成功', '可在"我的作品"中查看') : useNotification('保存失败', msg, { type: 'error' })
  !id && router.push({ path: '/home', query: { id: newId }, replace: true })
  store.commit('setShowMoveable', true)
}

    // 保存模板
async function saveTemp() {
  const { tempid, tempType: type } = route.query
  let res = null
  if (Number(type) == 1) {
    // 保存组件，组合元素要保证在最后一位，才能默认选中
    if (dWidgets.value[0].type === 'w-group') {
      const group = dWidgets.value.shift()
      group.record.width = 0
      group.record.height = 0
      dWidgets.value.push(group)
    }
    // TODO：如果保存组件不存在组合，则添加组合。该功能待优化
    if (!dWidgets.value.some((x: Record<string, any>) => x.type === 'w-group')) {
      alert('提交组件必须为组合！')
      return
      // proxy.dWidgets.push(wGroup.setting)
    }
    res = await api.home.saveTemp({ id: tempid, type, title: state.title || '未命名组件', content: JSON.stringify(dWidgets.value), width: dPage.value.width, height: dPage.value.height })
  } else res = await api.home.saveTemp({ id: tempid, title: state.title || '未命名模板', content: JSON.stringify({ page: dPage.value, widgets: dWidgets.value }), width: dPage.value.width, height: dPage.value.height })
  res.stat != 0 && useNotification('保存成功', '模板内容已变更')
}

    // 停用启用
    async function stateChange(e: string | number | boolean) {
      const { tempid, tempType: type } = route.query
      const { stat } = await api.home.saveTemp({ id: tempid, type, state: e ? 1 : 0 })
      stat != 0 && useNotification('保存成功', '模板内容已变更')
    }
    async function download() {
      if (state.loading === true) {
        return
      }
      // 临时提示
      if (state.title === '自设计模板') {
        const isPass = await useConfirm('提示', 'PSD自设计作品暂时保存在Github，下载可能失败', 'warning')
        if (!isPass) {
          return
        }
      }
      state.loading = true
      emit('update:modelValue', true)
      emit('change', { downloadPercent: 1, downloadText: '正在处理封面' })
      await save(true)
      setTimeout(async () => {
        const { id } = route.query
        if (id) {
          const { width, height } = dPage.value
          emit('update:modelValue', true)
          emit('change', { downloadPercent: 1, downloadText: '准备合成图片' })
          state.loading = false
          let timerCount = 0
          const animation = setInterval(() => {
            if (props.modelValue && timerCount < 75) {
              timerCount += RandomNumber(1, 10)
              emit('change', { downloadPercent: 1 + timerCount, downloadText: '正在合成图片' })
            } else {
              clearInterval(animation)
            }
          }, 800)
          await _dl.downloadImg(api.home.download({ id, width, height }) + '&r=' + Math.random(), (progress: number, xhr: any) => {
            if (props.modelValue) {
              clearInterval(animation)
              progress >= timerCount && emit('change', { downloadPercent: Number(progress.toFixed(0)), downloadText: '图片生成中' })
            } else {
              xhr.abort()
            }
          })
          emit('change', { downloadPercent: 100, downloadText: '图片下载中' })
        }
      }, 100)
    }
    function RandomNumber(min: number, max: number) {
      return Math.ceil(Math.random() * (max - min)) + min
    }

// ...mapActions(['pushHistory', 'addGroup']),

async function load(id: number, tempId: number, type: number, cb: () => void) {
  if (route.name !== 'Draw') {
    await useFontStore.init() // 初始化加载字体
  }
  const apiName = tempId && !id ? 'getTempDetail' : 'getWorks'
  if (!id && !tempId) {
    cb()
    return
  }
  const { data: content, title, state: _state, width, height } = await api.home[apiName]({ id: id || tempId, type })
  if (content) {
    const data = JSON.parse(content)
    state.stateBollean = !!_state
    state.title = title
    store.commit('setShowMoveable', false) // 清理掉上一次的选择框
    // this.$store.commit('setDWidgets', [])
    if (type == 1) {
      // 加载文字组合组件
      dPage.value.width = width
      dPage.value.height = height
      store.dispatch('addGroup', data)
      // addGroup(data)
    } else {
      store.commit('setDPage', data.page)
      id ? store.commit('setDWidgets', data.widgets) : store.dispatch('setTemplate', data.widgets)
    }
    cb()
    store.dispatch('pushHistory', '请求加载load')
    // pushHistory('请求加载load')
  }
}

function draw() {
  return new Promise<string>((resolve) => {
    if (!canvasImage.value) resolve('')
    else {
      canvasImage.value.createCover(({ key }: {key: string}) => {
        resolve(_config.IMG_URL + key)
      })
    }
  })
}

defineExpose({
  download,
  save,
  saveTemp,
  stateChange,
  load,
})
</script>

<style lang="less" scoped>
.top-icon-wrap {
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 54px;
  .top-icon {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-weight: bold;
    margin: 8px;
    padding: 5px 8px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
.top-title {
  color: @color-black;
  flex: 1;
  padding-left: 88px;
  // font-weight: bold;
  .input-wrap {
    width: 15rem;
    :deep(input) {
      border-color: #ffffff;
      // border-color: #e8eaec;
    }
  }
  .input-wrap:hover {
    :deep(input) {
      border-color: #e8eaec;
    }
  }
}
.primary-btn {
  font-weight: 600;
  transform: scale(0.95);
  margin-left: 10px;
}

.divide__line {
  margin: 0 1rem;
  color: #e8eaec;
  height: 20px;
}
</style>

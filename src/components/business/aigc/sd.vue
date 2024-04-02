<!--
 * @Author: ShawnPhang
 * @Date: 2024-01-25 10:35:37
 * @Description: SD
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-02-27 21:52:57
-->
<template>
  <div>
    <el-dialog v-model="show" align-center style="width: 88%; max-width: 980px" @close="handleClose">
      <template #header> AIGC（动漫风格大模型） </template>
      <div class="sd-box">
        <div class="left">
          <div class="input-wrap">
            <el-radio-group v-model="typeIndex" type="card" @change="typeChange">
              <el-radio-button :value="0">文生图</el-radio-button>
              <el-radio-button :value="1">图生图</el-radio-button>
              <el-radio-button disabled :value="2">后期处理</el-radio-button>
            </el-radio-group>
            <div v-show="typeIndex == 1" class="wrap">
              <h2 class="wrap-title">参考图</h2>
              <uploader :hold="true" :drag="true" :multiple="false" class="uploader" @load="selectFile">
                <div v-show="progress !== 0" class="mask">
                  <el-progress type="circle" :percentage="progress" />
                </div>
                <img v-if="localImage" :src="localImage" />
                <div v-else class="uploader__box">
                  <icon-upload style="width: 64px; height: 64px" />
                  <div class="el-upload__text">在此拖入或选择<em>上传图片</em></div>
                  <div class="el-upload__tip">支持 jpg/png 格式，大小不超过 500kb </div>
                </div>
              </uploader>
              <br />
              <number-slider v-model="controlNet.weight" style="font-size: 14px" label="权重" :step="0.05" :maxValue="2" />
              <el-radio-group v-model="controlNet.mode">
                <el-radio :value="0">均衡</el-radio>
                <el-radio :value="1">偏向提示词</el-radio>
                <el-radio :value="2">偏向原图</el-radio>
              </el-radio-group>
            </div>
            <div class="wrap">
              <h2 class="wrap-title">提示词 (不支持中文)</h2>
              <el-input v-model="params.prompt" maxlength="300" :autosize="{ minRows: 4, maxRows: 6 }" placeholder="输入引导提示词，仅支持解析英文，若输入中文请翻译文本后再提交" show-word-limit type="textarea" @input="promptTyping" />
              <div style="display: flex; align-items: center; margin-top: 5px; justify-content: space-between">
                <el-button :loading="isLoading" type="primary" link @click="translation"><i v-show="!isLoading" style="margin-right: 5px" class="icon sd-fanyi" />翻译文本</el-button>
                <tool-tip :width="260" placement="bottom-end" effect="dark" :content="tips">
                  <span v-show="tips" class="mini-text" style="margin-top: 2px">相关提示词</span>
                </tool-tip>
              </div>
            </div>
            <div v-show="typeIndex == 0" class="wrap">
              <h2 class="wrap-title">套用预设</h2>
              <div class="presuppose-box">
                <div v-for="p in presuppose" :key="p.value" :class="['presuppose', { p_select: p.value === params.depend }]" @click="setDepend(p)">
                  <div class="img" :style="{ backgroundImage: `url(${p.url})` }">
                    <div v-if="p.value === params.depend" class="cancel">取消</div>
                    <div class="mask">{{ p.name }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="wrap">
              <h2 class="wrap-title">图片比例</h2>
              <el-select v-model="params.ratio" placeholder="选择比例" style="width: 100%">
                <el-option v-for="item in ratios" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left"><i style="margin-right: 1em" :class="['icon', 'sd-scale' + item.value]" />{{ item.label }}</span>
                  <span style="float: right" class="mini-text">{{ item.text }}</span>
                </el-option>
              </el-select>
            </div>
            <div class="wrap">
              <h2 class="wrap-title">高级设置</h2>
              <el-switch v-model="params.is_lcm" active-text="开启极速出图" />
            </div>
          </div>
          <div class="buttom-wrap">
            <div class="mianze">
              <tool-tip :width="260" placement="top-end" effect="dark" content="本服务基于开源AI大模型开发，生成内容不代表本站观点，请遵守法规使用，并承担所有产生的责任。">
                <span style="display: flex"><InfoFilled width="14" />免责声明</span>
              </tool-tip>
            </div>
            <el-button type="primary" style="width: 100%" @click="submit">在线生成</el-button>
          </div>
        </div>
        <div class="images-box">
          <div class="box-header">
            <div style="flex: 1">
              <el-button :loading="listLoading" link @click="refreshList"><Refresh v-if="!listLoading" style="margin-right: 7px" width="14" />{{ listLoading ? '刷新中...' : '任务列表' }}</el-button>
            </div>
            <div class="limit"><span class="mini-text">空间容量:</span> {{ listData.length }} / {{ limit }}</div>
          </div>
          <ul v-if="listData.length > 0" ref="listRef" class="result-list" style="overflow: auto">
            <li v-for="i in listData" :key="'l' + i.id">
              <div class="mini-text title">
                {{ i.created_time }}
                <tool-tip placement="top" :hide-after="10" :offset="6" content="下载图片到本地">
                  <el-button v-show="i.url" style="margin-left: 8px" type="info" link @click="donwload(i)"><icon-download style="margin-right: 4px" width="14" />{{ i.dp ? '下载进度:' + i.dp + '%' : '' }}</el-button>
                </tool-tip>
                <tool-tip placement="top" :hide-after="10" :offset="6" content="发送到「图生图」">
                  <el-button v-show="i.url" style="margin-left: 0" type="info" link @click="exportToImg(i)"><icon-upload style="margin-right: 4px" width="14" /></el-button>
                </tool-tip>
                <tool-tip placement="top" :hide-after="10" :offset="6" content="导入设计器背景图">
                  <el-button v-show="i.url" style="margin-left: 0" type="info" link @click="exportToPage(i)"><icon-switch style="margin-right: 4px" width="14" /></el-button>
                </tool-tip>
                <el-popconfirm title="是否确认删除?" confirm-button-text="确认" cancel-button-text="取消" @confirm="del(i.id)">
                  <template #reference>
                    <el-button v-show="i.state" style="margin-left: 0" type="info" link><icon-delete width="14" /></el-button>
                  </template>
                </el-popconfirm>
              </div>
              <img v-if="i.nsfw" :style="{ width: '220px' }" src="https://store.palxp.cn/no_safe.jpg" />
              <el-progress v-else-if="!i.url" :percentage="i.progress" :status="i.state==2?'exception':''" :stroke-width="15" striped striped-flow :duration="10">
                <div v-if="i.state==2" style="padding: 0 12px 0 4px" class="mini-text">生成失败</div>
                <div v-else style="padding: 0 12px 0 4px" class="mini-text">{{ i.progress ? `生成中 ${i.progress} %` : '排队中...' }}</div>
              </el-progress>
              <el-image v-else :style="{ height: getViewHeight(i) }" class="result-image" :src="i.url.replace('.png', '_tiny.png')" fit="fill" hide-on-click-modal :lazy="true" :preview-src-list="[i.url]" />
            </li>
          </ul>
          <el-empty v-else v-loading="listLoading" style="height: 80%" description="还没有图片，请从左侧面板中点击生成" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import { ElOption, ElSelect, ElEmpty, ElRadioGroup, ElRadioButton, ElRadio, ElProgress, ElPopconfirm } from 'element-plus'
import { InfoFilled, Refresh, Delete as IconDelete, Download as IconDownload, Switch as IconSwitch, Picture as IconUpload } from '@element-plus/icons-vue'
import toolTip from '@/components/common/PopoverTip.vue'
import { useControlStore, useCanvasStore } from '@/store'
import api from '@/api'
import useNotification from '@/common/methods/notification'
import ratios from './ratioOptions.ts'
import presuppose from './presuppose.ts'
import dayjs from 'dayjs'
import downloadImg from '@/common/methods/download/download.ts'
import uploader from '@/components/common/Uploader/index.vue'
import numberSlider from '@/components/modules/settings/numberSlider.vue'

export default {
  components: { ElPopconfirm, ElOption, ElSelect, ElEmpty, toolTip, InfoFilled, ElRadioGroup, ElRadioButton, ElRadio, Refresh, IconDownload, IconDelete, ElProgress, IconSwitch, IconUpload, uploader, numberSlider },
  setup() {
    const controlStore = useControlStore()
    const pageStore = useCanvasStore()
    const promptRecord = ['','']
    const state = reactive({
      show: false,
      isLoading: false,
      listLoading: false,
      typeIndex: 0, // 0 文生图 1 图生图 2 高清修复
      params: { prompt: '', ratio: '1_1', is_lcm: true, img_url: '' },
      localImage: '', // 未提交上传的图片
      controlNet: { weight: 0.5, mode: 0 },
      progress: 0,
      limit: '-',
      listData: [],
      tips: '', // 预设提示词
      fileList: []
    })
    let localImageFile = null
    const listRef = ref(null)

    const getListData = (toTop = true) => {
      state.listLoading = true
      api.ai
        .getTaskList()
        .then((res) => {
          state.limit = res.limit
          state.listData = res.list.map((x) => {
            x.created_time = dayjs(x.created_time).format('YYYY年MM月DD日 HH:mm:ss')
            return x
          })
          setTimeout(() => {
            listRef.value && toTop && (listRef.value.scrollTop = 0)
            state.listLoading = false
          }, 300)
        })
        .catch((e) => {
          state.listLoading = false
        })
    }

    const open = async () => {
      controlStore.setShowMoveable(false)
      state.show = true
      getListData()
    }

    const handleClose = () => {
      controlStore.setShowMoveable(true)
      clearTimeout(curTimer)
    }

    const submit = async () => {
      try {
        if (containsChinese(state.params.prompt)) {
          await translation()
        }
        let control_net = ''
        if (state.typeIndex == 1) {
          if (state.progress !== 0) {
            return
          } else {
            state.progress = 1
            await fileUpload()
          }
          const {weight, mode} = state.controlNet
          control_net = JSON.stringify([weight, mode])
        }
        const id = await api.ai.addTask({...state.params, type: state.typeIndex, control_net})
        useNotification('创建成功', '请在任务列表中查看', { type: 'success' })
        await getListData()
        taskTimerQueue.push({ id, count: 0 })
        startTaskRunner()
      } catch (error) {
        state.progress = 0
        console.log(error);
      }
    }
    // 获取详情
    const taskTimerQueue = [] // task轮训队列
    let taskItem = {} // 正在修改的任务
    const reTryNum = 50 // 重试次数
    const timeInterval = 2000
    let curTimer = null // 当前定时器
    const startTaskRunner = () => {
      if (!curTimer) {
        const task = taskTimerQueue.shift()
        if (task) {
          curTimer = setTimeout(() => {
            getTask(task)
          }, timeInterval)
        }
      }
    }
    const getTask = async (task) => {
      const res = await api.ai.getTask({ id: task.id })
      taskItem = state.listData.find((x) => x.id == task.id)
      taskItem.progress = res.progress
      taskItem.state = res.state
      taskItem.nsfw = res.nsfw
      taskItem.url = res.url
      task.count += 1
      if (task.count > reTryNum || res.state) {
        curTimer = null
        startTaskRunner()
      } else {
        curTimer = setTimeout(() => {
          getTask(task)
        }, timeInterval)
      }
    }

    // 翻译中英
    const translation = async () => {
      state.isLoading = true
      try {
        const res = await api.ai.translation({ text: state.params.prompt })
        state.params.prompt = res
      } catch (error) {}
      state.isLoading = false
    }

    // 刷新列表
    const refreshList = () => {
      getListData()
    }

    // 删除
    const del = async (id) => {
      await api.ai.delTask({ id })
      getListData(false)
    }

    // 下载图片
    const donwload = (i) => {
      if (!i.dp) {
        downloadImg(i.url, (d) => {
          i.dp = d === 100 ? null : d.toFixed(2)
        })
      }
    }

    // 导入画布
    const exportToPage = (i) => {
      const { url, width, height } = i
      pageStore.dPage.backgroundImage = url
      pageStore.dPage.width = width
      pageStore.dPage.height = height
    }
    // 导入图生图
    const exportToImg = ({url}) => {
      state.localImage = url.replace('.png', '_tiny.png')
      state.params.img_url = url
      state.typeIndex = 1
    }

    // 选择图片
    const selectFile = async (file) => {
      state.progress = 0
      if (file.size > 1024 * 1024 / 2) {
        state.localImage = ''
        useNotification('上传图片超出限制', '请重新选择图片上传', { type: 'error' })
        return false
      }
      // 显示选择的图片
      localImageFile = file
      state.localImage = URL.createObjectURL(file)
      // 清空图片缓存
      state.params.img_url = ''      
    }
    // 上传图片
    const fileUpload = async () => {
      if (!state.params.img_url && state.localImage) {
        // 上传本地图片
      const name = (new Date()).getTime()+'_'+(Math.floor(Math.random() * 990000) + 10000)
      const result = await api.material.upload({file: localImageFile, name}, (up, dp) => {
          if (up < 100) {
            state.progress = up
          } else {
            state.progress = 100
            setTimeout(() => {
              state.progress = 0
            }, 600);
          }
      })
      state.params.img_url = result.url
      } else state.progress = 0
    }

    const setDepend = (p) => {
      state.params.depend = state.params.depend === p.value ? '' : p.value
      state.params.prompt = state.params.depend ? p.prompt : ''
      state.params.ratio = state.params.depend ? p.ratio : '1_1'
      state.tips = state.params.depend ? p.tips || '' : ''
    }

    const getViewHeight = ({ width, height }) => 220 * (height / width) + 'px'

    // 检测是否包含中文
    const containsChinese = (str) => /[\u4e00-\u9fa5]/.test(str)

    // 打字中
    function promptTyping(v) {
      promptRecord[state.typeIndex] = v
    }
    function typeChange(index) {
      state.params.prompt = promptRecord[index]
    }

    return {
      ...toRefs(state),
      open,
      handleClose,
      submit,
      setDepend,
      translation,
      presuppose,
      ratios,
      getListData,
      refreshList,
      listRef,
      del,
      donwload,
      exportToPage,
      exportToImg,
      getViewHeight,
      selectFile,
      promptTyping,
      typeChange
    }
  },
}
</script>

<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding: 10px 24px 20px 24px !important;
}
:deep(.el-upload-dragger) {
  padding: 10px;
}
.sd-box {
  height: calc(95vh - 120px);
  display: flex;
  .left {
    position: relative;
    width: 348px;
    padding-right: 24px;
  }
  .left::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 2px;
    background: #f0f1f4;
  }
  .input-wrap {
    height: calc(100% - 67px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .input-wrap::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .wrap {
    position: relative;
    border-radius: 10px;
    margin-top: 24px;
    padding: 16px 14px;
    background-color: rgb(243 244 249);
  }
  .wrap:first-child {
    margin-top: 0;
  }
  .wrap-title {
    user-select: none;
    font-size: 14px;
    font-weight: 600;
    padding-bottom: 12px;
  }
  .presuppose-box {
    display: flex;
    flex-wrap: wrap;
    .p_select {
      border: 2px solid var(--el-color-primary);
      .img {
        opacity: 1;
      }
    }
  }
  .presuppose {
    padding: 2px;
    overflow: hidden;
    position: relative;
    width: 90px;
    height: 90px;
    margin-bottom: 7px;
    border-radius: 8px;
    cursor: pointer;
    .cancel {
      opacity: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cancel:hover {
      opacity: 1;
    }
    .img {
      border-radius: 8px;
      overflow: hidden;
      height: 100%;
      width: 100%;
      opacity: 0.9;
      background-size: 100%;
      background-position: center center;
      position: relative;
    }
    .img:hover {
      transition: all 0.3s;
      opacity: 1;
      background-size: 120%;
      // transform: scale3d(1.15, 1.15, 1);
    }
    .mask {
      border-radius: 0 0 8px 8px;
      position: absolute;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
      font-size: 13px;
      line-height: 24px;
      text-align: center;
      color: #ffffff;
      bottom: 0;
      left: 0;
      height: 22px;
      width: 100%;
      backdrop-filter: blur(6px);
    }
  }
  .presuppose:nth-child(3n-2),
  .presuppose:nth-child(3n-1) {
    margin-right: 13px;
  }
  .images-box {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    padding-left: 24px;
    .box-header {
      display: flex;
      // padding-bottom: 0px;
      .limit {
        user-select: none;
        color: var(--el-text-color-secondary);
      }
    }
  }
  .buttom-wrap {
    width: 100%;
    padding-top: 12px;
  }
  .mianze {
    width: 100%;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    height: 22px;
    span {
      cursor: pointer;
      float: right;
    }
  }

  .result-list {
    height: calc(100% - 34px);
    padding: 0;
    margin: 12px 0;
    list-style: none;
    li {
      padding-top: 20px;
    }
    li:first-child {
      padding-top: 0;
    }
    .title {
      user-select: none;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .result-image {
      width: 220px;
      border-radius: 10px;
    }
  }
}
.mini-text {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.uploader {
  &__box {
    position: relative;
    padding: 30px 0;
    color: #a8abb2;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .mask {
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, .6);
  }
  img {
    height: 240px;
    width: 100%;
    object-fit: contain;
  }
}
</style>

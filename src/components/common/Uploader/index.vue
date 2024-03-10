<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 18:17:13
 * @Description: 二次封装上传组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @Date: 2024-03-05 10:50:00
-->
<template>
  <el-upload action="" accept="image/*" :http-request="upload" :show-file-list="false" multiple>
    <slot>
      <el-button size="small">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
    </slot>
  </el-upload>
</template>

<script lang="ts" setup>
import { onMounted, nextTick, defineProps, withDefaults, defineEmits } from 'vue'
import { ElUpload, UploadRequestOptions } from 'element-plus'
import Qiniu from '@/common/methods/QiNiu'
import { getImage } from '@/common/methods/getImgDetail'
import _config from '@/config'
import useNotification from '@/common/methods/notification'

type TModelData = {
  num?: string | number
  ratio?: string
}

export type TUploadDoneData = {
  width: number
  height: number
  url: string
}

type TQiNiuUploadReturn = { hash: string, key: string }

type TProps = {
  modelValue?: TModelData
  options?: { bucket: string, prePath: string }
  hold?: boolean
}

type TEmits = {
  (event: 'done', data: TUploadDoneData): void
  (event: 'update:modelValue', data: TModelData): void
  (event: 'load', data: File): void
}

const props = withDefaults(defineProps<TProps>(), {
  modelValue: () => ({}),
  options: () => ({ bucket: 'xp-design', prePath: 'user' }),
  hold: false
})

const emit = defineEmits<TEmits>()

let uploading: boolean = false // 上传状态Flag
let timer: number

let uploadList: File[] = [] // 上传队列
let index: number = 0 // 当前上传的脚标
let count: number = 0 // 当前上传总数

let tempSimpleRes: TQiNiuUploadReturn | null // 单个文件上传时返回

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    // 加载七牛上传插件
    const link_element = document.createElement('script')
    link_element.setAttribute('src', _config.QINIUYUN_PLUGIN)
    document.head.appendChild(link_element)
  }, 1000)
})

const upload = async ({ file }: UploadRequestOptions) => {
  if (props.hold) {
    emit('load', file)
    return
  }
  uploadList.push(file)
  clearTimeout(timer)
  count++
  updatePercent(null)
  uploadQueue()
}

// 上传队列
const uploadQueue = async () => {
  if (!uploading) {
    uploading = true
    const file = uploadList[0]
    if (file) {
      if (file.size <= 1024 * 1024) {
        tempSimpleRes = await qiNiuUpload(file) // 队列有文件，执行上传
        console.log("tempSimpleRes", tempSimpleRes)
        const { width, height } = await getImage(file)
        useNotification('上传成功', '公共测试账户，上传请注意保护隐私哦!', { position: 'bottom-left' })
        emit('done', { width, height, url: _config.IMG_URL + tempSimpleRes?.key }) // 单个文件进行响应
      } else useNotification('爱护小水管', '请上传小于 1M 的图片哦!', { type: 'error', position: 'bottom-left' })
      uploading = false
      handleRemove() // 移除已上传文件
      index++
      updatePercent(null)
      uploadQueue()
    } else {
      uploading = false
      timer = setTimeout(() => {
        index = count = 0
        updatePercent(0)
      }, 3000)
    }
  }
}

const qiNiuUpload = async (file: File): Promise<null | TQiNiuUploadReturn> => {
  updatePercent(0)
  return new Promise(async (resolve) => {
    if (props.hold) {
      emit('load', file)
      resolve(null)
    } else {
      const result = await Qiniu.upload(file, props.options, (res: Type.Object) => {
        updatePercent(res.total.percent)
      })
      resolve(result)
    }
  })
}

// 更新视图
const updatePercent = (p?: number | null) => {
  const num = typeof p === 'number' ? String(p) : p
  const percent = { ...props.modelValue }
  percent.num = num ? Number(num).toFixed(0) : percent.num
  percent.ratio = count ? `${index} / ${count}` : ''
  emit('update:modelValue', percent)
}
const handleRemove = () => {
  uploadList.length > 0 && uploadList.splice(0, 1)
}

defineExpose({
  upload,
})
</script>

<style lang="less" scoped>
:deep(.el-upload) {
  display: inherit;
}
</style>

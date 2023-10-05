<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-29 18:17:13
 * @Description: 二次封装上传组件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-05 15:46:02
-->
<template>
  <el-upload action="" accept="image/*" :http-request="upload" :show-file-list="false" multiple>
    <slot>
      <el-button size="small">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
    </slot>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick } from 'vue'
import { ElUpload } from 'element-plus'
import Qiniu from '@/common/methods/QiNiu'
import { getImage } from '@/common/methods/getImgDetail'
import _config from '@/config'
import useNotification from '@/common/methods/notification'

export default defineComponent({
  components: { ElUpload },
  props: {
    modelValue: {},
    options: {
      default: () => {
        return { bucket: 'xp-design', prePath: 'user' }
      },
    },
    hold: {
      default: false, // 是否阻止上传操作，仅做文件选择
    },
  },
  emits: ['done', 'update:modelValue', 'load'],
  setup(props, context) {
    let uploading: boolean = false // 上传状态Flag
    let timer: any = null

    let uploadList: any[] = [] // 上传队列
    let index: number = 0 // 当前上传的脚标
    let count: number = 0 // 当前上传总数

    let tempSimpleRes: any = null // 单个文件上传时返回

    onMounted(async () => {
      await nextTick()
      setTimeout(() => {
        // 加载七牛上传插件
        const link_element = document.createElement('script')
        link_element.setAttribute('src', _config.QINIUYUN_PLUGIN)
        document.head.appendChild(link_element)
      }, 1000)
    })

    const upload = ({ file }: any) => {
      if (props.hold) {
        context.emit('load', file)
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
            const { width, height }: any = await getImage(file)
            useNotification('上传成功', '公共测试账户，上传请注意保护隐私哦!', { position: 'bottom-left' })
            context.emit('done', { width, height, url: _config.IMG_URL + tempSimpleRes.key }) // 单个文件进行响应
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
    const qiNiuUpload = async (file: File) => {
      updatePercent(0)
      return new Promise(async (resolve: Function) => {
        if (props.hold) {
          context.emit('load', file)
          resolve()
        } else {
          const result: any = await Qiniu.upload(file, props.options, (res: Type.Object) => {
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
      context.emit('update:modelValue', percent)
    }
    const handleRemove = () => {
      uploadList.length > 0 && uploadList.splice(0, 1)
    }

    return {
      upload,
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.el-upload) {
  display: inherit;
}
</style>

<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-01 11:12:17
 * @Description: 前端出图 - 已废弃
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-11 16:58:34
-->
<template>
  <div v-show="fillInfoing" class="fill-info-wrap">
    <div v-loading="loading" class="fill-info-content">
      <div class="fill-info-step">
        <div id="cover-wrap">
          <img id="cover" />
        </div>
        <div class="publish-btn" @click="saveImg">
          <span v-show="!publishing">下载图片</span>
          <i v-show="publishing" class="el-icon-loading"></i>
        </div>
        <div class="close-publish" @click="closePublish">关闭</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import html2canvas from 'html2canvas'
import api from '@/api'
import useLoading from '@/common/methods/loading'

export default defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, context) {
    let gridSizeIndex: number = 0

    const state = reactive({
      fillInfoing: false,
      loading: false,
      publishing: false,
    })

    watch(
      () => props.modelValue,
      (open) => {
        if (open) {
          save()
        }
      },
    )

    const closePublish = () => {
      state.fillInfoing = false
      context.emit('update:modelValue', false)
    }

    function fileOrBlobToDataURL(obj: any, cb: Function) {
      let a = new FileReader()
      a.readAsDataURL(obj)
      a.onload = (e: any) => {
        cb(e.target.result)
      }
    }
    function blobToImage(blob: any) {
      return new Promise((resolve) => {
        fileOrBlobToDataURL(blob, (dataurl: string) => {
          resolve(dataurl)
        })
      })
    }

    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance

    async function save() {
      // state.loading = true
      // state.fillInfoing = true
      let nowGrideSizeIndex = gridSizeIndex
      let nowZoom = proxy?.dZoom
      // 取消选中元素
      proxy?.selectWidget({
        uuid: '-1',
      })
      gridSizeIndex = 0
      proxy?.updateZoom(100)
      const opts = {
        useCORS: true, // 跨域图片
        scale: 0.4,
      }
      setTimeout(async () => {
        html2canvas(document.getElementById('page-design-canvas'), opts).then((canvas) => {
          canvas.toBlob(
            async (blob: any) => {
              const data = await blobToImage(blob)
              document.getElementById('cover').src = data
              state.loading = false
              gridSizeIndex = nowGrideSizeIndex
              proxy?.updateZoom(nowZoom)
              proxy?.saveImg()
            },
            'image/jpeg',
            0.2,
          )
        })
      }, 300)
    }

    function saveImg() {
      if (state.publishing) {
        return
      }
      state.publishing = true
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height

        const context = canvas.getContext('2d')
        context?.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png')

        let a = document.createElement('a')
        let event = new MouseEvent('click')

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘  ’作为默认名称
        a.download = name || '生成图片'
        a.href = url

        // 触发a的单击事件
        a.dispatchEvent(event)
      }

      image.src = document.getElementById('cover').src
      state.publishing = false
      state.fillInfoing = false
    }

    async function createImg(cb: any) {
      let loading: any = useLoading('保存封面中')
      let nowGrideSizeIndex = gridSizeIndex
      let nowZoom = proxy?.dZoom
      // 取消选中元素
      proxy?.selectWidget({
        uuid: '-1',
      })
      gridSizeIndex = 0
      proxy?.updateZoom(100)
      const opts = {
        useCORS: true, // 跨域图片
        scale: 0.4,
      }
      setTimeout(async () => {
        html2canvas(document.getElementById('page-design-canvas'), opts).then(async (canvas) => {
          cb(canvas.toDataURL('image/jpeg', 0.6))
          gridSizeIndex = nowGrideSizeIndex
          proxy?.updateZoom(nowZoom)
          loading.close()
        })
      }, 301)
    }

    return {
      save,
      closePublish,
      saveImg,
      createImg,
      ...toRefs(state),
    }
  },
  computed: {
    ...mapGetters(['dZoom', 'dPage']),
  },
  methods: {
    ...mapActions(['selectWidget', 'updateZoom']),
  },
})
</script>

<style lang="less" scoped>
// Width variables (appears count calculates by raw css)
@width00: 400px; // Appears 2 times
@width20: 100%; // Appears 2 times

// Height variables (appears count calculates by raw css)
@height20: 400px; // Appears 2 times

.fill-info-wrap {
  background-color: rgba(0, 0, 0, 0.8);
  height: 100%;
  padding: 50px;
  position: absolute;
  width: @width20;
  z-index: 9999;
  .fill-info-content {
    background-color: @color-white;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-height: 861px;
    min-height: 600px;
    padding: 20px;
    width: 600px;
    .fill-info-step {
      flex: 1;
      width: @width20;
      #cover-wrap {
        align-items: center;
        display: flex;
        height: @height20;
        justify-content: center;
        margin: 20px auto;
        width: @width00;
        #cover {
          box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
          max-height: @height20;
          max-width: @width00;
        }
      }
      .publish-btn {
        background-color: @color-main;
        border-radius: 5px;
        color: @color-white;
        cursor: pointer;
        margin: 20px auto;
        padding: 10px;
        text-align: center;
        &:hover {
          background-color: @color-dark-gray;
        }
      }
      .close-publish {
        background-color: @color-white;
        border-radius: 5px;
        color: @color-main;
        cursor: pointer;
        margin-bottom: 0px;
        margin: 20px auto;
        outline: 1px solid @color-main;
        padding: 10px;
        text-align: center;
        &:hover {
          background-color: @color-dark-gray;
          color: @color-white;
        }
      }
    }
  }
}
</style>

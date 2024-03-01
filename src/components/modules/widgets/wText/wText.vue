<template>
  <div
    :id="params.uuid"
    ref="widget"
    v-loading="loading"
    :class="['w-text', { editing: editable, 'layer-lock': params.lock }, params.uuid]"
    :style="{
      position: 'absolute',
      left: params.left - parent.left + 'px',
      top: params.top - parent.top + 'px',
      width: params.width + 'px',
      minWidth: params.fontSize + 'px',
      minHeight: params.fontSize * params.lineHeight + 'px',
      height: params.height + 'px',
      lineHeight: params.fontSize * params.lineHeight + 'px',
      letterSpacing: (params.fontSize * params.letterSpacing) / 100 + 'px',
      fontSize: params.fontSize + 'px',
      color: params.color,
      textAlign: params.textAlign,
      fontWeight: params.fontWeight,
      fontStyle: params.fontStyle,
      textDecoration: params.textDecoration,
      opacity: params.opacity,
      backgroundColor: params.backgroundColor,
      writingMode: params.writingMode,
      fontFamily: `'${params.fontClass.value}'`,
    }"
    @dblclick="(e) => dblclickText(e)"
  >
    <template v-if="params.textEffects && !editable">
      <div
        v-for="(ef, efi) in params.textEffects"
        :key="efi + 'effect'"
        :style="{
          fontFamily: `'${params.fontClass.value}'`,
          color: ef.filling && ef.filling.enable && ef.filling.type === 0 ? ef.filling.color : 'transparent',
          webkitTextStroke: ef.stroke && ef.stroke.enable ? `${ef.stroke.width}px ${ef.stroke.color}` : undefined,
          textShadow: ef.shadow && ef.shadow.enable ? `${ef.shadow.offsetX}px ${ef.shadow.offsetY}px ${ef.shadow.blur}px ${ef.shadow.color}` : undefined,
          backgroundImage: ef.filling && ef.filling.enable ? (ef.filling.type === 0 ? undefined : getGradientOrImg(ef)) : undefined,
          webkitBackgroundClip: ef.filling && ef.filling.enable ? (ef.filling.type === 0 ? undefined : 'text') : undefined,
          transform: ef.offset && ef.offset.enable ? `translate(${ef.offset.x}px, ${ef.offset.y}px)` : undefined,
        }"
        class="edit-text effect-text"
        spellcheck="false"
        v-html="params.text"
      ></div>
    </template>
    <div ref="editWrap" :style="{ fontFamily: `'${params.fontClass.value}'` }" class="edit-text" spellcheck="false" :contenteditable="editable ? 'plaintext-only' : false" @input="writingText($event)" @blur="writeDone($event)" v-html="params.text"></div>
  </div>
</template>

<script>
// 文本组件
const NAME = 'w-text'

import { defineComponent, reactive, toRefs, computed, onUpdated, watch, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { fontWithDraw } from '@/utils/widgets/loadFontRule'
import getGradientOrImg from './getGradientOrImg.ts'

export default defineComponent({
  name: NAME,
  setting: {
    name: '文本',
    type: NAME,
    uuid: -1,
    editable: false,
    left: 0,
    top: 0,
    transform: '',
    lineHeight: 1.5,
    letterSpacing: 0,
    fontSize: 24,
    zoom: 1,
    fontClass: {
      alias: '站酷快乐体',
      id: 543,
      value: 'zcool-kuaile-regular',
      url: 'https://lib.baomitu.com/fonts/zcool-kuaile/zcool-kuaile-regular.woff2',
    },
    fontFamily: 'SourceHanSansSC-Regular',
    fontWeight: 'normal',
    fontStyle: 'normal',
    writingMode: 'horizontal-tb',
    textDecoration: 'none',
    color: '#000000ff',
    textAlign: 'left',
    text: '',
    opacity: 1,
    backgroundColor: '',
    parent: '-1',
    record: {
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      dir: 'horizontal',
    },
  },
  props: ['params', 'parent'],
  setup(props) {
    const store = useStore()
    const route = useRoute()
    const state = reactive({
      loading: false,
      editable: false,
      loadFontDone: false,
    })
    const widget = ref(null)
    const editWrap = ref(null)

    const dActiveElement = computed(() => store.getters.dActiveElement)
    const isDraw = computed(() => route.name === 'Draw' && fontWithDraw)

    onUpdated(() => {
      updateRecord()
    })

    onMounted(() => {
      updateRecord()
      props.params.transform && (widget.value.style.transform = props.params.transform)
      props.params.rotate && (widget.value.style.transform += `translate(0px, 0px) rotate(${props.params.rotate}) scale(1, 1)`)
      // store.commit('updateRect')
    })

    watch(
      () => props.params,
      async (nval) => {
        updateText()
        if (state.loading) {
          return
        }
        let font = nval.fontClass
        const isDone = font.value === state.loadFontDone

        if (font.url && !isDone) {
          if (font.id && isDraw.value) {
            // 如果为绘制模式，且开启了字体抽取，那么会跳过加载字体url的逻辑
            // 此前该功能在demo中存在换行bug，实际上是由于抽取字体时忽略了空格导致的
            state.loading = false
            return
          }
          state.loading = !isDraw.value
          const loadFont = new window.FontFace(font.value, `url(${font.url})`)
          await loadFont.load()
          document.fonts.add(loadFont)
          state.loadFontDone = font.value
          state.loading = false
        } else {
          state.loading = false
        }
      },
      { immediate: true, deep: true },
    )

    watch(
      () => state.editable,
      (value) => {
        store.dispatch('updateWidgetData', {
          uuid: props.params.uuid,
          key: 'editable',
          value,
          pushHistory: false,
        })
      },
    )

    function updateRecord() {
      if (dActiveElement.value.uuid === props.params.uuid) {
        let record = dActiveElement.value.record
        record.width = widget.value.offsetWidth
        record.height = widget.value.offsetHeight
        record.minWidth = props.params.fontSize
        record.minHeight = props.params.fontSize * props.params.lineHeight
        writingText()
      }
    }

    function updateText(e) {
      const value = e ? e.target.innerHTML : props.params.text.replace(/\n/g, '<br/>')
      // const value = (e ? e.target.innerText : props.params.text).replace(/<br\/>/g, '\r\n').replace(/&nbsp;/g, ' ')
      if (value !== props.params.text) {
        store.dispatch('updateWidgetData', {
          uuid: props.params.uuid,
          key: 'text',
          value,
          pushHistory: false,
        })
      }
    }

    function writingText(e) {
      // updateText(e)
      // TODO: 修正文字选框高度
      const el = editWrap.value || widget.value
      store.dispatch('updateWidgetData', {
        uuid: props.params.uuid,
        key: 'height',
        value: el.offsetHeight,
        pushHistory: false,
      })
      store.commit('updateRect')
    }

    function writeDone(e) {
      state.editable = false
      setTimeout(() => {
        store.dispatch('pushHistory', '文字修改')
      }, 100)
      updateText(e)
    }

    function dblclickText(e) {
      // store.commit('setShowMoveable', false)
      state.editable = true
      const el = editWrap.value || widget.value
      setTimeout(() => {
        el.focus()
        if (document.selection) {
          const range = document.body.createTextRange()
          range.moveToElementText(el)
          range.select()
        } else if (window.getSelection) {
          const range = document.createRange()
          range.selectNodeContents(el)
          window.getSelection().removeAllRanges()
          window.getSelection().addRange(range)
        }
      }, 100)
    }

    return {
      ...toRefs(state),
      getGradientOrImg,
      updateRecord,
      writingText,
      updateText,
      writeDone,
      dblclickText,
      widget,
      editWrap,
    }
  },
})
</script>

<style lang="less" scoped>
.w-text {
  // cursor: pointer;
  user-select: none;
}
.w-text.editing {
  cursor: text;
  user-select: text;
}
.edit-text {
  outline: none;
  word-break: break-word;
  // white-space: pre;
  margin: 0;
}
.effect-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

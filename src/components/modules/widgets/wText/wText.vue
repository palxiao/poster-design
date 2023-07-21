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
          color: ef.filling && ef.filling.type === 0 ? ef.filling.color : 'transparent',
          webkitTextStroke: ef.stroke ? `${ef.stroke.width}px ${ef.stroke.color}` : undefined,
          textShadow: ef.shadow ? `${ef.shadow.offsetX}px ${ef.shadow.offsetY}px ${ef.shadow.blur}px ${ef.shadow.color}` : undefined,
          backgroundImage: ef.filling ? (ef.filling.type === 0 ? undefined : getGradientOrImg(ef)) : undefined,
          webkitBackgroundClip: ef.filling ? (ef.filling.type === 0 ? undefined : 'text') : undefined,
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

import { mapGetters, mapActions } from 'vuex'
// import api from '@/api'

export default {
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
      alias: '思源黑体 常规',
      id: 206607,
      value: 'SourceHanSansSC-Regular',
      url: 'https://font.palxp.com/SourceHanSansSC-Regular.woff',
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
  data() {
    return {
      loading: false,
      editable: false,
      loadFontDone: false,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement']),
    isDraw() {
      return this.$route.name === 'Draw'
    },
  },
  watch: {
    params: {
      async handler(nval) {
        this.updateText()
        if (this.loading) {
          return
        }
        let font = nval.fontClass
        const isDone = font.value === this.loadFontDone

        if (font.url && !isDone) {
          if (font.id && this.isDraw) {
            this.loading = false
            return
          }
          this.loading = true
          const loadFont = new window.FontFace(font.value, `url(${font.url})`)
          await loadFont.load()
          document.fonts.add(loadFont)
          this.loadFontDone = font.value
          this.loading = false
        } else {
          this.loading = false
        }
      },
      immediate: true,
      deep: true,
    },
    editable(value) {
      this.updateWidgetData({
        uuid: this.params.uuid,
        key: 'editable',
        value,
        pushHistory: false,
      })
    },
  },
  updated() {
    this.updateRecord()
  },
  async mounted() {
    this.updateRecord()
    // await this.$nextTick()
    this.styleEffect()
    this.params.transform && (this.$refs.widget.style.transform = this.params.transform)
    this.params.rotate && (this.$refs.widget.style.transform += `translate(0px, 0px) rotate(${this.params.rotate}) scale(1, 1)`)
    // this.$store.commit('updateRect')
  },
  methods: {
    ...mapActions(['updateWidgetData', 'pushHistory']),
    getGradientOrImg(ef) {
      return ef.filling.type === 2 ? `linear-gradient(${ef.filling.gradient.angle}deg, ${ef.filling.gradient.stops[0].color} ${Number(ef.filling.gradient.stops[0].offset) * 100}%, ${ef.filling.gradient.stops[1].color} ${Number(ef.filling.gradient.stops[1].offset) * 100}%)` : `url(${ef.filling.imageContent.image})`
    },
    styleEffect() {
      if (this.params.textEffects && this.params.textEffects.length > 0) {
        const style = this.params.textEffects[this.params.textEffects.length - 1]
        if (style.filling && style.filling.color && style.filling.type == 0) {
          this.params.color = style.filling.color
        }
      }
      // if (this.params.textEffects && this.params.textEffects.length <= 2 && this.params.textEffects[0]) {
      //   // 填充
      //   const grad = this.params.textEffects[0].type == 1 && this.params.textEffects[0].filling?.gradient
      // if (grad) {
      //   this.$refs.widget.style['-webkit-background-clip'] = 'text' // background-clip: text;
      //   // this.$refs.widget.style['-webkit-text-fill-color'] = 'transparent' // -webkit-text-fill-color: transparent;
      //   // // this.$refs.widget.style.backgroundImage = `url('https://st-gdx.dancf.com/gaodingx/0/personal/my-tasks/20210827-183407-abd3.jpg?x-oss-process=image/resize,w_176,h_176,m_fill/interlace,1,image/format,webp')`
      //   this.$refs.widget.style.backgroundImage = `linear-gradient(${grad.angle}deg, ${grad.stops[0].color} ${Number(grad.stops[0].offset) * 100}%, ${grad.stops[1].color} ${Number(grad.stops[1].offset) * 100}%)`
      // }
      // }
    },
    updateRecord() {
      if (this.dActiveElement.uuid === this.params.uuid) {
        let record = this.dActiveElement.record
        record.width = this.$refs.widget.offsetWidth
        record.height = this.$refs.widget.offsetHeight
        record.minWidth = this.params.fontSize
        record.minHeight = this.params.fontSize * this.params.lineHeight
        this.writingText()
      }
    },
    updateText(e) {
      const value = e ? e.target.innerHTML : this.params.text.replace(/\n/g, '<br/>')
      // const value = (e ? e.target.innerText : this.params.text).replace(/<br\/>/g, '\r\n').replace(/&nbsp;/g, ' ')
      if (value !== this.params.text) {
        this.updateWidgetData({
          uuid: this.params.uuid,
          key: 'text',
          value,
          pushHistory: false,
        })
      }
    },
    writingText(e) {
      // this.updateText(e)
      // TODO: 修正文字选框高度
      const el = this.$refs.editWrap || this.$refs.widget
      this.updateWidgetData({
        uuid: this.params.uuid,
        key: 'height',
        value: el.offsetHeight,
        pushHistory: false,
      })
      this.$store.commit('updateRect')
      // this.styleEffect()
    },
    writeDone(e) {
      this.editable = false
      setTimeout(() => {
        this.pushHistory('文字修改')
      }, 100)
      this.updateText(e)
    },
    dblclickText(e) {
      // this.$store.commit('setShowMoveable', false)
      this.editable = true
      const el = this.$refs.editWrap || this.$refs.widget
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
    },
  },
}
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

// @font-face {
//   font-family: 'FONT-AZPPT';
//   font-display: swap;
//   src: url('./AZPPT.ttf') format('truetype');
// }
// .FONT-AZPPT {
//   font-family: 'FONT-AZPPT';
// }
</style>

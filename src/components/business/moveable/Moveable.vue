<!--
 * @Author: ShawnPhang
 * @Date: 2021-08-04 11:46:39
 * @Description: 原版movable插件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-14 11:41:23
-->
<template>
  <div id="empty" class="moveable__remove-item zk-moveable-style"></div>
</template>
<script lang="ts">
import { defineComponent, nextTick } from 'vue'

import Moveable, { EVENTS } from 'moveable' // PROPERTIES, METHODS,
import MoveableHelper from 'moveable-helper'
import { mapGetters, mapActions } from 'vuex'
// import { setTransformAttribute } from '@/common/methods/handleTransform'
import useSelecto from './Selecto'

export default defineComponent({
  setup() {},
  computed: mapGetters(['dSelectWidgets', 'dActiveElement', 'activeMouseEvent', 'showMoveable', 'showRotatable', 'dWidgets', 'updateRect', 'updateSelect', 'guidelines']),
  watch: {
    async dActiveElement(val) {
      setTimeout(async () => {
        await nextTick()
        this.checkMouseEvent()
      }, 10);
      if (!val.record) {
        return
      }
      // 选中非面板 并且不是组合内的元素
      if (val.uuid != -1) {
        await nextTick()
        const target = `[id="${val.uuid}"]`
        this._target = `[id="${val.uuid}"]`
        this.moveable.rotatable = true // 选择时会取消旋转
        // 方向点位设置
        // this.moveable.renderDirections = val.type === 'w-text' ? ['e', 'se'] : 'w-image' ? ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] : ['nw', 'ne', 'sw', 'se']
        switch (val.type) {
          case 'w-text':
            this.moveable.renderDirections = ['e', 'se']
            break
          case 'w-image':
            this.moveable.renderDirections = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']
            break
          case 'w-svg':
            this.moveable.renderDirections = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']
            break
          default:
            this.moveable.renderDirections = ['nw', 'ne', 'sw', 'se']
            break
        }
        // // Set Move Auto
        this.moveable.setState({ target: this._target }, () => {
          // 当出现mouseevent时进行即刻选中
          this.checkMouseEvent()
        })
        // // End
        this.$store.commit('setShowMoveable', true)
        // 参考线设置
        if (!this.moveable.elementGuidelines.includes(target)) {
          this.moveable.elementGuidelines.push(target)
        }
      } else {
        this.moveable.target = `[id="empty"]`
        if (this.moveable.target !== `[id="empty"]`) {
          setTimeout(() => {
            this.moveable.target = `[id="empty"]`
          }, 210)
        }
        // feature: 可以遍历来设置参考线，目前先粗暴清空
        this.moveable.elementGuidelines.length = 0
      }
    },
    showMoveable(val) {
      if (val) {
        this.moveable.target = this._target
      } else {
        this.moveable.target = `[id="empty"]`
      }
    },
    showRotatable(val) {
      // TODO: 这里是通过旋转来判断是否可以操作
      this.moveable.renderDirections = val ? ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] : []
      this.moveable.resizable = val
      // this.moveable.scalable = val
      document.getElementsByClassName('moveable-rotation')[0].style.display = val ? 'block' : 'none'
    },
    updateRect(val) {
      this.moveable.updateRect()
    },
    updateSelect() {
      const items = this.$store.getters.dSelectWidgets
      setTimeout(async () => {
        this.moveable.updateRect()
        await this.$nextTick()
        for (let i = 0; i < items.length; i++) {
          console.log(items[i].uuid)

          document.getElementById(items[i].uuid)?.classList.add('widget-selected')
        }
        this.moveable.renderDirections = []
        this.moveable.rotatable = false
        const targetCollector = [].slice.call(document.querySelectorAll('.widget-selected'))
        console.log(targetCollector)

        this.moveable.target = targetCollector
        for (let i = 0; i < items.length; i++) {
          document.getElementById(items[i].uuid)?.classList.remove('widget-selected')
        }
      }, 400)
    },
    // 选择的元素
    dSelectWidgets: {
      handler(items) {
        const alt = this.$store.getters.dAltDown
        // if (items.length > 1) {
        //   console.log('打开组合面板')
        // }
        if (alt) {
          for (let i = 0; i < items.length; i++) {
            document.getElementById(items[i].uuid)?.classList.add('widget-selected')
          }
          this.moveable.renderDirections = []
          this.moveable.rotatable = false
          const targetCollector = [].slice.call(document.querySelectorAll('.widget-selected'))
          // this.moveable.target = `[id="empty"]`
          this.moveable.target = targetCollector
          for (let i = 0; i < items.length; i++) {
            document.getElementById(items[i].uuid)?.classList.remove('widget-selected')
          }
        }
      },
      deep: true,
    },
    // 标尺线
    guidelines(lines) {
      console.log(lines)

      this.moveable.verticalGuidelines = lines.verticalGuidelines
      this.moveable.horizontalGuidelines = lines.horizontalGuidelines
    },
  },
  mounted() {
    let holdGroupPosition: any = null
    const moveableOptions: any = {
      target: document.querySelector(`[id="empty"]`),
      // container: document.querySelector('#page-design'),
      zoom: 0.8,
      draggable: true,
      clippable: false, // 裁剪
      throttleDrag: 0,
      resizable: true,
      throttleResize: 0,
      scalable: false,
      throttleScale: 0,
      keepRatio: true,
      rotatable: true,
      throttleRotate: 0,
      renderDirections: ['nw', 'ne', 'sw', 'se'], // ['nw', 'ne', 'sw', 'se'] // 'e'
      pinchable: true, // ["draggable", "resizable", "scalable", "rotatable"]
      origin: false,
      defaultGroupOrigin: '0% 0%',
      // 样式相关
      rotationPosition: 'bottom',
      className: 'zk-moveable-style',
      // -- 吸附对齐 Start --
      snappable: true,
      elementGuidelines: [],
      verticalGuidelines: [],
      horizontalGuidelines: [],
      snapThreshold: 4,
      isDisplaySnapDigit: true,
      snapGap: false,
      snapElement: true,
      snapVertical: true,
      snapHorizontal: true,
      snapCenter: false,
      snapDigit: 0,

      // snapDirections={{"top":true,"right":true,"bottom":true,"left":true}}
      //       elementSnapDirections={{}}
      // -- END --
      triggerAblesSimultaneously: true,
    }
    const moveable = new Moveable(document.body, moveableOptions)
    this.moveable = moveable

    const helper: any = new MoveableHelper()

    EVENTS.forEach((event) => {
      let helperEvent = event.replace(event[0], 'on' + event[0].toUpperCase())
      // console.log(event)
      // 'resizeStart', 'resize', 'resizeEnd', rotate, onScale, onScaleStart
      if (['resizeStart', 'rotate', 'resize'].includes(event)) {
        moveable.on(event, (...args) => {
          // this.$emit(event, ...args)
          helper[helperEvent] && helper[helperEvent](...args)
        })
      }
    })
    /* draggable */
    let resizeStartWidth = 0

    moveable
      .on('dragStart', ({ inputEvent, target, stop }) => {
        if (inputEvent.target.nodeName === 'PRE') {
          this.dActiveElement.editable && stop()
        }
        this.dActiveElement.lock && stop()
      })
      .on('drag', ({ target, transform, left, top, inputEvent }) => {
        // target!.style.transform = transform]
        target!.style.left = `${left}px`
        target!.style.top = `${top}px`
        this.holdPosition = { left, top }
      })
      .on('dragEnd', ({ target, isDrag, inputEvent }) => {
        // console.log('onDragEnd', inputEvent)
        // TODO 清理mouseevent
        this.$store.commit('setMouseEvent', null)
        inputEvent.stopPropagation()
        inputEvent.preventDefault()
        // console.log(this.holdPosition, inputEvent.pageX, inputEvent.pageY)
        if (this.holdPosition) {
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: 'left',
            value: Number(this.holdPosition?.left),
          })
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: 'top',
            value: Number(this.holdPosition?.top),
          })
          this.holdPosition = null // important
          setTimeout(() => {
            this.pushHistory()
          }, 100)
        }
      })
      // .on('keyUp', (e) => {
      //   moveable.updateRect()
      // })
      .on('rotate', ({ target, beforeDist, dist, transform }: any) => {
        // console.log('onRotate', Number(this.dActiveElement.rotate) + Number(beforeDist + dist))
        // target.style.transform = transform
        console.log(target.style.transform)
      })
      .on('rotateEnd', (e: any) => {
        const tf = e.target.style.transform
        const iof = tf.indexOf('rotate')
        let rotate = ''
        if (iof != -1) {
          const index = iof + 'rotate'.length
          const half = tf.substring(index + 1)
          rotate = half.slice(0, half.indexOf(')'))
        }
        rotate &&
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: 'rotate',
            value: rotate,
          })
      })
      .on('resizeStart', (args) => {
        console.log(args.target.style.transform)

        this.moveable.snappable = false
        if (this.dActiveElement.type === 'w-text') {
          if (String(args.direction) === '1,0') {
            moveable.keepRatio = false
            moveable.scalable = false
          }
          if (String(args.direction) === '1,1') {
            moveable.keepRatio = false
            resizeStartWidth = args.target.offsetWidth
            this.startHL = Number(args.target!.style.lineHeight.replace('px', ''))
            this.startLS = Number(args.target!.style.letterSpacing.replace('px', ''))
            this.resetRatio = 1
          }
        } else if (this.dActiveElement.type === 'w-image' || this.dActiveElement.type === 'w-qrcode' || this.dActiveElement.type === 'w-svg') {
          const dirs = ['1,0', '0,-1', '-1,0', '0,1']
          dirs.includes(String(args.direction)) && (moveable.keepRatio = false)
        }
      })
      .on('resize', (args: any) => {
        const { target, width, height, dist, delta, clientX, clientY, direction } = args
        console.log(2, args)
        if (this.dActiveElement.type === 'w-text') {
          if (String(direction) === '1,1') {
            this.resetRatio = width / resizeStartWidth
            target!.style.fontSize = this.dActiveElement.fontSize * this.resetRatio + 'px'
            target!.style.letterSpacing = this.startLS * this.resetRatio + 'px'
            target!.style.lineHeight = this.startHL * this.resetRatio + 'px'
          }
          target.style.width = width
          target.style.height = height
          this.resizeTempData = { width, height }
          // moveable.updateRect()
          target.style.backgroundImage = 'none'
          // moveable.keepRatio !== this.resetRatio > 1 && (moveable.keepRatio = this.resetRatio > 1)
        } else if (this.dActiveElement.type == 'w-image' || this.dActiveElement.type === 'w-qrcode' || this.dActiveElement.type === 'w-svg') {
          this.resizeTempData = { width, height }
        } else if (this.dActiveElement.type == 'w-group') {
          // let record = this.dActiveElement.record
          // this.dActiveElement.tempScale = width / record.width
          this.$store.commit('resize', { width: width, height: height })
          // this.resizeTempData = { width, height }
          // let record = this.dActiveElement.record
          // setTransformAttribute(target, 'scale', width / record.width)
        } else {
          this.$store.commit('resize', { width: width, height: height })
        }
        this.dActiveElement.rotate && (target!.style.transform = target!.style.transform.replace('(0deg', `(${this.dActiveElement.rotate}`))
      })
      .on('resizeEnd', (e: any) => {
        moveable.resizable = true
        // moveable.scalable = true
        moveable.snappable = true
        if (e.lastEvent) {
          // setTimeout(() => {
          // if (this.dActiveElement.type === 'w-group') {
          //   // 临时屏蔽，抖得太严重
          //   return
          // }
          console.log('重置translate', this.dActiveElement)
          // 转换成位置
          // if (this.dActiveElement.cache && this.dActiveElement.cache.recordLeft) {
          //   const left = e.lastEvent.drag.translate[0] + Number(this.dActiveElement.cache.recordLeft)
          //   const top = e.lastEvent.drag.translate[1] + Number(this.dActiveElement.cache.recordTop)
          //   this.dActiveElement.cache = { left, top }
          // } else {
          //   const left = e.lastEvent.drag.translate[0] + Number(this.dActiveElement.left)
          //   const top = e.lastEvent.drag.translate[1] + Number(this.dActiveElement.top)
          //   this.dActiveElement.cache = { left, top }
          // }
          const left = e.lastEvent.drag.translate[0]
          const top = e.lastEvent.drag.translate[1]
          this.updateWidgetMultiple({
            uuid: this.dActiveElement.uuid,
            data: [
              {
                key: 'left',
                value: Number(this.dActiveElement.left) + left,
              },
              {
                key: 'top',
                value: Number(this.dActiveElement.top) + top,
              },
            ],
          })
          // 重置translate
          const tf = e.target.style.transform
          const iof = tf.indexOf('translate')
          const FRONT = tf.slice(0, iof + 'translate'.length + 1)
          const half = tf.substring(iof + 'translate'.length + 1)
          const END = half.substring(half.indexOf(')'))
          e.target.style.transform = FRONT + '0, 0' + END
          // this.moveable.updateRect()
          // }, 10)
        }
        if (this.resizeTempData) {
          this.$store.commit('resize', this.resizeTempData)
          this.resizeTempData = null
          // await this.$nextTick()
          this.moveable.updateRect()
          // 临时处理缩放后细线问题 https://github.com/palxiao/poster-design/issues/75
          this.$store.commit('setShowMoveable', false)
          setTimeout(() => {
            this.$store.commit('setShowMoveable', true)
          }, 10);
        }
        try {
          if (this.dActiveElement.type === 'w-text') {
            const d = e.direction || e.lastEvent.direction
            String(d) === '1,1' && (this.dActiveElement.fontSize = this.dActiveElement.fontSize * this.resetRatio)
          }
        } catch (err) {}
        moveable.keepRatio = true
      })
      .on('scaleStart', (e) => {
        if (this.dActiveElement.type === 'w-text') {
          this.startHL = Number(e.target!.style.lineHeight.replace('px', ''))
          this.startLS = Number(e.target!.style.letterSpacing.replace('px', ''))
          this.resetRatio = 1
        } else {
          moveable.scalable = false
        }
      })
      .on('scale', (e) => {
        moveable.resizable = false
        const { target, scale, transform } = e
        this.resetRatio = scale[0]
        target!.style.transform = transform
        this.dActiveElement.rotate && (target!.style.transform = target!.style.transform.replace('0deg', this.dActiveElement.rotate))
      })
      .on('scaleEnd', (e) => {
        moveable.resizable = true
        // moveable.scalable = true
        moveable.keepRatio = true
        console.log(e.target.style.transform)
        try {
          if (this.dActiveElement.type === 'w-text') {
            const d = e.direction || e.lastEvent.direction
            String(d) === '1,1' && (this.dActiveElement.fontSize = this.dActiveElement.fontSize * this.resetRatio)
          }
        } catch (err) {}
      })
      .on('dragGroup', (e) => {
        e.inputEvent.stopPropagation()
        e.inputEvent.preventDefault()
        holdGroupPosition = {}
        const events = e.events
        for (let i = 0; i < events.length; i++) {
          const ev = events[i]
          const currentWidget = this.dWidgets.find((item: any) => item.uuid === ev.target.getAttribute('data-uuid'))
          const left = Number(currentWidget.left) + ev.beforeTranslate[0]
          // debug -- start --
          if (i === 1) {
            console.log(Number(currentWidget.left), ev.beforeTranslate[0])
          }
          // debug -- end --
          const top = Number(currentWidget.top) + ev.beforeTranslate[1]
          ev.target.style.left = `${left}px`
          ev.target.style.top = `${top}px`
          holdGroupPosition[`${ev.target.getAttribute('data-uuid')}`] = { left, top }
        }
      })
      .on('dragGroupEnd', (e) => {
        for (const key in holdGroupPosition) {
          if (Object.prototype.hasOwnProperty.call(holdGroupPosition, key)) {
            const item = holdGroupPosition[key]
            this.updateWidgetData({
              uuid: key,
              key: 'left',
              value: item.left,
            })
            this.updateWidgetData({
              uuid: key,
              key: 'top',
              value: item.top,
            })
          }
        }
        holdGroupPosition = null
        // background: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
        // background-size: 12px 1px;
      })
      .on('resizeGroupStart', ({ events }: any) => {
        console.log(events)
        // events.forEach((ev, i) => {
        //     const frame = this.frames[i];
        //     // Set origin if transform-origin use %.
        //     ev.setOrigin(["%", "%"]);

        //     // If cssSize and offsetSize are different, set cssSize.
        //     const style = window.getComputedStyle(ev.target);
        //     const cssWidth = parseFloat(style.width);
        //     const cssHeight = parseFloat(style.height);
        //     ev.set([cssWidth, cssHeight]);

        //     // If a drag event has already occurred, there is no dragStart.
        //     ev.dragStart && ev.dragStart.set(frame.translate);
        // });
      })
      .on('resizeGroup', (e: any) => {
        // events.forEach(({ target, width, height, drag }, i) => {
        //     const frame = this.frames[i];
        //     target.style.width = `${width}px`;
        //     target.style.height = `${height}px`;
        //     // get drag event
        //     frame.translate = drag.beforeTranslate;
        //     target.style.transform
        //         = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
        // });
      })
      .on('resizeGroupEnd', ({ targets, isDrag }: any) => {
        console.log('onResizeGroupEnd', targets, isDrag)
      })

    // -- 选择功能 Start --
    useSelecto(this.moveable)
    // -- 选择功能 END --
  },
  async created() {
    await nextTick()
    const Ele = document.getElementById('main')
    // 后续可能加个节流 TODO
    Ele?.addEventListener('scroll', () => {
      this.moveable.updateRect()
    })
  },
  methods: {
    ...mapActions(['updateWidgetData', 'updateWidgetMultiple', 'pushHistory']),
    checkMouseEvent() {
      if (this.activeMouseEvent) {
        this.moveable.dragStart(this.activeMouseEvent)
        // 使用后销毁mouseevent
        this.$store.commit('setMouseEvent', null)
      }
    }
  },
})
</script>

<style lang="less">
@import url('./style/index.less');
</style>

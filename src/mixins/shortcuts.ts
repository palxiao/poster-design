/*
 * @Author: ShawnPhang
 * @Date: 2021-08-01 14:12:08
 * @Description: 快捷键，目前是mixin形式放入views/index.vue中
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-19 17:29:06
 */
// import store from '@/store'
// const _this: any = {}
// _this.dHistoryParams = store.getters.dHistoryParams

import keyCodeOptions from './methods/keyCodeOptions'
import dealWithCtrl from './methods/dealWithCtrl'
import { TControlStore } from '@/store/design/control'
import { useControlStore, useWidgetStore } from '@/store'

const ignoreNode = ['INPUT', 'TEXTAREA']

// 系统组合键
const systemKeyCode = [
  {
    // ctrl+r刷新
    key: ['ctrlKey', 'metaKey'],
    code: 82,
  },
  {
    // ctrl+alt+i打开开发者
    key: ['ctrlKey', 'metaKey'],
    key2: ['altKey'],
    code: 73,
  },
]

let hadDown = false
const appContainer: any = document.querySelector('#app')
const controlStore = useControlStore()
const widgetStore = useWidgetStore()

const shortcuts = {
  methods: {
    handleKeydowm(store: TControlStore, checkCtrl: number | undefined, instance: any, dealCtrl: (e: any, instance: any) => void) {
      return (e: any) => {
        const nodeName = e.target.nodeName
        if (ignoreNode.indexOf(nodeName) !== -1 || (nodeName === 'DIV' && e.target.contentEditable === 'true')) {
          return
        }
        // if (hadDown || this.showMenuBg) {
        //   e.stopPropagation()
        //   e.preventDefault()
        //   return
        // }
        // hadDown = true
        const ctrl = e.key === 'Control' || e.key === 'Meta'
        const alt = e.key === 'Alt'
        const shift = e.key === 'Shift'
        // const dir = e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40
        // const specialKey = ctrl || alt || shift || dir
        // if (specialKey || e.metaKey) {
        //   hadDown = false
        // }
        if (shift || ctrl) {
          store.updateAltDown(true)
          // store.dispatch('updateAltDown', true)
          clearInterval(checkCtrl)
          checkCtrl = setInterval(() => {
            // TODO: 防止组合键导致页面失焦无法操作
            if (!document.hasFocus()) {
              clearInterval(checkCtrl)
              hadDown = false
              store.updateAltDown(false)
              // store.dispatch('updateAltDown', false)
            }
          }, 500)
        }
        // const systemKey = systemKeyCode.find((item) => {
        //   let f = false
        //   let f2 = false
        //   for (let i = 0; i < item.key.length; ++i) {
        //     f = e[item.key[i]]
        //     if (f) {
        //       break
        //     }
        //   }
        //   if (item.key2) {
        //     for (let i = 0; i < item.key2.length; ++i) {
        //       f2 = e[item.key2[i]]
        //       if (f2) {
        //         break
        //       }
        //     }
        //   }
        //   return f && f2 && e.keyCode === item.code
        // })
        // if (systemKey) {
        //   return
        // }
        const withCtrl = e.ctrlKey || e.metaKey
        if (withCtrl && !(ctrl || alt || shift)) {
          dealCtrl(e, instance)
          return
        }
        // const withAlt = e.altKey
        // if (withAlt && !specialKey) {
        //   return
        // }
        const withShift = e.shiftKey
        // if (withShift && !specialKey) {
        //   return
        // }
        // // TODO
        // if (!this.dActiveElement) {
        //   return
        // }
        // if (this.dActiveElement.uuid === '-1') {
        //   return
        // }
        // e.stopPropagation()
        // e.preventDefault()
        const f = withShift ? 10 : 1
        keyCodeOptions(e, { f })
      }
    },
    handleKeyup(store: TControlStore, checkCtrl: number | undefined) {
      return (e: any) => {
        clearInterval(checkCtrl)
        hadDown = false
        if (e.key === 'Alt' || e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
          store.updateAltDown(false)
        }
        if (e.key === ' ') {
          appContainer.classList.remove('move-case');
          controlStore.setSpaceDown(false)
          widgetStore.lockWidgets()
        }
      }
    },
    dealCtrl(e: any, instance: any) {
      dealWithCtrl(e, instance)
    },
  },
}

export default shortcuts

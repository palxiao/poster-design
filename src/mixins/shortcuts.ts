/*
 * @Author: ShawnPhang
 * @Date: 2021-08-01 14:12:08
 * @Description: 快捷键，目前是mixin形式放入views/index.vue中
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-04 00:36:19
 */
import keyCodeOptions from './methods/keyCodeOptions'
import dealWithCtrl from './methods/dealWithCtrl'
import { TControlStore } from '@/store/design/control'
import { useControlStore, useWidgetStore } from '@/store'

const ignoreNode = ['INPUT', 'TEXTAREA']

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
        
        const range = withShift ? 10 : 1
        keyCodeOptions(e, { range })
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

import Selecto from 'selecto'
import { getElementInfo } from 'moveable'
import store from '@/store'

export default function(moveable: any) {
  const selecto = new Selecto({
    container: document.getElementById('page-design'),
    selectableTargets: ['.layer'],
    selectByClick: false,
    // 是否从内部目标中选择(default: true)
    selectFromInside: false,
    // 选择后，是否与所选目标一起选择下一个目标
    continueSelect: false,
    // Determines which key to continue selecting the next target via keydown and keyup.
    toggleContinueSelect: 'shift',
    // The container for keydown and keyup events
    keyContainer: document.getElementById('page-design'),
    // 目标与要选择的拖动区域重叠的速率。(默认:100)
    hitRate: 5,
    getElementRect: getElementInfo,
  })
  selecto.on('select', (e) => {
    e.added.forEach((el) => {
      if (!Array.from(el.classList).includes('layer-lock') && !el.hasAttribute('child')) {
        el.classList.add('widget-selected')
        store.dispatch('selectWidgetsInOut', {
          uuid: el.getAttribute('data-uuid'),
        })
      }
    })
    e.removed.forEach((el) => {
      el.classList.remove('widget-selected')
      store.dispatch('selectWidgetsInOut', {
        uuid: el.getAttribute('data-uuid'),
      })
    })
    moveable.renderDirections = [] // ['nw', 'ne', 'sw', 'se'] // []
    moveable.rotatable = false
    moveable.target = [].slice.call(document.querySelectorAll('.widget-selected'))
  })
}

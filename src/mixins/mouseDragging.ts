/*
 * @Author: ShawnPhang
 * @Date: 2022-03-28 09:23:10
 * @Description: 全局拖动检测
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-28 10:08:38
 */
import store from '@/store'
import { onMounted, onBeforeUnmount, nextTick } from 'vue'

export default async (elName: string | Element) => {
  onMounted(async () => {
    await nextTick()

    const el: any = typeof elName === 'string' ? document.querySelector(elName) : elName

    el.onmousedown = function(ev: any) {
      console.log('点击')

      const distanceX = ev.clientX - el.offsetLeft
      const distanceY = ev.clientY - el.offsetTop
      document.onmousemove = function(ev) {
        console.log('拖动')

        // var oevent = ev || event;
        // entrance.style.left = oevent.clientX - distanceX + 'px';
        // entrance.style.top = oevent.clientY - distanceY + 'px';
      }
      document.onmouseup = function(ev) {
        console.log('释放')

        document.onmousemove = null
        document.onmouseup = null
      }
    }
  })
}

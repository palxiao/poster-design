/*
 * @Author: ShawnPhang
 * @Date: 2024-04-04 00:36:13
 * @Description: 快捷键支持列表
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-05 05:56:27
 */
const ctrlKey = isMacOS() ? `⌘` : `Ctrl`
function isMacOS() {
  return navigator.userAgent.includes(`Macintosh`) || navigator.userAgent.includes(`Mac OS X`)
}

export default [
  {
    feat: `拖拽画布`,
    info: `空格 + 鼠标拖拽`,
  },
  {
    feat: `画布缩小`,
    info: `${ctrlKey} - / ${ctrlKey} + 滚轮`,
  },
  {
    feat: `画布放大`,
    info: `${ctrlKey} + / ${ctrlKey} + 滚轮`,
  },
  {
    feat: `保存`,
    info: `${ctrlKey} + S`,
  },
  {
    feat: `撤销`,
    info: `${ctrlKey} + Z`,
  },
  {
    feat: `重做`,
    info: `${ctrlKey} + Shift + Z`,
  },
  {
    feat: `元素移动`,
    info: `← ↑ → ↓`,
  },
  {
    feat: `快速移动`,
    info: `Shift + ← ↑ → ↓`,
  },
  {
    feat: `复制`,
    info: `${ctrlKey} + C`,
  },
  {
    feat: `粘贴`,
    info: `${ctrlKey} + V`,
  },
  {
    feat: `删除`,
    info: `Delete / Backspace`,
  },
  {
    feat: `多选`,
    info: `${ctrlKey} / Shift + 点选`,
  },
  {
    feat: `成组`,
    info: `${ctrlKey} + G`,
  },
  {
    feat: `取消选中`,
    info: `ESC`,
  },
]

import i18n from '@/languages'
/*
 * @Author: ShawnPhang
 * @Date: 2024-04-04 00:36:13
 * @Description: 快捷键支持列表
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-04-11 15:05:41
 */
const ctrlKey = isMacOS() ? `⌘` : `Ctrl`
function isMacOS() {
  return navigator.userAgent.includes(`Macintosh`) || navigator.userAgent.includes(`Mac OS X`)
}

export default [
  {
    feat: i18n.global.t('editor.shortcut.drag'),
    info: i18n.global.t('editor.shortcut.dragInfo'),
  },
  {
    feat: i18n.global.t('editor.shortcut.zoomOut'),
    info: `${ctrlKey} - / ${ctrlKey} + ${i18n.global.t('editor.shortcut.wheel')}`,
  },
  {
    feat: i18n.global.t('editor.shortcut.zoomIn'),
    info: `${ctrlKey} + / ${ctrlKey} + ${i18n.global.t('editor.shortcut.wheel')}`,
  },
  {
    feat: i18n.global.t('editor.shortcut.save'),
    info: `${ctrlKey} + S`,
  },
  {
    feat: i18n.global.t('editor.shortcut.undo'),
    info: `${ctrlKey} + Z`,
  },
  {
    feat: i18n.global.t('editor.shortcut.redo'),
    info: `${ctrlKey} + Shift + Z`,
  },
  {
    feat: i18n.global.t('editor.shortcut.copy'),
    info: `${ctrlKey} + C`,
  },
  {
    feat: i18n.global.t('editor.shortcut.paste'),
    info: `${ctrlKey} + V`,
  },
  {
    feat: i18n.global.t('editor.shortcut.delete'),
    info: `Delete / Backspace`,
  },
  {
    feat: i18n.global.t('editor.shortcut.move'),
    info: `← ↑ → ↓`,
  },
  {
    feat: i18n.global.t('editor.shortcut.fastMove'),
    info: `Shift + ← ↑ → ↓`,
  },
  {
    feat: i18n.global.t('editor.shortcut.multi'),
    info: `${ctrlKey} / Shift + ${i18n.global.t('editor.shortcut.click')}`,
  },
  {
    feat: i18n.global.t('editor.shortcut.group'),
    info: `${ctrlKey} + G`,
  },
  {
    feat: i18n.global.t('editor.shortcut.deselect'),
    info: `ESC`,
  },
]

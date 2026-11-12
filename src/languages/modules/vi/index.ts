/*
 * Nguồn chuẩn (source of truth) cho chuỗi giao diện.
 * Mọi key mới thêm vào đây trước, sau đó bổ sung bản tương ứng ở `../en`.
 * Thuật ngữ thống nhất theo bảng glossary trong PLAN.md §5.
 */
import admin from './admin'
import business from './business'
import common from './common'
import editor from './editor'
import header from './header'
import settings from './settings'

export default {
  home: {
    welcome: 'Chào mừng',
  },
  tabs: {
    refresh: 'Làm mới',
  },
  admin,
  business,
  common,
  editor,
  header,
  settings,
}

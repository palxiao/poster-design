/*
 * @Author: Jeremy Yu
 * @Date: 2024-03-18 21:00:00
 * @Description: Store方法export
 * @LastEditors: Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-28 14:00:00
 */

import { Store, defineStore } from "pinia";
import { TInidDMovePayload, TMovePayload, dMove, initDMove, setDropOver, setMouseEvent, setdActiveElement, updateGroupSize, updateHoverUuid } from "./actions";
import { TPageState } from "../page";
import { TInitResize, TResize, TdResizePayload, dResize, initDResize, resize } from "./actions/resize";
import { TUpdateWidgetMultiplePayload, TUpdateWidgetPayload, TsetWidgetStyleData, addWidget, deleteWidget, setDWidgets, setWidgetStyle, updateWidgetData, updateWidgetMultiple, lockWidgets } from "./actions/widget";
import { addGroup } from "./actions/group";
import { setTemplate } from "./actions/template";
import { copyWidget, pasteWidget } from "./actions/clone";
import { TSelectWidgetData, TselectItem, selectItem, selectWidget, selectWidgetsInOut } from "./actions/select";
import { TUpdateAlignData, updateAlign } from "./actions/align";
import { TWidgetJsonData, widgetJsonData } from "./getter";
import { TupdateLayerIndexData, ungroup, updateLayerIndex } from "./actions/layer";

export type TdWidgetData = TPageState & Partial<TCommonItemData> & {
  parent?: string
  isContainer?: boolean
  text?: string
  editable?: boolean
  lock?: boolean
  imgUrl?: string
  rotate?: string
  transform?: string
  sliceData?: Record<string, any>
  flip?: boolean
  cropEdit?: boolean
  fontClass?: Record<string, any>
  writingMode?: string
}

export type TWidgetState = {
  dActiveWidgetXY: {
    /** 选中组件的横向初始值 */
    x: number,
    /** 选中组件的纵向初始值 */
    y: number
  }
  dMouseXY: {
    /** 鼠标按下时的横坐标 */
    x: number
    /** 鼠标按下时的纵坐标 */
    y: number
  },
  /** 初始化调整大小时组件的宽高 */
  dResizeWH: {
    width: number
    height: number
  },
  /** 选中的组件或页面 */
  dActiveElement: TdWidgetData | null
  /** 鼠标在这个图层上 */
  dHoverUuid: string
  /** 拖动时放在哪个图层上 */
  dDropOverUuid: string
  /** 已使用的组件 */
  dWidgets: TdWidgetData[]
  /** 记录多选的组件 */
  dSelectWidgets: TdWidgetData[]
  /** 复制的组件（可能是单个也可能是数组） */
  dCopyElement: TdWidgetData[]
  /** 记录当前选择的元素, data */
  selectItem: { data?: Record<string, any> | null, type?: string }
  /** 正在活动的鼠标事件 */
  activeMouseEvent: MouseEvent | null
}

type TGetter = {
  getWidgetJsonData(state: TWidgetState): TWidgetJsonData
}

type TAction = {
  /** 设置 mousemove 操作的初始值 */
  initDMove: (payload: TInidDMovePayload) => void
  /** 移动组件 */
  dMove: (payload: TMovePayload) => void
  updateGroupSize: (uuid: string) => void
  /** 设置 resize 操作的初始值 */
  initDResize: (payload: TInitResize) => void
  dResize: (payload: TdResizePayload) => void
  updateHoverUuid: (uuid: string) => void
  /** 更新组件数据 */
  updateWidgetData: (payload: TUpdateWidgetPayload) => void
  /** 一次更新多个widget */
  updateWidgetMultiple: (payload: TUpdateWidgetMultiplePayload) => void
  /** addWidget */
  addWidget: (setting: TdWidgetData) => void
  /** addGroup */
  addGroup: (group: TdWidgetData[]) => void
  /** setTemplate */
  setTemplate: (template: TdWidgetData[]) => void
  /** 删除组件 */
  deleteWidget: () => void
  /** 拷贝组件 */
  copyWidget: () => void
  /** 粘贴组件 */
  pasteWidget: () => void
  selectWidget: (data: TSelectWidgetData) => void
  /** 多选元素 */
  selectWidgetsInOut: (data: TSelectWidgetData) => void
  /** updateAlign */
  updateAlign: (data: TUpdateAlignData) => void
  /** updateLayerIndex */
  updateLayerIndex: (data: TupdateLayerIndexData) => void
  /** ungroup */
  ungroup: (uuid: string) => void
  /** 设置拖拽时在哪个图层 */
  setDropOver: (uuid: string) => void
  setSelectItem: (data: TselectItem) => void
  resize: (data: TResize) => void
  setWidgetStyle: (data: TsetWidgetStyleData) => void
  setDWidgets: (data: TdWidgetData[]) => void
  lockWidgets: () => void
  setMouseEvent: (e: MouseEvent | null) => void
  setdActiveElement: (data: TdWidgetData) => void
}

const WidgetStore = defineStore<"widgetStore", TWidgetState, TGetter, TAction>("widgetStore", {
  state: () => ({
    dActiveWidgetXY: {
      x: 0, // 选中组件的横向初始值
      y: 0, // 选中组件的纵向初始值
    },
    dMouseXY: {
      x: 0, // 鼠标按下时的横坐标
      y: 0, // 鼠标按下时的纵坐标
    },
    dResizeWH: {
      // 初始化调整大小时组件的宽高
      width: 0,
      height: 0,
    },
    dActiveElement: null, // 选中的组件或页面
    dHoverUuid: '-1', // 鼠标在这个图层上
    dDropOverUuid: '', // 拖动时放在哪个图层上
    dWidgets: [], // 已使用的组件
    dSelectWidgets: [], // 记录多选的组件
    selectItem: { data: null }, // 记录当前选择的元素, data
    activeMouseEvent: null, // 正在活动的鼠标事件
    dCopyElement: [], // 复制的组件（可能是单个也可能是数组）
  }),

  getters: {
    getWidgetJsonData(store) {
      return widgetJsonData(store)
    }
  },

  actions: {
    initDMove(payload) { initDMove(this, payload) },
    dMove(payload) { dMove(this, payload) },
    updateGroupSize(uuid) { updateGroupSize(this, uuid) },
    initDResize(payload) { initDResize(this, payload) },
    dResize(payload) { dResize(this, payload) },
    updateHoverUuid(uuid) { updateHoverUuid(this, uuid) },
    updateWidgetData(payload) { updateWidgetData(this, payload) },
    updateWidgetMultiple(payload) { updateWidgetMultiple(this, payload) },
    addWidget(setting) { addWidget(this, setting) },
    addGroup(group) { addGroup(this, group) },
    setTemplate(template) { setTemplate(this, template) },
    deleteWidget() { deleteWidget(this) },
    copyWidget() { copyWidget(this) },
    pasteWidget() { pasteWidget(this) },
    selectWidget(data) { selectWidget(this, data) },
    selectWidgetsInOut(data) { selectWidgetsInOut(this, data) },
    updateAlign(data) { updateAlign(this, data) },
    updateLayerIndex(data) { updateLayerIndex(this, data) },
    ungroup(uuid) { ungroup(this, uuid) },
    setDropOver(uuid) { setDropOver(this, uuid) },
    setSelectItem(data: TselectItem) { selectItem(this, data) },
    resize(data) { resize(this, data) },
    setWidgetStyle(data) { setWidgetStyle(this, data) },
    setDWidgets(data) { setDWidgets(this, data) },
    lockWidgets() { lockWidgets(this) },
    setMouseEvent(event) { setMouseEvent(this, event) },
    setdActiveElement(data) { setdActiveElement(this, data) },
  }
})

export type TWidgetStore = Store<"widgetStore", TWidgetState, TGetter, TAction>

export default WidgetStore

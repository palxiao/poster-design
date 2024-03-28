/*
 * @Author: ShawnPhang
 * @Date: 2021-07-14 15:16:43
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-11 10:22:54
 */
/**
 * 同步操作 store.commit() 调用
 */
interface Iprops {
  commit: (a: any, b: any) => void
  state: {}
}
export default {
  // updatePaddingTop(state: Type.Object, num: number) {
  //   state.dPaddingTop = num
  // },
  // selectItem(state: Type.Object, { data, type }: any) {
  //   state.selectItem.data = data
  //   state.selectItem.type = type
  // },
  // resize(state: Type.Object, data: Type.Object) {
  //   const { width, height } = data
  //   const target = state.dActiveElement
  //   target.width = width
  //   target.height = height
  // },
  // setWidgetStyle(state: Type.Object, { uuid, key, value, pushHistory }: Type.Object) {
  //   const widget = state.dWidgets.find((item: any) => item.uuid === uuid)
  //   widget[key] = value
  // },
  // setMouseEvent(state: Type.Object, e: Event | null) {
  //   state.activeMouseEvent = e
  // },
  // setDWidgets(state: Type.Object, e: any) {
  //   state.dWidgets = e
  // },

  // setDPage(state: Type.Object, e: any) {
  //   state.dPage = e
  // },
  
  // setShowMoveable(state: Type.Object, show: any) {
  //   state.showMoveable = show
  //   // if (!show) {
  //   //   // TODO: 失焦时设置面板也失去关联，但会导致某些失焦状态出错(如裁剪)
  //   //   state.dActiveElement = state.dPage
  //   // }
  // },
  // setShowRotatable(state: Type.Object, e: any) {
  //   state.showRotatable = e
  // },
  // zoomScreenChange(state: Type.Object, e: any) {
  //   // 画布尺寸适应度强制刷新
  //   state.zoomScreenChange = Math.random()
  // },
  // updateRect(state: Type.Object, e: any) {
  //   // 强制刷新操作框
  //   state.updateRect = Math.random()
  // },
  // updateSelect(state: Type.Object, e: any) {
  //   // 强制触发元素选择
  //   state.updateSelect = Math.random()
  // },
  // updateGuidelines(state: Type.Object, lines: any) {
  //   // 修改标尺线
  //   state.guidelines = { ...state.guidelines, ...lines }
  // },
  // setCropUuid(state: Type.Object, uuid: any) {
  //   // 设置正在裁剪or编辑的组件
  //   state.dCropUuid = uuid
  // },
  // setDraging(state: Type.Object, drag: boolean) {
  //   state.dDraging = drag
  // },
  // setDragInitData(state: Type.Object, data: any) {
  //   state.dDragInitData = data
  // },
}

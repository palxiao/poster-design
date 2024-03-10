export interface MattingType {
  value: {}
  /** 是否为擦除画笔 */
  isErasing: boolean
  /** 下载结果图 */
  onDownloadResult: Function
  /** 返回结果图 */
  getResult: Function
  /** input表单选择文件的回调 */
  onFileChange: Function
  /**
   * 初始化加载的图片，第一个参数为原始图像，第二个参数为裁剪图像
   */
  initLoadImages: Function
  /** 画笔尺寸 */
  radius: number | string
  /** 画笔尺寸：计算属性，显示值 */
  brushSize: any
  /** 画笔硬度 */
  hardness: number | string
  /** 画笔硬度：计算属性，显示值 */
  hardnessText: any
  /** 常量 */
  constants: {
    RADIUS_SLIDER_MIN: number
    RADIUS_SLIDER_MAX: number
    RADIUS_SLIDER_STEP: number
    HARDNESS_SLIDER_MAX: number
    HARDNESS_SLIDER_STEP: number
    HARDNESS_SLIDER_MIN: number
  }
}

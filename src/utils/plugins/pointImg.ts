/*
 * @Author: ShawnPhang
 * @Date: 2022-03-06 13:53:30
 * @Description: 获取图片在鼠标焦点的颜色
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-19 17:32:40
 */
export default class PointImg {
  private canvas: HTMLCanvasElement | undefined
  private cvs: CanvasRenderingContext2D | null | undefined

  constructor(img: any) {
    if (img.src) {
      try {
        this.canvas = document.createElement('canvas')
        this.canvas.width = img.width
        this.canvas.height = img.height
        img.crossOrigin = 'Anonymous'
        this.cvs = this.canvas.getContext('2d')
        if (!this.cvs) return

        this.cvs.drawImage(img, 0, 0, img.width, img.height)
      } catch (error) {
        console.log(error)
      }
    }
  }
  public getColorXY(x: number, y: number) {
    /**
     * @param x Number x坐标起点
     * @param y Number y坐标起点
     * @return color Object 包含颜色的rgba #16进制颜色
     */
    const color: Record<string, string> = {}
    try {
      if (!this.cvs) return
      const obj = this.cvs.getImageData(x, y, 1, 1)
      const arr = obj.data.toString().split(',')

      let first = parseInt(arr[0], 10).toString(16)
      first = first.length === 2 ? first : first + first

      let second = parseInt(arr[1], 10).toString(16)
      second = second.length === 2 ? second : second + second

      let third = parseInt(arr[2], 10).toString(16)
      third = third.length === 2 ? third : third + third

      let last = parseInt(arr.pop() || '0', 10) / 255
      last = Number(last.toFixed(0))

      color['rgba'] = 'rgba(' + arr.join(',') + ',' + last + ')'
      color['#'] = '#' + first + second + third
    } catch (error) {
      // console.log('此为解析图片点位异常')
    }

    return color
  }
}

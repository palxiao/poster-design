/*
 * @Author: ShawnPhang
 * @Date: 2021-12-24 15:13:58
 * @Description: 资源加载
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-03-05 12:00:00
 */
export default class PreLoad {
  private i: number
  private arr: (string | HTMLImageElement | ChildNode[])[]
  constructor(arr: (string | HTMLImageElement | ChildNode[])[]) {
    this.i = 0
    this.arr = arr
  }
  public imgs() {
    return new Promise<void>((resolve) => {
      const work = (src: string) => {
        if (this.i < this.arr.length) {
          const img = new Image()
          img.src = src
          if (img.complete) {
            work(this.arr[this.i++] as string)
          } else {
            img.onload = () => {
              work(this.arr[this.i++] as string)
              img.onload = null
            }
          }
          // console.log(((this.i + 1) / this.arr.length) * 100);
        } else {
          resolve()
        }
      }
      work(this.arr[this.i] as string)
    })
  }
  public doms() {
    return new Promise<void>((resolve) => {
      const work = () => {
        if (this.i < this.arr.length) {
          (this.arr[this.i] as HTMLImageElement).complete && this.i++
          setTimeout(() => {
            work()
          }, 100)
        } else {
          resolve()
        }
      }
      work()
    })
  }
  /** 判断是否加载svg */
  public svgs() {
    return new Promise<void>((resolve) => {
      const work = () => {
        if (this.i < this.arr.length) {
          (this.arr[this.i] as ChildNode[]).length > 0 && this.i++
          setTimeout(() => {
            work()
          }, 100)
        } else {
          resolve()
        }
      }
      work()
    })
  }
}



/** 公共API返回结果 */
type TCommResResult<T> = {
  code: number
  msg: string
  result: T
}

type TCommonItemData = {
  type: string
  fontFamily?: string
  color?: string
  fontSize: number
  width: number
  height: number
  left: number
  top: number
  fontWeight: number
  value: TItem2DataParam
}

/** 分页查询公共返回 */
type TPageRequestResult<T> = {
  list: T
  total: number
}

interface HTMLElementEventMap {
  "mousewheel": MouseEvent
}

interface IQiniuSubscribeCb {
  (result: {
    total: { percent: number }
    key: string
  }): void
}

interface Window {
  qiniu: {
    upload: (
      file: File | Blob,
      name: string,
      token: string,
      exObj: Record<string, any>,
      exOption: {
        useCdnDomain: boolean
      }) => {
        subscribe: (cb: {
          next: IQiniuSubscribeCb
          error: (err: string) => void
          complete: IQiniuSubscribeCb
        }) => void
      }
  }
}

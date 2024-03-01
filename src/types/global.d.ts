

/** 公共API返回结果 */
type TCommResResult<T> = {
  code: number
  msg: string
  result: T
}



type TCommonItemData = {
  fontFamily?: string
  color?: string
  fontSize: number
  width?: number
  fontWeight: number
  value: TItem2DataParam
}

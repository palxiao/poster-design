
export type TWSvgSetting = {
  name: string,
  type: string,
  uuid: string
  width: number
  height: number
  colors: [],
  left: number
  top: number
  // zoom: 1.5,
  transform: string
  radius: number
  opacity: number
  parent: string
  svgUrl: string
  setting: [],
  record: {
    width: number
    height: number
    minWidth: number
    minHeight: number
  },
  zoom?: number
  cropEdit?: boolean
  imgUrl?: string
  rotate?: number
  x?: number
  y?: number
}

export const wSvgSetting = {
  name: '矢量图形',
  type: "w-svg",
  uuid: `-1`,
  width: 100,
  height: 100,
  colors: [],
  left: 0,
  top: 0,
  // zoom: 1.5,
  transform: '',
  radius: 0,
  opacity: 1,
  parent: '-1',
  svgUrl: '',
  setting: [],
  record: {
    width: 0,
    height: 0,
    minWidth: 10,
    minHeight: 10,
  },
}

import { DotType } from "qr-code-styling"

export type TWQrcodeSetting = {
  name: string
  type: string
  uuid: string | number
  width: number
  height: number
  left: number
  top: number
  zoom: number
  transform: string
  radius: number
  opacity: number
  parent: string
  url: string
  dotType: DotType
  dotColorType: string
  dotRotation: number
  dotColor: string
  dotColor2: string
  value: string
  setting: Record<string, any>[]
  record: {
    width: number
    height: number
    minWidth: number
    minHeight: number
    dir: string
  }
  cropEdit?: boolean
}

export const wQrcodeSetting: TWQrcodeSetting = {
  name: '二维码',
  type: 'w-qrcode',
  uuid: -1,
  width: 300,
  height: 300,
  left: 0,
  top: 0,
  zoom: 1,
  transform: '',
  radius: 0,
  opacity: 1,
  parent: '-1',
  url: '',
  dotType: 'classy',
  dotColorType: 'single',
  dotRotation: 270,
  dotColor: '#35495E',
  dotColor2: '#35495E',
  value: 'https://xp.palxp.cn',
  setting: [],
  record: {
    width: 0,
    height: 0,
    minWidth: 10,
    minHeight: 10,
    dir: 'all',
  },
}

export type TImageSetting = {
  name: string
  type: string
  uuid: string
  width: number
  height: number
  left: number
  top: number
  zoom: number
  transform: string
  radius: number
  opacity: number
  parent: string
  imgUrl: string
  mask: string
  setting: [],
  rotate: number
  record: {
    width: number
    height: number
    minWidth: number
    minHeight: number
    dir: string
  },
  lock: false,
  isNinePatch: false,
  flip: string | null
  sliceData: {
    ratio: number
    left: number
  }
}

const setting: TImageSetting = {
  name: '图片',
  type: 'w-image',
  uuid: '-1',
  width: 300,
  height: 300,
  left: 0,
  top: 0,
  zoom: 1,
  transform: '',
  radius: 0,
  opacity: 1,
  parent: '-1',
  imgUrl: '',
  mask: '',
  setting: [],
  rotate: 0,
  record: {
    width: 0,
    height: 0,
    minWidth: 10,
    minHeight: 10,
    dir: 'all',
  },
  lock: false,
  isNinePatch: false,
  flip: '',
  sliceData: {
    ratio: 0,
    left: 0,
  }
}

export default setting

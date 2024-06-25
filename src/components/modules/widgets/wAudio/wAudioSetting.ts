export type TAudioSetting = {
  name: string
  type: string
  uuid: string
  width: number
  height: number
  left: number
  top: number
  zoom: number
  transform: string
  opacity: number
  parent: string
  url: string
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
  isSet: boolean, // 是否设置
  loop: boolean, // 循环
  play: boolean, // 播放
  color: string, // 颜色
  sliceData: {
    ratio: number
    left: number
  }
  cropEdit?: boolean
}

export const wAudioSetting: TAudioSetting = {
  name: '音频',
  type: 'w-audio',
  uuid: '-1',
  width: 100,
  height: 100,
  right: 30,
  top: 30,
  zoom: 1,
  transform: '',
  radius: 0,
  opacity: 1,
  parent: '-1',
  mask: '',
  url: '',
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
  audioName: '', // 选中的音频名称
  src: '', // 选中的音频链接
  isSet: true, // 是否设置
  loop: false, // 循环
  play: true, // 播放
  color: '#000000', // 颜色
  sliceData: {
    ratio: 0,
    left: 0,
  },
}


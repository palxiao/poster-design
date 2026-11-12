import i18n from '@/languages'
import { StyleValue } from "vue"

export type TwTextData = {
  name: string
  type: string
  uuid: number
  editable: boolean,
  left: number
  top: number
  transform: string
  lineHeight: number
  letterSpacing: number
  fontSize: number
  zoom: number
  fontClass: {
    alias: string
    id: number
    value: string
    url: string
  },
  fontFamily: string
  fontWeight: string
  fontStyle: string
  writingMode: StyleProperty.WritingMode
  textDecoration: string
  color: string
  textAlign: StyleProperty.TextAlign
  textAlignLast: StyleProperty.TextAlign
  text: string
  opacity: number
  backgroundColor: string
  parent: string
  record: {
    width: number
    height: number
    minWidth: number
    minHeight: number
    dir: string
  },
  textEffects?: {
    filling: {
      enable: boolean
      type: number
      color: string
    }
    stroke: {
      enable: boolean
      width: number
      color: string
    }
    shadow: {
      enable: boolean
      offsetY: number
      offsetX: number
      blur: number
      color: string
    }
    offset: {
      enable: boolean
      x: number
      y: number
    }
  }[]
  width?: number
  height?: number
  degree?: number
}

export const wTextSetting: TwTextData = {
  name: i18n.global.t('editor.widget.text'),
  type: 'w-text',
  uuid: -1,
  editable: false,
  left: 0,
  top: 0,
  transform: '',
  lineHeight: 1.5,
  letterSpacing: 0,
  fontSize: 24,
  zoom: 1,
  fontClass: {
    // Font mặc định hỗ trợ đầy đủ dấu tiếng Việt; id khớp với bản ghi được seed trong service/src/db/bootstrap.ts
    alias: 'Be Vietnam Pro',
    id: 100,
    value: 'be-vietnam-pro',
    url: '/static/fonts/be-vietnam-pro-400.woff2',
  },
  fontFamily: 'be-vietnam-pro',
  fontWeight: 'normal',
  fontStyle: 'normal',
  writingMode: 'horizontal-tb',
  textDecoration: 'none',
  color: '#000000ff',
  textAlign: 'left',
  text: '',
  opacity: 1,
  backgroundColor: '',
  parent: '-1',
  record: {
    width: 0,
    height: 0,
    minWidth: 0,
    minHeight: 0,
    dir: 'horizontal',
  },
}
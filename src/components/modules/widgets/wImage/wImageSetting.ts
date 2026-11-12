import i18n from '@/languages'
/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
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
  isContainer?: boolean
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
  cropEdit?: boolean
}

const setting: TImageSetting = {
  name: i18n.global.t('editor.widget.image'),
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
  isContainer: false,
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

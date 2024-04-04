/*
 * @Description: 添加字体
 * @Author: xi_zi
 * @Date: 2024-03-20 14:59:26
 * @LastEditTime: 2024-03-20 16:11:12
 * @LastEditors: xi_zi
 */

/**
 * 字体缓存
 */
const fonts = new Map()

/**
 * 添加字体
 * @param family 
 * @param url 
 * @returns 
 */
export const addFont = async (family: string, url: string) => {
  const key = `${family}_${url}`
  if (fonts.has(key)) return { loadFont: fonts.get(key), family, url }
  
  const loadFont = new window.FontFace(family, `url(${url})`)
  await loadFont.load()
  document.fonts.add(loadFont)
  fonts.set(key, loadFont)

  return { loadFont, family, url }
}
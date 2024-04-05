/*
 * @Description: 根据 Matrix 转换位置&尺寸
 * @Author: xi_zi
 * @Date: 2024-03-20 23:32:07
 * @LastEditTime: 2024-03-20 23:52:28
 * @LastEditors: xi_zi
 */

/**
 * 根据 Matrix 转换宽度
 * @param matrix 
 * @param width 
 * @returns 
 */
export const transferMatrixWidth = (width: number, matrix?: { a: number, b: number, c: number, d: number, tx: number, ty: number }) => {
  if (matrix?.a === undefined) return width
  return width / Math.pow(Math.abs(matrix.a), 1)
}

/**
 * 根据 Matrix 转换高度
 * @param matrix 
 * @param height 
 * @returns 
 */
export const transferMatrixHeight = (height: number, matrix?: { a: number, b: number, c: number, d: number, tx: number, ty: number }) => {
  if (matrix?.d === undefined) return height
  return height / Math.pow(Math.abs(matrix.d), 1)
}

/**
 * 根据 Matrix 转换左侧定位
 * @param matrix 
 * @param left 
 * @returns 
 */
export const transferMatrixLeft = (left: number, matrix?: { a: number, b: number, c: number, d: number, tx: number, ty: number }) => {
  if (matrix?.a === undefined) return left
  return left * Math.pow(Math.abs(matrix.a), 1)
}

/**
 * 根据 Matrix 转换顶部定位
 * @param matrix 
 * @param top 
 * @returns 
 */
export const transferMatrixTop = (top: number, matrix?: { a: number, b: number, c: number, d: number, tx: number, ty: number }) => {
  if (matrix?.d === undefined) return top
  return top * Math.pow(Math.abs(matrix.d), 1)
}


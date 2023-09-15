/*
 * @Author: ShawnPhang
 * @Date: 2023-09-14 11:33:44
 * @Description: 加载PSD解析
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-14 18:15:44
 */
import Psd from '@webtoon/psd'

onmessage = async (e) => {
  const result = await e.data.arrayBuffer()
  const rawPsdFile = Psd.parse(result)
  console.log(111, rawPsdFile)

  const { width, height } = rawPsdFile
  const psdFile = { width, height }

  const compositeBuffer = await rawPsdFile.composite()

  self.postMessage({ psdFile, compositeBuffer })
}

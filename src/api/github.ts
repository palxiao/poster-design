/*
 * @Author: ShawnPhang
 * @Date: 2023-07-13 17:01:37
 * @Description: github api
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-14 00:01:05
 */
import fetch from '@/utils/axios'
const reader = new FileReader()

function getBase64(file: File) {
  return new Promise((resolve) => {
    reader.onload = function (event: any) {
      const fileContent = event.target.result
      resolve(fileContent.split(',')[1])
    }
    reader.readAsDataURL(file)
  })
}

const putPic = async (file: any) => {
  const content = typeof file === 'string' ? file : await getBase64(file)
  const repo = 'shawnphang/files'
  const d = new Date()
  const path = `${d.getFullYear()}/${d.getMonth()}/${d.getTime()}${file.name?.split('.').pop() || '.png'}`
  const imageUrl = 'https://api.github.com/repos/' + repo + '/contents/' + path
  const body = {
    branch: 'main',
    message: 'upload',
    content,
    path,
  }
  await fetch(imageUrl, body, 'put', {
    Authorization: 'token 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',
    'Content-Type': 'application/json; charset=utf-8',
  })
  return `https://fastly.jsdelivr.net/gh/shawnphang/files@main/${path}`
}

export default { putPic }

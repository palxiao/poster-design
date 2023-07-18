/*
 * @Author: ShawnPhang
 * @Date: 2021-08-02 18:13:32
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-02 18:13:52
 */

export default (url: string) => {
  const link_element = document.createElement('link')
  link_element.setAttribute('rel', 'stylesheet')
  link_element.setAttribute('href', url)
  document.head.appendChild(link_element)
}

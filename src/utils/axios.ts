/*
 * @Author: ShawnPhang
 * @Date: 2021-07-13 02:48:38
 * @Description: 本地测试项目请勿修改此文件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 10:19:28
 */
import axios from 'axios'
import store from '@/store'
import app_config from '@/config'

axios.defaults.timeout = 30000
axios.defaults.headers.authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDEsImV4cCI6MTc4ODU3NDc1MDU4NX0.L_t6DFD48Dm6rUPfgIgOWJkz18En1m_-hhMHcpbxliY';
// const version = app_config.VERSION;
const baseUrl = app_config.API_URL

// 请求拦截器
axios.interceptors.request.use(
  (config: Type.Object) => {
    // const access_token = store.state.currentUser.access_token;
    const url = config.url
    const values = {}
    // values.access_token = access_token;
    // values.version = version;

    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      url.indexOf('/') === 0 ? (config.url = baseUrl + url) : (config.url = baseUrl + '/' + url)
    }

    if (config.method === 'get') {
      //  config.params = utils.extend(config.params, values)
      config.params = Object.assign(config.params, values)
      // config.params = qs.stringify(config.params);
    } else {
      config.data = Object.assign(config.data, values)
      //  config.data = utils.extend(config.data, values)
      // config.data = qs.stringify(config.data);
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
axios.interceptors.response.use(
  (res: Type.Object) => {
    // store.dispatch('hideLoading');

    // 接口规则：只有正确code为200时返回result结果对象，错误返回整个结果对象

    if (!res.data) {
      return Promise.reject(res)
    }
    if (res.data.code === 401) {
      console.log('登录失效')
      store.commit('changeOnline', false)
    }

    if (res.data.result && res.data.code === 200) {
      return Promise.resolve(res.data.result)
    } else if (res.data.data && res.data.stat == 1) {
      return Promise.resolve(res.data.data)
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    // if (error.response.status === 401) {
    // }
    store.dispatch('hideLoading')
    return Promise.reject(error)
  },
)

// export default axios;
const fetch = (url: string, params: Type.Object, type: string | undefined = 'get', exheaders: Type.Object = {}, extra: any = {}) => {
  if (params && params._noLoading) {
    delete params._noLoading
  } else {
    // store.commit('loading', '加载中..');
  }

  const token = localStorage.getItem('xp_token')
  const headerObject: Type.Object = { }
  token && (headerObject.authorization = token)
  
  if (type === 'get') {
    return axios.get(url, {
      headers: Object.assign(headerObject, exheaders),
      params,
      ...extra,
    })
  } else {
    return (axios as Type.Object)[type](url, params, {
      headers: Object.assign(headerObject, exheaders),
      ...extra,
    })
  }
}

export default fetch

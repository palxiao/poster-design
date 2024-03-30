/*
 * @Author: ShawnPhang
 * @Date: 2021-07-13 02:48:38
 * @Description: 本地测试项目请勿修改此文件
 * @LastEditors: ShawnPhang <https://m.palxp.cn>, Jeremy Yu <https://github.com/JeremyYu-cn>
 * @LastEditTime: 2024-02-26 17:54:00
 */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'
// import store from '@/store'
import app_config, { LocalStorageKey } from '@/config'
import { useBaseStore, useUserStore } from '@/store/index';

axios.defaults.timeout = 30000
axios.defaults.headers.authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDEsImV4cCI6MTc4ODU3NDc1MDU4NX0.L_t6DFD48Dm6rUPfgIgOWJkz18En1m_-hhMHcpbxliY';
// const version = app_config.VERSION;
const baseUrl = app_config.API_URL

// 请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // const access_token = store.state.currentUser.access_token;
    const url = config.url ?? ""
    const values = {}
    // values.access_token = access_token;
    // values.version = version;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      config.url = url.startsWith('/') ? baseUrl + url : config.url = baseUrl + '/' + url
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
axios.interceptors.response.use((res: AxiosResponse<any>) => {
    // store.dispatch('hideLoading');
    // 接口规则：只有正确code为200时返回result结果对象，错误返回整个结果对象

    if (!res.data) {
      return Promise.reject(res)
    }
    if (res.data.code === 401) {
      console.log('登录失效')
      useUserStore().changeOnline(false)
      // store.commit('changeOnline', false)
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
    useBaseStore().hideLoading()
    // store.dispatch('hideLoading')
    return Promise.reject(error)
  },
)

type TFetchRequestConfigParams = AxiosRequestConfig & Record<string, any>
type TFetchMethod = keyof Pick<
  AxiosStatic, 
  "get" | "post" | "put" | "getUri" | "request" | "delete" | "head" | "options" | "patch"
>

// export default axios;
const fetch = <T = any> (
  url: string,
  params: TFetchRequestConfigParams, 
  type: TFetchMethod = 'get',
  exheaders: Record<string, any> = {},
  extra: Record<string, any> = {}
): Promise<T> => {
  if (params?._noLoading) {
    delete params._noLoading
  } else {
    // store.commit('loading', '加载中..');
  }

  const token = localStorage.getItem(LocalStorageKey.tokenKey)
  const headerObject: Record<string, any> = {}
  token && (headerObject.authorization = token)
  
  if (type === 'get') {
    return axios.get(url, {
      headers: Object.assign(headerObject, exheaders),
      params,
      ...extra,
    })
  } else {
    return axios[type](url, params, {
      headers: Object.assign(headerObject, exheaders),
      ...extra,
    }) as Promise<T>
  }
}

export default fetch

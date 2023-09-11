/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description: Router Enter
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-11 23:32:52
 */
import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import config from '@/config'
import hook from './hook'

import Base from './base'

const routes: Array<RouteRecordRaw> = [...Base]

const router = createRouter({
  history: createWebHistory(config.BASE_URL), // import.meta.env.BASE_URL
  // history: createWebHashHistory(),
  routes,
})

hook(router)

export default router

/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description: 前端路由
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-25 17:00:52
 */
export default [
  // {
  //   path: '/',
  //   name: 'main',
  //   redirect: 'home',
  //   component: () => import('@/views/Ready.vue'),
  //   children: [
  //     {
  //       name: 'Home',
  //       path: '/home',
  //       component: () => import(/* webpackChunkName: 'base' */ '@/views/Index.vue'),
  //     },
  //   ],
  // },
  {
    // 预留主页
    path: '/',
    name: 'main',
    redirect: 'home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: 'base' */ '@/views/Index.vue'),
  },
  {
    path: '/draw',
    name: 'Draw',
    component: () => import(/* webpackChunkName: 'draw' */ '@/views/Draw.vue'),
  },
  {
    path: '/psd',
    name: 'Psd',
    component: () => import(/* webpackChunkName: 'psd' */ '@/views/Psd.vue'),
  },
]

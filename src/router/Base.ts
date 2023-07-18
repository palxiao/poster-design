/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description: 路由
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-17 14:28:41
 */
export default [
  {
    path: '/',
    name: 'main',
    redirect: 'home',
    component: () => import('@/views/Ready.vue'),
    children: [
      {
        name: 'Home',
        path: '/home',
        component: () => import(/* webpackChunkName: 'base' */ '@/views/Index.vue'),
      },
    ],
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

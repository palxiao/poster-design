//  import store from '@/store'

import { NavigationGuardNext, RouteLocationNormalized, Router } from "vue-router"

 export default (router: Router) => {
 
     router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
         // if (to.meta.requireAuth) { }
 
         // 有必要时清除残余的loading框
         // store.commit('loading', false);
 
        //  const $store = store as Type.Object
        //  $store.commit('changeRoute', from.path)
 
         if (/\/http/.test(to.path) || /\/https/.test(to.path)) {
             const url = to.path.split('http')[1]
             window.location.href = `http${url}`
         } else {
             next()
         }
 
     })
 
     router.afterEach(() => {
         window.scrollTo(0, 0);
     })
 }
 
 
 
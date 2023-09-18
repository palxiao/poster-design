<!--
 * @Author: ShawnPhang
 * @Date: 2023-09-18 17:34:44
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-18 18:05:22
-->
<template>
  <div id="appindex">
    <div class="viewWrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="less">
#appindex {
  min-width: 1180px;
  .viewWrap {
    // background-color: #ffffff;
    min-height: calc(110vh - 110px);
    min-width: 1170px;
  }
}
// .fade-enter-active {
//   transition: opacity 0.3s;
// }
// .fade-leave-active {
//   transition: opacity 0.3s;
// }
// .fade-enter {
//   opacity: 0;
// }
// .fade-leave-to {
//   opacity: 0;
// }
</style>

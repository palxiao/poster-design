<template>
  <div>
    <!-- 选项模块 -->
    <div class="flex flex-wrap items-center mb-4">
      <list v-bind="params" @openDrawer="openDrawer"></list>
    </div>

    <!-- 右侧动画选择抽屉弹窗 -->
    <el-drawer
      v-model="drawer"
      title="选择动画"
      direction="rtl"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-card style="max-width: 600px" v-for="(item, i) in animationList" :key="i">
        <template #header>
          <div class="card-header">
            <span>{{item.label}}</span>
          </div>
        </template>
        <el-button :type="childrenItem.value === params?.transition.animate ? 'primary' : ''" size="small" v-for="(childrenItem, j) in item.children" :key="j" plain :class="['animateBtn', childrenItem.isAnimating ? 'animate__animated' : '', childrenItem.isAnimating ? 'animate__' + childrenItem.value : '']"  @mouseenter="animating(childrenItem, i, j)" @click="chooseAnimate(childrenItem, i, j)">{{childrenItem.label}}</el-button>
      </el-card>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  import { ref, Ref, reactive } from 'vue'
  import {animationOptions} from './animate.js'
  import 'animate.css';
  import list from './list.vue';
  import { ElDrawer } from 'element-plus'
  import type { DrawerProps } from 'element-plus'
  type TProps = {
    params: any
  }
  const props = withDefaults(defineProps<TProps>(), {
    params: {},
  })
  let drawer: Ref<Boolean> = ref(false); // 是否显示右侧动画抽屉弹窗
  const animationList = ref(animationOptions); // 动画选择json数据

  // 鼠标移入，按钮出现动画效果预览
  function animating(childrenItem, i, j) {
    // animationList.value[i].children[j].isAnimating = true;
    // setTimeout(() => {
    //   animationList.value[i].children[j].isAnimating = false;
    // }, 1e3);
    childrenItem.isAnimating = true;
    setTimeout(() => {
      childrenItem.isAnimating = false;
    }, 1e3);
  }
  const defaultTransition = reactive({
  animate: '',
  animateName: '',
  duration: 0, 
  delay: 0, 
  speed: 'fast', 
  isRepeat: false, 
  repeatTime: 1, // 循环次数，1表示一次之后就停止
})
  let transition = reactive(props.params?.transition || defaultTransition)
  // 点击选中预览效果，画板添加预览显示
  function chooseAnimate(childrenItem, i, j){
    const { label, value } = childrenItem;
    // 添加动画参数
    // -- animate：动画名称
    // -- duration： 持续时间：秒
    // -- delay：延时：秒
    // -- isRepeat: 是否开启循环
    // -- repeat: 重复次数
    // -- speed: 速度：slow, slower, fast, faster
    // -- isPreview： 是否预览，一次之后就停止,初始化设置的时候默认为true，发布作品时修改为false
    // transition.value = {
      console.log(props);
      console.log(props.params);
      console.log(props.params.transition);
      
    props.params.transition = {
      animate: value,
      animateName: label,
      duration: 10, 
      delay: 0.5, 
      speed: 'fast', 
      isRepeat: true, 
      repeatTime: 1, // 循环次数，1表示一次之后就停止
      isPreview: true, // 是否预览，一次之后就停止
    }
    console.log(props.params.transition);
    console.log(transition.value);
    
  }

  // 关闭抽屉弹窗
  function handleClose(){
    drawer.value = false;
    console.log("handleClose");
    console.log(props.params)
    console.log(props.params)
  }

  function openDrawer(){
    console.log('openDrawer')
    
    drawer.value = true;
  }
</script>

<style>
  .test-container{
    height: 100px;
    width: 100px;
    position: fixed;
    z-index: 999999;
    background-color: red;
  }
  .animateBtn{
    margin-bottom: 10px;
  }
</style>
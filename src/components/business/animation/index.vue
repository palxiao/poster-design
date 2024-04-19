<template>
  <div>
    <div class="flex flex-wrap items-center mb-4">
      <el-card style="max-width: 480px" v-for="(item, i) in animationList" :key="i">
        <template #header>
          <div class="card-header">
            <span>{{item.label}}</span>
          </div>
        </template>
        <el-button size="mini" v-for="(childrenItem, j) in item.children" :key="j" plain :class="[childrenItem.isAnimating ? 'animate__animated' : '', childrenItem.isAnimating ? 'animate__' + childrenItem.value : '']"  @mouseenter="animating(i, j)" @click="">{{childrenItem.label}}</el-button>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, Ref } from 'vue'
  import {animationOptions} from './animate.js'
  import 'animate.css';
  type TProps = {
    params: any
  }
  const props = withDefaults(defineProps<TProps>(), {
    params: {},
  })
  const isAnimating: Ref<boolean> = ref(true)
  const animationType: Ref<string> = ref('')
  type TState = {animationList: object[]}
  // const state = reactive<TState>({
  //   animationList: [{name: 'animate__bounce', isAnimating: false}, {name: 'animateOut', isAnimating: false}]
  // })
  const animationList = ref(animationOptions)
  console.log(animationList);
  
  // function animating(item, isAnimating) {
  //   animationType.value = item.name;
  //   isAnimating.value = true;
  //   console.log(this.isAnimating);
  //   console.log(this.animationType);
  //   setTimeout(() => {
  //     isAnimating.value = false;
  //     animationType.value = '';
  //   console.log(this.isAnimating);
      
  //   }, 1e3);
  // }
  function animating(i, j) {
    console.log(animationList.value);
    
    animationList.value[i].children[j].isAnimating = true;
    setTimeout(() => {
      animationList.value[i].children[j].isAnimating = false;
      
    }, 10e3);
  }
  // const open = () => {
  //   console.log(1124)
  // }
  // defineExpose({
  //   open,
  // })
  // ...toRefs(state)
</script>

<style>
  .test-container{
    height: 100px;
    width: 100px;
    position: fixed;
    z-index: 999999;
    background-color: red;
  }
</style>
import { log } from 'console';
import {ref, reactive, Ref, onMounted} from 'vue'
// import { useCanvasStore } from '@/store'
// import { storeToRefs } from 'pinia'

// const { dPage } = storeToRefs(useCanvasStore())
export default function (dPage, dLayouts) {
  
  let page_index: Ref<Number> = ref(0)
  let mouseDownY: Ref<Number> = ref(0)
  let mouseUpY: Ref<Number> = ref(0)
  const scrollTarget = 30; // 判断滚动的高度
  let autoScroll: Ref<Boolean> = ref(true); // 是否自动滚动  -- TODO
  const autoSpeed = 3000; // 自动滚动速度ms  -- TODO
  let autoScrollInterval = null; //自动滚动定时器
  let page_type = ref('');
  let timeout = reactive('');
  let isDragging = ref(false);
  let scrollContainer = ref('');

  // 挂载后，如果为自动滚动时，进行自动滚动
  onMounted(() => {
    console.log(autoScroll.value)
    if(autoScroll.value){
      setTimeout(() => {
        page_type.value = dPage.value.page_type
        scrollContainer = document.getElementById('out-page')
        // 长页自动滚动
        if(page_type.value === 'longPage'){
          console.log(page_type.value)

          fnAutoScroll(scrollContainer);
        } else {
          fnAutoTurnPage()
        }
      }, 1e3);
    }
  })

  // 自动滚动到底部
  function fnAutoScroll(element) {
    element.scrollTop += 1; // 每次滚动1px
    if(element.scrollTop === element.scrollHeight - element.clientHeight) {
      element.scrollTop = 0; // 如果滚动到底部，则重新开始
    }
    if(isDragging.value) {
      timeout = null;
    } else {
      timeout = setTimeout(function() { fnAutoScroll(element); }, dPage.value.scrollSpeed || 10); // 递归调用，默认每10毫秒滚动一次，数字越大越慢，越小越快
    }
  }
  
  // 自动翻页
  function fnAutoTurnPage(){
    autoScrollInterval = setInterval(() => {
      if(page_index.value >= dLayouts.value.length - 1){
        clearInterval(autoScrollInterval);
        return;
      }
      page_index.value += 1;
    }, autoSpeed)
  }


  // 监听鼠标滑动事件
  function mousedown({x, y}){
    console.log('mousedown---');
    if(page_type.value === 'longPage'){
      isDragging.value = true;
    } else {
      // 点击时，关闭自动滚动
      clearInterval(autoScrollInterval);
      console.log(y);
      mouseDownY.value = y;
    }
  }
  // 监听鼠标滑动事件
  function mousemove(e){
    if (isDragging.value && page_type.value === 'longPage') {
      // 拖动时滚动div
      scrollContainer.scrollTop -= e.movementY * 2;
      // 阻止默认的滚动行为
      e.preventDefault();
    } 
  }

  // 监听鼠标滑动事件
  function mouseup({x, y}){
    if(page_type.value === 'longPage'){
      isDragging.value = false;
      // 鼠标停止后，再次启动的时间
      // if(dPage.value.scrolldelay){
        setTimeout(() => {
          fnAutoScroll(scrollContainer);
        }, dPage.value.scrolldelay || 1e3);
      // }
    } else {
      console.log('mouseup---');
      mouseUpY.value = y;
      console.log(y);
      // 切换到上一页（向下滑）
      if(mouseUpY.value - mouseDownY.value >= scrollTarget){
        console.log('向下滑');
        if(page_index.value <= 0) return 
        page_index.value = page_index.value - 1;
      }
      // 切换到下一页（向上滑）
      if(mouseDownY.value - mouseUpY.value >= scrollTarget){
        console.log('向上滑');
        if(page_index.value >= dLayouts.value.length - 1) return 
        page_index.value = page_index.value + 1;
      }
    }
  }

  return {autoScroll, page_index, page_type, fnAutoScroll, fnAutoTurnPage, mousedown, mousemove, mouseup}
}
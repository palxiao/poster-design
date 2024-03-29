<template>
  <div v-show="showMenuBg" id="menu-bg" class="menu-bg" @click="closeMenu">
    <ul ref="menuList" class="menu-list" :style="styleObj">
      <li
        v-for="(item, index) in menuListData.list"
        :key="index"
        :class="{ 'menu-item': true, 'disable-menu': dCopyElement.length === 0 && item.type === 'paste' }"
        @click.stop="selectMenu(item.type)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
// import { useStore } from 'vuex'
import { 
  widgetMenu as widget, 
  pageMenu as page,
  menuList as menu, 
  TMenuItemData, TWidgetItemData, 
} from './rcMenuData'
import { getTarget } from '@/common/methods/target'
// import { useSetupMapGetters } from '@/common/hooks/mapGetters';
import { storeToRefs } from 'pinia';
import { useControlStore, useWidgetStore } from '@/pinia';

// const store = useStore()
const menuListData = ref<TMenuItemData>({...menu})
const showMenuBg = ref<boolean>(false)
const widgetMenu = ref<TWidgetItemData[]>({...widget})
const pageMenu = ref<TWidgetItemData[]>({...page})

const widgetStore = useWidgetStore()
// const {dActiveElement, dWidgets, dCopyElement} = useSetupMapGetters(['dActiveElement', 'dWidgets', 'dCopyElement'])

const {dActiveElement, dWidgets, dCopyElement} = storeToRefs(widgetStore)
const { dAltDown } = storeToRefs(useControlStore())


const styleObj = computed(() => {
  return {
    left: menuListData.value.left + 'px',
    top: menuListData.value.top + 'px',
  }
})

onMounted(() => {
  document.oncontextmenu = mouseRightClick
})
async function mouseRightClick(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (showMenuBg.value) {
    showMenuBg.value = false
    return
  }
  if (!e.target) return
  let target = await getTarget(e.target as HTMLElement)
  if (!target) return
  let type = target.getAttribute('data-type')
  if (type) {
    let uuid = target.getAttribute('data-uuid') // 设置选中元素

    if (uuid !== '-1' && !dAltDown.value) {
      let widget = dWidgets.value.find((item: any) => item.uuid === uuid)
      if (
        widget?.parent !== '-1' && 
        widget?.parent !== dActiveElement.value?.uuid &&
        widget?.parent !== dActiveElement.value?.parent
      ) {
        uuid = widget?.parent || ""
      }
    }
    widgetStore.selectWidget({
      uuid: uuid ?? '-1',
    })
    // store.dispatch('selectWidget', {
    //   uuid: uuid ?? '-1',
    // })
    showMenu(e)
  }
}

function showMenu(e: MouseEvent) {
  let isPage = dActiveElement.value?.uuid === '-1'
  menuListData.value.list = isPage ? pageMenu.value : widgetMenu.value
  if (dActiveElement.value?.isContainer) {
    let ungroup: TWidgetItemData[] = [
      {
        type: 'ungroup',
        text: '取消组合',
      },
    ]
    menuListData.value.list = ungroup.concat(menuListData.value.list)
  }
  showMenuBg.value = true
  // document.getElementById('menu-bg').addEventListener('click', this.closeMenu, false)
  let mx = e.pageX
  let my = e.pageY
  let listWidth = 120
  if (mx + listWidth > window.innerWidth) {
    mx -= listWidth
  }
  let listHeight = (14 + 10) * menuListData.value.list.length + 10
  if (my + listHeight > window.innerHeight) {
    my -= listHeight
  }
  menuListData.value.left = mx
  menuListData.value.top = my
}

function closeMenu() {
  showMenuBg.value = false
}

/** 点击菜单触发事件 */
function selectMenu(type: TWidgetItemData['type']) {
  switch (type) {
    case 'copy':
      widgetStore.copyWidget()
      // store.dispatch('copyWidget')
      break
    case 'paste':
      if (dCopyElement.value.length === 0) {
        return
      }
      widgetStore.pasteWidget()
      // store.dispatch('pasteWidget')
      break
    case 'index-up':
      widgetStore.updateLayerIndex({
        uuid: dActiveElement.value?.uuid || "",
        value: 1,
        isGroup: dActiveElement.value?.isContainer,
      })
      // store.dispatch('updateLayerIndex', {
      //   uuid: dActiveElement.value.uuid,
      //   value: 1,
      //   isGroup: dActiveElement.value.isContainer,
      // })
      break
    case 'index-down':
      widgetStore.updateLayerIndex({
        uuid: dActiveElement.value?.uuid || "",
        value: -1,
        isGroup: dActiveElement.value?.isContainer,
      })
      // store.dispatch('updateLayerIndex', {
      //   uuid: dActiveElement.value.uuid,
      //   value: -1,
      //   isGroup: dActiveElement.value.isContainer,
      // })
      break
    case 'del':
      widgetStore.deleteWidget()
      // store.dispatch('deleteWidget')
      break
    case 'ungroup':
      widgetStore.ungroup(dActiveElement.value?.uuid || "")
      // store.dispatch('ungroup', dActiveElement.value.uuid)
      break
  }
  closeMenu()
}

</script>

<style lang="less" scoped>
.menu-bg {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 99999;
  .menu-list {
    background-color: @color-white;
    box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, 0.1);
    padding: 5px;
    position: absolute;
    width: 120px;
    .menu-item {
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 5px 15px;
      width: 100%;
      &:hover {
        background-color: #ececec;
      }
    }
    .menu-item.disable-menu {
      background-color: @color-white;
      color: #aaaaaa;
      cursor: not-allowed;
    }
  }
}
</style>

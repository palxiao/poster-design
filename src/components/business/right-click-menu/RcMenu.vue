<template>
  <div v-show="showMenuBg" id="menu-bg" class="menu-bg" @click="closeMenu">
    <ul ref="menuList" class="menu-list" :style="styleObj">
      <li v-for="(item, index) in menuList.list" :key="index" :class="{ 'menu-item': true, 'disable-menu': dCopyElement.length === 0 && item.type === 'paste' }" @click.stop="selectMenu(item.type)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { widgetMenu, pageMenu, menuList } from './rcMenuData'
import { getTarget } from '@/common/methods/target'

export default defineComponent({
  setup() {},
  data() {
    return {
      menuList,
      showMenuBg: false,
      widgetMenu,
      pageMenu,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dAltDown', 'dWidgets', 'dCopyElement']),
    styleObj() {
      return {
        left: this.menuList.left + 'px',
        top: this.menuList.top + 'px',
      }
    },
  },
  mounted() {
    document.oncontextmenu = this.mouseRightClick
  },
  methods: {
    ...mapActions(['selectWidget', 'copyWidget', 'pasteWidget', 'updateLayerIndex', 'deleteWidget', 'ungroup']),
    async mouseRightClick(e: any) {
      e.stopPropagation()
      e.preventDefault()
      if (this.showMenuBg) {
        this.showMenuBg = false
        return
      }
      // let target = e.target
      let target = await getTarget(e.target)

      let type = target.getAttribute('data-type')
      if (type) {
        let uuid = target.getAttribute('data-uuid') // 设置选中元素

        if (uuid !== '-1' && !this.dAltDown) {
          let widget = this.dWidgets.find((item: any) => item.uuid === uuid)
          if (widget.parent !== '-1' && widget.parent !== this.dActiveElement.uuid && widget.parent !== this.dActiveElement.parent) {
            uuid = widget.parent
          }
        }
        this.selectWidget({
          uuid: uuid || '-1',
        })
        this.showMenu(e)
      }
    },
    showMenu(e: any) {
      let isPage = this.dActiveElement.uuid === '-1'
      this.menuList.list = isPage ? this.pageMenu : this.widgetMenu
      if (this.dActiveElement.isContainer) {
        let ungroup = [
          {
            type: 'ungroup',
            text: '取消组合',
          },
        ]
        this.menuList.list = ungroup.concat(this.menuList.list)
      }
      this.showMenuBg = true
      // document.getElementById('menu-bg').addEventListener('click', this.closeMenu, false)
      let mx = e.pageX
      let my = e.pageY
      let listWidth = 120
      if (mx + listWidth > window.innerWidth) {
        mx -= listWidth
      }
      let listHeight = (14 + 10) * this.menuList.list.length + 10
      if (my + listHeight > window.innerHeight) {
        my -= listHeight
      }
      this.menuList.left = mx
      this.menuList.top = my
    },
    closeMenu() {
      this.showMenuBg = false
      // document.getElementById('menu-bg').removeEventListener('click', this.closeMenu, false)
    },
    selectMenu(type) {
      switch (type) {
        case 'copy':
          this.copyWidget()
          break
        case 'paste':
          if (this.dCopyElement.length === 0) {
            return
          }
          this.pasteWidget()
          break
        case 'index-up':
          this.updateLayerIndex({
            uuid: this.dActiveElement.uuid,
            value: 1,
            isGroup: this.dActiveElement.isContainer,
          })
          break
        case 'index-down':
          this.updateLayerIndex({
            uuid: this.dActiveElement.uuid,
            value: -1,
            isGroup: this.dActiveElement.isContainer,
          })
          break
        case 'del':
          this.deleteWidget()
          break
        case 'ungroup':
          this.ungroup(this.dActiveElement.uuid)
          break
      }
      this.closeMenu()
    },
  },
})
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

<!--
 * @Author: ShawnPhang
 * @Date: 2022-03-07 17:25:19
 * @Description: 图层组件
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-10 15:38:30
-->
<template>
  <ul class="widget-list">
    <!-- <li v-for="widget in getWidgets" :key="widget.uuid" :class="['widget', { active: getIsActive(widget.uuid) }, 'item-one']" @click="selectLayer(widget)" @mouseover="hoverLayer(widget.uuid)" @mouseout="hoverLayer('-1')">
      <span v-show="widget.parent !== '-1'" :class="['widget-type icon', `sd-xiaji`]"></span>
      <img v-if="widget.imgUrl" class="widget-type widget-type__img" :src="widget.imgUrl" />
      <span v-else :class="['widget-type icon', `sd-${widget.type}`, widget.type]"></span>
      <span :class="['widget-name', 'line-clamp-1', `${widget.type}`]">{{ widget.text || widget.name }}</span>
      <div class="widget-out" :data-type="widget.type" :data-uuid="widget.uuid"></div>
    </li> -->
    <draggable v-model="widgets" group="type" item-key="uuid" v-bind="dragOptions" :move="onMove" @start="drag = true" @end="onDone">
      <template #item="{ element }">
        <li :class="['widget', { active: getIsActive(element.uuid), disable: !showItem(element) }, 'item-one']" @click="selectLayer(element)" @mouseover="hoverLayer(element)" @mouseout="hoverLayer('-1')">
          <!-- <span v-show="+element.parent !== -1" :class="['widget-type icon', `sd-xiaji`]"></span> -->
          <span v-show="+element.parent !== -1" class="second-layer"></span>
          <img v-if="element.imgUrl" class="widget-type widget-type__img" :src="element.imgUrl" />
          <img v-else-if="element.svgUrl" class="widget-type widget-type__img" :src="element.svgUrl" />
          <span v-else :class="['widget-type icon', `sd-${element.type}`, element.type]"></span>
          <span :class="['widget-name', 'line-clamp-1', `${element.type}`]">{{ element.text || element.name }} {{ element.mask ? '(容器)' : '' }}</span>
          <div class="widget-out" :data-type="element.type" :data-uuid="element.uuid">
            <i :class="['icon', element.lock ? 'sd-suoding' : 'sd-jiesuo']" @click.stop="lockLayer(element)" />
          </div>
        </li>
      </template>
    </draggable>

    <!-- <li :class="['widget', { active: dActiveElement.uuid === dPage.uuid && dSelectWidgets.length === 0 }]" @click="selectLayer(dPage)" @mouseover="hoverLayer('-1')" @mouseout="hoverLayer('-1')">
      <span class="widget-type"></span>
      <span class="widget-name">{{ dPage.name }}</span>
      <div class="widget-out" :data-type="dPage.type" :data-uuid="dPage.uuid"></div>
    </li> -->
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import draggable from 'vuedraggable'

export default defineComponent({
  components: { draggable },
  props: ['data'],
  emits: ['change'],
  setup(props, context) {
    let widgets: any = ref([])
    const state: any = reactive({
      drag: false,
    })
    const dragOptions = computed(() => {
      return {
        animation: 300,
        // disabled: !state.editable,
        ghostClass: 'ghost',
        chosenClass: 'choose',
      }
    })

    const store = useStore()
    // const dPage = computed(() => {
    //   return store.getters.dPage
    // })
    // const dActiveElement = computed(() => {
    //   return store.getters.dActiveElement
    // })
    // const dSelectWidgets = computed(() => {
    //   return store.getters.dSelectWidgets
    // })
    const showItem = (item: any) => {
      return state.drag === true && item.parent != '-1' ? false : true
    }
    // const cWidgets = computed(() => {
    //   return getWidgets()
    // })
    const getWidgets = () => {
      let widgets = []
      let len = props.data.length
      const data = props.data.slice(0)
      const childs = [] // 临时子组件
      for (let i = len - 1; i >= 0; --i) {
        let widget = JSON.parse(JSON.stringify(data[i]))
        if (widget.parent != -1) {
          childs.unshift(widget)
        } else {
          widgets.push(widget)
        }
      }
      for (const item of childs) {
        // widgets[widgets.findIndex((x) => x.uuid === item.parent)].childs.push(item)
        const index = widgets.findIndex((x) => x.uuid === item.parent)
        widgets.splice(index + 1, 0, item)
      }
      return widgets
    }

    const getIsActive = (uuid: number) => {
      if (store.getters.dSelectWidgets.length > 0) {
        let widget = store.getters.dSelectWidgets.find((item: any) => item.uuid === uuid)
        if (widget) {
          return true
        }
        return false
      } else {
        return uuid === store.getters.dActiveElement.uuid
      }
    }

    const selectLayer = (widget: any) => {
      // console.log(widget)
      store.dispatch('selectWidget', { uuid: widget.uuid })
    }
    const hoverLayer = ({ uuid, parent }: any) => {
      store.dispatch('updateHoverUuid', uuid)
    }

    const onMove = ({ relatedContext, draggedContext }: any) => {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      // const index = props.data.findIndex((x: any) => x.uuid === draggedElement.uuid)
      // const toIndex = props.data.findIndex((x: any) => x.uuid === relatedElement.uuid)
      // console.log(index, toIndex)
      return (!relatedElement || relatedElement.parent == -1) && draggedElement.parent == -1
    }

    const onDone = () => {
      state.drag = false
      context.emit('change', widgets.value)
    }
    // 锁定图层
    const lockLayer = (item: any) => {
      store.dispatch('updateWidgetData', {
        uuid: item.uuid,
        key: 'lock',
        value: typeof item.lock === 'undefined' ? true : !item.lock,
        pushHistory: false,
      })
      // item.lock = typeof item.lock === 'undefined' ? true : !item.lock
    }

    return { lockLayer, onDone, onMove, selectLayer, hoverLayer, widgets, getWidgets, getIsActive, ...toRefs(state), dragOptions, showItem }
  },
  watch: {
    data: {
      async handler(nval) {
        this.widgets = this.getWidgets()
      },
      immediate: true,
      deep: true,
    },
  },
})
</script>

<style lang="less" scoped>
@color0: #ffffff; // Appears 5 times
@color1: #999999; // Appears 3 times
@color2: rgba(0, 0, 0, 0.05); // Appears 2 times

.widget-list {
  width: 100%;
  .widget {
    align-items: center;
    background-color: #ffffff;
    border-bottom: 1px solid @color2;
    color: @color1;
    // cursor: move;
    cursor: grab;
    display: flex;
    padding: 8px;
    position: relative;
    width: 100%;
    .widget-type {
      // outline: 1px solid #dedede;
      align-items: center;
      color: @color1;
      display: flex;
      height: 30px;
      width: 30px;
      justify-content: center;
      margin-right: 10px;
      &__img {
        object-fit: contain;
        background-color: @color0;
        background-image: -webkit-linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef), -webkit-linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef);
        background-position: 0 0, 10px 10px;
        background-size: 21px 21px;
        outline: 1px solid #dedede;
      }
    }
    .widget-name {
      flex: 1;
      font-size: 14px;
      padding-right: 22px;
    }
    .widget-out {
      height: 100%;
      margin-left: -12px;
      position: absolute;
      width: 100%;
      display: flex;
      align-items: center;
    }
    .widget-out:hover > .sd-jiesuo {
      opacity: 1;
    }
  }
  .widget.active {
    background-color: #888888;
    color: @color0;
  }
  .item-one {
    padding-left: 12px;
  }
  // .item-two {
  //   padding-left: 40px;
  // }
}

.w-group {
  font-weight: bold;
}
// icons
.sd-jiesuo,
.sd-suoding {
  position: absolute;
  right: 12px;
  font-size: 18px;
  cursor: default;
  color: #444444;
}
.sd-jiesuo {
  opacity: 0;
}
.sd-xiaji {
  margin: 0 -4px 0 32px !important;
}
.second-layer {
  margin-right: 40px;
}

// dragable
.choose {
  border: 1px dashed #999999 !important;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}
.disable {
  opacity: 0.3;
}
.ghost {
  opacity: 0.3;
  background: @main-color;
}
</style>

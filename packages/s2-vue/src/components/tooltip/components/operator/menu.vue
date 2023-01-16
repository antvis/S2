<script lang="ts">
import {
  type TooltipOperatorMenu,
  type S2CellType,
  TOOLTIP_PREFIX_CLS,
} from '@antv/s2';
import { Menu } from 'ant-design-vue';
import { isEmpty } from 'lodash';
import { defineComponent } from 'vue';
import type { GetInitProps } from '../../../../interface';
import TooltipOperatorTitle from './title.vue';

interface TooltipOperatorMenuProps {
  menu: TooltipOperatorMenu;
  cell: S2CellType;
}

export default defineComponent({
  name: 'TooltipOperatorMenu',
  props: ['menu', 'cell'] as unknown as GetInitProps<TooltipOperatorMenuProps>,
  setup(props) {
    const onMenuTitleClick = () => {
      props.menu.onClick?.(props.cell);
    };

    return {
      onMenuTitleClick,
      isEmpty,
      TOOLTIP_PREFIX_CLS,
    };
  },
  components: {
    MenuItem: Menu.Item,
    SubMenu: Menu.SubMenu,
    TooltipOperatorTitle,
  },
});
</script>

<template>
  <SubMenu
    v-if="!isEmpty(menu.children)"
    :key="menu.key"
    :popupClassName="`${TOOLTIP_PREFIX_CLS}-operator-submenu-popup`"
    @titleClick="onMenuTitleClick"
  >
    <template #title>
      <TooltipOperatorTitle :menu="menu" @click="onMenuTitleClick" />
    </template>
    <template v-for="subMenu in menu.children" :key="subMenu.key">
      <template v-if="subMenu?.children?.length">
        <TooltipOperatorMenu :menu="subMenu" :cell="cell" />
      </template>
      <template v-else>
        <MenuItem :title="subMenu.text" :key="subMenu.key">
          <TooltipOperatorTitle :menu="subMenu" @click="onMenuTitleClick" />
        </MenuItem>
      </template>
    </template>
  </SubMenu>
  <!-- v-if/else branches must use unique keys. -->
  <MenuItem v-if="isEmpty(menu.children)" :title="menu.text" :key="menu.key">
    <TooltipOperatorTitle :menu="menu" @click="onMenuTitleClick" />
  </MenuItem>
</template>

<style lang="less"></style>

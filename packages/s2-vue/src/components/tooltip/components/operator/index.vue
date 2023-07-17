<script lang="ts">
import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import type { TooltipOperatorProps as BaseTooltipOperatorProps } from '@antv/s2-shared';
import { Menu, Dropdown, type MenuProps } from 'ant-design-vue';
import { defineComponent } from 'vue';
import type { MenuClickEventHandler } from 'ant-design-vue/lib/menu/src/interface';
import type { GetInitProps } from '../../../../interface';
import TooltipOperatorTitle from './title.vue';
import TooltipOperatorMenu from './menu.vue';

interface TooltipOperatorProps extends BaseTooltipOperatorProps {
  onClick?: MenuProps['onClick'];
}

export default defineComponent({
  name: 'TooltipOperator',
  props: [
    'menus',
    'onlyShowOperator',
    'onClick',
    'cell',
  ] as unknown as GetInitProps<TooltipOperatorProps>,
  setup(_, { emit }) {
    const onMenuClick: MenuClickEventHandler = (menuInfo) => {
      emit('click', menuInfo);
    };

    return {
      TOOLTIP_PREFIX_CLS,
      onMenuClick,
    };
  },
  components: {
    Menu,
    Dropdown,
    TooltipOperatorTitle,
    TooltipOperatorMenu,
  },
});
</script>

<template>
  <div :class="`${TOOLTIP_PREFIX_CLS}-operator`">
    <template v-if="onlyShowOperator">
      <Menu
        :class="`${TOOLTIP_PREFIX_CLS}-operator-menus`"
        @click="onMenuClick"
      >
        <template v-for="menu in menus" :key="menu.key">
          <TooltipOperatorMenu :menu="menu" :cell="cell" />
        </template>
      </Menu>
    </template>
    <template v-else>
      <template v-for="menu in menus" :key="menu.key">
        <Dropdown :class="`${TOOLTIP_PREFIX_CLS}-operator-dropdown`">
          <TooltipOperatorTitle :menu="menu" @click="menu.onClick?.(cell)" />
          <template #overlay>
            <Menu
              :class="`${TOOLTIP_PREFIX_CLS}-operator-menus`"
              @click="onMenuClick"
              v-if="menu?.children?.length"
            >
              <template v-for="menu in menus" :key="menu.key">
                <TooltipOperatorMenu :menu="menu" :cell="cell" />
              </template>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </template>
  </div>
</template>

<style lang="less">
@import '@antv/s2-shared/src/styles/tooltip/operator.less';
</style>

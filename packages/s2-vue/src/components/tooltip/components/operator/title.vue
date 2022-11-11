<script lang="ts">
import {
  type TooltipOperatorMenu,
  TOOLTIP_PREFIX_CLS,
  getIcon,
} from '@antv/s2';
import { computed, defineComponent } from 'vue';
import type { GetInitProps } from '../../../../interface';

interface TooltipOperatorTitleProps {
  menu: TooltipOperatorMenu;
}

export default defineComponent({
  name: 'TooltipOperatorTitle',
  props: ['menu'] as unknown as GetInitProps<TooltipOperatorTitleProps>,
  setup(props) {
    const icon = computed(() => getIcon(props.menu.icon as string));

    return {
      TOOLTIP_PREFIX_CLS,
      icon,
    };
  },
});
</script>

<template>
  <span>
    <span
      v-if="icon"
      v-html="icon"
      :class="`${TOOLTIP_PREFIX_CLS}-operator-icon`"
    />
    <span :class="`${TOOLTIP_PREFIX_CLS}-operator-text`">{{ menu.text }}</span>
  </span>
</template>

<style lang="less"></style>

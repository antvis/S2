<script lang="ts">
import { getIcon, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { defineComponent, computed, type PropType } from 'vue';

export interface TooltipIconProps {
  icon?: string | unknown;
  width?: number;
  height?: number;
}

export default defineComponent({
  name: 'TooltipIcon',
  props: {
    icon: {
      type: [String, Object] as PropType<string | unknown>,
      default: undefined,
    },
    width: {
      type: Number,
      default: undefined,
    },
    height: {
      type: Number,
      default: undefined,
    },
  },
  setup(props) {
    const svgIcon = computed(() => {
      if (typeof props.icon === 'string') {
        return getIcon(props.icon);
      }

      return null;
    });

    const iconStyle = computed(() => {
      const style: Record<string, string> = {};

      if (props.width) {
        style['width'] = `${props.width}px`;
      }

      if (props.height) {
        style['height'] = `${props.height}px`;
      }

      return style;
    });

    const isStringIcon = computed(() => {
      return typeof props.icon === 'string' && getIcon(props.icon);
    });

    return {
      svgIcon,
      iconStyle,
      isStringIcon,
      TOOLTIP_PREFIX_CLS,
    };
  },
});
</script>

<template>
  <span
    v-if="isStringIcon"
    :style="iconStyle"
    :class="`${TOOLTIP_PREFIX_CLS}-icon`"
    v-html="svgIcon"
  />
  <component
    v-else-if="icon && typeof icon === 'object'"
    :is="icon"
    :style="iconStyle"
  />
</template>

<style lang="less"></style>

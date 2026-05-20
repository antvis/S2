<script lang="ts">
import { i18n, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'TooltipDescription',
  props: {
    description: {
      type: [String, Object] as PropType<string | unknown>,
      default: undefined,
    },
  },
  setup() {
    return {
      TOOLTIP_PREFIX_CLS,
      i18n,
    };
  },
});
</script>

<template>
  <div v-if="description" :class="`${TOOLTIP_PREFIX_CLS}-description`">
    {{ i18n('说明') }}{{ description }}
  </div>
</template>

<style lang="less"></style>

<script lang="ts">
import { type TooltipDetailProps, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { defineComponent } from 'vue';
import type { GetInitProps } from '../../../interface';

export default defineComponent({
  name: 'TooltipDetail',
  props: ['list'] as unknown as GetInitProps<TooltipDetailProps>,
  setup() {
    return {
      TOOLTIP_PREFIX_CLS,
    };
  },
});
</script>

<template>
  <div
    v-for="(item, index) in list"
    :key="`${item.value}-${index}`"
    :class="`${TOOLTIP_PREFIX_CLS}-detail-list`"
  >
    <div :class="`${TOOLTIP_PREFIX_CLS}-detail-item`">
      <span :class="`${TOOLTIP_PREFIX_CLS}-detail-item-key`">
        {{ item.name }}
      </span>
      <span
        :class="`${TOOLTIP_PREFIX_CLS}-detail-item-val ${TOOLTIP_PREFIX_CLS}-highlight`"
      >
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<style lang="less"></style>

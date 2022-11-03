<script lang="ts">
import { type TooltipHeadInfo, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { defineComponent } from 'vue';
import type { GetInitProps } from '../../../interface';

export default defineComponent({
  name: 'TooltipHeadInfo',
  props: ['rows', 'cols'] as unknown as GetInitProps<TooltipHeadInfo>,
  setup() {
    return {
      TOOLTIP_PREFIX_CLS,
    };
  },
  components: {},
});
</script>

<template>
  <div
    v-if="cols?.length || rows?.length"
    :class="`${TOOLTIP_PREFIX_CLS}-head-info-list`"
  >
    <span v-for="col in cols" :key="col.value">{{ col.value }}/</span>
    <span v-if="cols?.length > 0 && rows?.length > 0">，</span>
    <span v-for="row in rows" :key="row.value">{{ row.value }}/</span>
  </div>
</template>

<style lang="less"></style>

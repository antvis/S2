<script lang="ts">
import { TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { defineComponent } from 'vue';
import type { GetInitProps } from '../../../interface';
import type { TooltipInfosProps } from '../interface';

export default defineComponent({
  name: 'TooltipInfos',
  props: ['infos'] as unknown as GetInitProps<TooltipInfosProps>,
  setup() {
    return {
      TOOLTIP_PREFIX_CLS,
    };
  },
  components: {},
});
</script>

<template>
  <div :class="`${TOOLTIP_PREFIX_CLS}-infos`">{{ infos }}</div>
</template>

<style lang="less"></style>

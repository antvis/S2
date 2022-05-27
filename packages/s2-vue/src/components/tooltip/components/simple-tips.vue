<script lang="ts">
import { type TooltipNameTipsOptions, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { defineComponent } from 'vue';
import type { GetInitProps } from '../../../interface';

export default defineComponent({
  name: 'TooltipSimpleTips',
  props: ['name', 'tips'] as unknown as GetInitProps<TooltipNameTipsOptions>,
  setup() {
    return {
      TOOLTIP_PREFIX_CLS,
    };
  },
  components: {},
});
</script>

<template>
  <div v-if="name" :class="`${TOOLTIP_PREFIX_CLS}-name`">{{ name }}</div>
  <div v-if="tips" :class="`${TOOLTIP_PREFIX_CLS}-tips`">{{ tips }}</div>
</template>

<style lang="less"></style>

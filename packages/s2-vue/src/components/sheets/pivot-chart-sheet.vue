<script lang="ts">
import { defineComponent } from 'vue';
import { useExpose } from '../../hooks/useExpose';
import type { BaseSheetInitEmits } from '../../interface';
import { initBaseSheetProps } from '../../utils/initPropAndEmits';
import BaseSheet from './base-sheet.vue';

export default defineComponent({
  name: 'PivotChartSheet',
  props: initBaseSheetProps(),
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);

    return {
      s2Ref,
    };
  },
  components: {
    BaseSheet,
  },
});
</script>

<template>
  <BaseSheet v-bind="$props" ref="s2Ref" />
</template>

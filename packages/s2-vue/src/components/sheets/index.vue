<script lang="ts">
import type { SheetType } from '@antv/s2-shared';
import { computed, defineComponent } from 'vue';
import { useExpose } from '../../hooks/useExpose';
import type { BaseSheetInitEmits, BaseSheetInitProps } from '../../interface';
import PivotSheet from './pivot-sheet.vue';
import TableSheet from './table-sheet.vue';

export default defineComponent({
  name: 'Sheet',
  props: [] as unknown as BaseSheetInitProps,
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);

    const sheetType = computed(() => {
      const type = ctx.attrs['sheetType'] as SheetType;

      switch (type) {
        case 'table':
          return TableSheet;
        default:
          return PivotSheet;
      }
    });

    return { s2Ref, sheetType };
  },
  components: {
    PivotSheet,
    TableSheet,
  },
});
</script>
<template>
  <component :is="sheetType" ref="s2Ref" />
</template>

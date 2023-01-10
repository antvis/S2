<script lang="ts">
import { defineComponent } from 'vue';
import { useExpose } from '../../hooks/useExpose';
import type { BaseSheetInitEmits, BaseSheetInitProps } from '../../interface';
import BaseSheet from './base-sheet.vue';

export default defineComponent({
  name: 'TableSheet',
  props: [] as unknown as BaseSheetInitProps,
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);

    return { s2Ref };
  },
  components: {
    BaseSheet,
  },
});
</script>
<template>
  <BaseSheet ref="s2Ref" />
</template>

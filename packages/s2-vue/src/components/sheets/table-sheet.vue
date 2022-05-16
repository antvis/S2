<script lang="ts">
import type { SpreadSheet } from '@antv/s2';
import { defineComponent, shallowRef } from 'vue';
import type { BaseSheetInitEmits, BaseSheetInitProps } from '../../interface';
import BaseSheet from './base-sheet.vue';

export default defineComponent({
  name: 'TableSheet',
  props: [] as unknown as BaseSheetInitProps,
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = shallowRef<{ instance: SpreadSheet }>();

    ctx.expose({
      get instance() {
        return s2Ref.value?.instance;
      },
    });

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

<script lang="ts">
import { customMerge, type ThemeCfg, type S2Options } from '@antv/s2';
import { computed, defineComponent, toRefs } from 'vue';
import { useExpose } from '../../../hooks/useExpose';
import type { BaseSheetInitEmits } from '../../../interface';
import { initBaseSheetProps } from '../../../utils/initPropAndEmits';
import BaseSheet from '../base-sheet.vue';
import { GridAnalysisSheetDataCell } from './custom-cell';
import { GridAnalysisTheme } from './theme';

export default defineComponent({
  name: 'GridAnalysisSheet',
  props: initBaseSheetProps(),
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);
    const { options: defaultOptions, themeCfg } = toRefs(props);

    const s2Options = computed<S2Options>(() => {
      const options: Partial<S2Options> = {
        dataCell: (viewMeta, spreadsheet) =>
          new GridAnalysisSheetDataCell(viewMeta, spreadsheet),
        showDefaultHeaderActionIcon: false,
        style: {
          colCell: {
            hideValue: true,
          },
        },
      };

      return customMerge<S2Options>(defaultOptions?.value, options);
    });

    const s2ThemeCfg = computed<ThemeCfg>(() =>
      customMerge<ThemeCfg>(themeCfg?.value, { theme: GridAnalysisTheme }),
    );

    return {
      s2Ref,
      s2Options,
      s2ThemeCfg,
    };
  },
  components: {
    BaseSheet,
  },
});
</script>

<template>
  <BaseSheet
    v-bind="$props"
    ref="s2Ref"
    :options="s2Options"
    :themeCfg="s2ThemeCfg"
  />
</template>

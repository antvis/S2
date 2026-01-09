<script lang="ts">
import { customMerge, type ThemeCfg, type S2Options } from '@antv/s2';
import { computed, defineComponent, toRefs } from 'vue';
import { useExpose } from '../../hooks/useExpose';
import type { BaseSheetInitEmits } from '../../interface';
import { initBaseSheetProps } from '../../utils/initPropAndEmits';
import BaseSheet from './base-sheet.vue';

/**
 * ChartSheet - 用于在单元格中渲染图表
 *
 * 注意：要使用 ChartDataCell 自定义单元格渲染图表，
 * 需要在使用组件时通过 options.dataCell 配置 ChartDataCell
 *
 * 示例: 在 options 中配置 dataCell 属性:
 * dataCell: (viewMeta, spreadsheet) => new ChartDataCell(viewMeta, spreadsheet)
 */
export default defineComponent({
  name: 'ChartSheet',
  props: initBaseSheetProps(),
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);
    const { options: chartOptions, themeCfg: customThemeCfg } = toRefs(props);

    const s2Options = computed<S2Options>(() => {
      const defaultOptions: Partial<S2Options> = {
        style: {
          rowCell: {
            width: 100,
          },
          dataCell: {
            width: 400,
            height: 400,
          },
        },
        tooltip: {
          enable: true,
        },
      };

      const options: Partial<S2Options> = {
        showDefaultHeaderActionIcon: false,
        interaction: {
          hoverFocus: false,
          brushSelection: {
            dataCell: false,
          },
        },
      };

      return customMerge<S2Options>(
        defaultOptions,
        chartOptions.value,
        options,
      );
    });

    const themeCfg = computed<ThemeCfg>(() => {
      const defaultTheme: ThemeCfg['theme'] = {
        dataCell: {
          cell: {
            interactionState: {
              hoverFocus: {
                borderOpacity: 0,
              },
              selected: {
                borderOpacity: 0,
              },
            },
          },
        },
      };

      return customMerge<ThemeCfg>(defaultTheme, customThemeCfg?.value);
    });

    return {
      s2Ref,
      s2Options,
      themeCfg,
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
    :themeCfg="themeCfg"
  />
</template>

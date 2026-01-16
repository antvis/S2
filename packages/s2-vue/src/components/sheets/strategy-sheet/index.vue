<script lang="ts">
import {
  Node,
  SpreadSheet,
  customMerge,
  type ColHeaderConfig,
  type S2Options,
} from '@antv/s2';
import { isEmpty, size } from 'lodash';
import { computed, defineComponent, toRefs } from 'vue';
import { useExpose } from '../../../hooks/useExpose';
import type { BaseSheetInitEmits } from '../../../interface';
import { initBaseSheetProps } from '../../../utils/initPropAndEmits';
import BaseSheet from '../base-sheet.vue';
import { StrategySheetColCell } from './custom-col-cell';
import { StrategySheetDataCell } from './custom-data-cell';
import { StrategySheetDataSet } from './custom-data-set';

export default defineComponent({
  name: 'StrategySheet',
  props: initBaseSheetProps(),
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);
    const { options, themeCfg, dataCfg } = toRefs(props);

    const strategySheetOptions = computed<Partial<S2Options> | null>(() => {
      if (isEmpty(dataCfg.value)) {
        return null;
      }

      // 单指标非自定义树结构隐藏指标列
      const shouldHideValue = size(dataCfg.value?.fields?.values) === 1;

      return {
        hierarchyType: 'tree',
        dataCell: (viewMeta, spreadsheet) =>
          new StrategySheetDataCell(viewMeta, spreadsheet),
        colCell: (
          node: Node,
          spreadsheet: SpreadSheet,
          headerConfig: ColHeaderConfig,
        ) => new StrategySheetColCell(node, spreadsheet, headerConfig),
        dataSet: (spreadSheet: SpreadSheet) =>
          new StrategySheetDataSet(spreadSheet),
        showDefaultHeaderActionIcon: false,
        style: {
          colCell: {
            hideValue: shouldHideValue,
          },
        },
        interaction: {
          autoResetSheetStyle: true,
          // 趋势分析表禁用 刷选, 多选, 区间多选
          brushSelection: false,
          selectedCellMove: false,
          multiSelection: false,
          rangeSelection: false,
        },
        tooltip: {
          operation: {
            hiddenColumns: true,
          },
        },
      };
    });

    const s2Options = computed<S2Options>(() =>
      customMerge<S2Options>(strategySheetOptions.value, options?.value),
    );

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

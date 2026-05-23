<script lang="ts">
import type { Node } from '@antv/s2';
import { getStrategySheetTooltipClsName as tooltipCls } from '@antv/s2';
import { isFunction } from 'lodash';
import { defineComponent, computed, type PropType } from 'vue';
import type { CustomTooltipProps } from './interface';

export default defineComponent({
  name: 'StrategySheetColCellTooltip',
  props: {
    cell: {
      type: Object as PropType<CustomTooltipProps['cell']>,
      required: true,
    },
    label: {
      type: [Object, Function] as PropType<CustomTooltipProps['label']>,
      default: undefined,
    },
  },
  setup(props) {
    const meta = computed(() => props.cell.getMeta() as Node);

    const shouldHide = computed(() => {
      // 趋势分析表叶子节点显示是指标标题, tooltip 中没必要再显示了
      return meta.value.isLeaf && meta.value.level !== 0;
    });

    const cellName = computed(() => {
      const m = meta.value;
      const name = m.spreadsheet.dataSet.getFieldName(m.field!);
      const customLabel = isFunction(props.label)
        ? props.label(props.cell, name)
        : props.label;

      return customLabel ?? name;
    });

    const cellValue = computed(() => meta.value.value);

    return {
      tooltipCls,
      shouldHide,
      cellName,
      cellValue,
    };
  },
});
</script>

<template>
  <div v-if="!shouldHide" :class="[tooltipCls(), tooltipCls('col')]">
    <span :class="tooltipCls('name')">{{ cellName }}</span>
    <span :class="tooltipCls('value')">{{ cellValue }}</span>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>

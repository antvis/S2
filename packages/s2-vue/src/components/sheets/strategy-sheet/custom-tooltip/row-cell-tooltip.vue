<script lang="ts">
import type { Node } from '@antv/s2';
import { i18n, getStrategySheetTooltipClsName as tooltipCls } from '@antv/s2';
import { isFunction } from 'lodash';
import { defineComponent, computed, type PropType } from 'vue';
import type { CustomTooltipProps } from './interface';

export default defineComponent({
  name: 'StrategySheetRowCellTooltip',
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

    const rowName = computed(() => {
      const { value } = meta.value;
      const customLabel = isFunction(props.label)
        ? props.label(props.cell, value)
        : props.label;

      return customLabel ?? value;
    });

    const description = computed(() => {
      const { field, spreadsheet, extra } = meta.value;

      return (
        spreadsheet.dataSet.getFieldDescription(field) || extra?.['description']
      );
    });

    return {
      tooltipCls,
      i18n,
      rowName,
      description,
    };
  },
});
</script>

<template>
  <div :class="[tooltipCls(), tooltipCls('row')]">
    <div :class="tooltipCls('value')">{{ rowName }}</div>
    <div v-if="description" :class="tooltipCls('description')">
      <span :class="tooltipCls('description-label')">{{ i18n('说明') }}</span>
      <span :class="tooltipCls('description-text')">{{ description }}</span>
    </div>
  </div>
</template>

<style lang="less">
@import './index.less';
</style>

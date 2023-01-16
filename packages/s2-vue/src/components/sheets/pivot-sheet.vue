<script lang="ts">
import { computed, defineComponent, ref, toRefs, createVNode } from 'vue';
import { isEmpty } from 'lodash';
import { buildDrillDownOptions, handleDrillDown } from '@antv/s2-shared';
import type { SpreadSheet, S2Options } from '@antv/s2';
import type { PartDrillDown, ActionIconCallbackParams } from '@antv/s2-shared';
import { useExpose } from '../../hooks/useExpose';
import type { BaseSheetInitEmits } from '../../interface';
import { initBaseSheetProps } from '../../utils/initPropAndEmits';
import DrillDown from '../drill-down/index.vue';
import BaseSheet from './base-sheet.vue';

export default defineComponent({
  name: 'PivotSheet',
  props: initBaseSheetProps(),
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);
    const { options: pivotOptions } = toRefs(props);
    const { dataCfg, partDrillDown } = toRefs(props);
    // 被下钻的 field
    const drillFields = ref<string[]>([]);

    // 执行下钻操作
    const setDrillFields = (fields: string[]) => {
      const instance = s2Ref?.value?.instance;

      drillFields.value = fields;
      instance?.hideTooltip();
      if (isEmpty(fields)) {
        instance?.clearDrillDownData(instance?.store.get('drillDownNode')?.id);
      } else {
        // 执行下钻
        handleDrillDown({
          rows: (dataCfg.value?.fields.rows as string[]) ?? [],
          drillFields: fields,
          fetchData: partDrillDown.value?.['fetchData'],
          drillItemsNum: partDrillDown.value?.['drillItemsNum'],
          spreadsheet: instance as SpreadSheet,
        });
      }
    };

    /**
     * 点击下钻后，下钻组件的出现
     */
    const onDrillDownIconClick = (params: ActionIconCallbackParams) => {
      const { event, disabledFields } = params;

      if (event) {
        const instance = s2Ref?.value?.instance;
        const drillDownNode = createVNode(DrillDown, {
          ...partDrillDown.value?.['drillConfig'],
          setDrillFields,
          drillFields: drillFields.value,
          disabledFields,
        });

        // 将下钻设置为 tooltip 的 content 进行展示
        instance?.showTooltip({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          event,
          content: drillDownNode,
        });
      }
    };

    // 展示下钻icon
    const options = computed(() =>
      buildDrillDownOptions(
        pivotOptions.value as S2Options,
        partDrillDown.value as PartDrillDown,
        (params) => onDrillDownIconClick(params),
      ),
    ) as S2Options;

    return {
      s2Ref,
      options,
    };
  },
  components: {
    BaseSheet,
  },
});
</script>

<template>
  <BaseSheet v-bind="$props" ref="s2Ref" :options="options" />
</template>

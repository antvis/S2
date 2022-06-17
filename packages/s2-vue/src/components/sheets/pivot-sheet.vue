<script lang="ts">
import { computed, defineComponent, ref, toRefs, h, createVNode } from 'vue';
import { isEmpty } from 'lodash';
import {
  buildDrillDownOptions,
  handleDrillDown,
} from '@antv/s2-shared/src/utils/drill-down';
import type {
  ActionIconCallback,
  ActionIconCallbackParams,
} from '@antv/s2-shared/src/utils/drill-down';

import type { SpreadSheet, S2Options } from '@antv/s2';
import type { PartDrillDown } from '@antv/s2-shared';
import { useExpose } from '../../hooks/useExpose';
import {
  initBaseSheetEmits,
  initBaseSheetProps,
} from '../../utils/initPropAndEmits';
import DrillDown from '../drill-down/index.vue';
import BaseSheet from './base-sheet.vue';

export default defineComponent({
  name: 'PivotSheet',
  props: initBaseSheetProps(),
  emits: initBaseSheetEmits(),
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);
    // Getting a value from the `props` in root scope of `setup()` will cause the value to lose reactivity
    // const { options: pivotOptions, ...restProps } = props;
    const { options: pivotOptions, ...restProps } = toRefs(props);

    const { dataCfg, partDrillDown } = toRefs(props);
    const drillVisible = ref<boolean>(false);
    const drillDownPosition = ref<{
      x: number;
      y: number;
    }>({ x: 0, y: 0 });

    // 下钻方法
    const drillFields = ref<string[]>([]);

    // 执行下钻操作
    const setDrillFields = (fields: string[]) => {
      const instance = s2Ref?.value?.instance;
      drillFields.value = fields;

      // 隐藏 tooltip + drilldown 的UI层
      instance?.hideTooltip();
      drillVisible.value = false;

      if (isEmpty(fields)) {
        instance?.clearDrillDownData(instance?.store.get('drillDownNode')?.id);
      } else {
        // 执行下钻
        handleDrillDown({
          rows: dataCfg.value?.fields.rows ?? [],
          drillFields: fields,
          fetchData: partDrillDown.value?.fetchData,
          drillItemsNum: partDrillDown.value?.drillItemsNum,
          spreadsheet: instance as SpreadSheet,
        });
      }
    };

    /**
     * 点击下钻后，下钻组件的出现
     */
    const onDrillDownIconClick = (params: ActionIconCallbackParams) => {
      const { event } = params;
      if (event) {
        const instance = s2Ref?.value?.instance;
        const drillDownNode = createVNode(DrillDown, {
          setDrillFields,
          dataSet: partDrillDown.value?.drillConfig.dataSet,
          drillFields: drillFields.value,
        });
        // 下钻通过 teleport 出现
        instance?.showTooltip({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          event,
          content: drillDownNode,
        });
        drillVisible.value = true;
      }
    };

    // 展示下钻icon
    const options = computed(() =>
      buildDrillDownOptions(
        pivotOptions as S2Options,
        partDrillDown.value as PartDrillDown,
        (params) => onDrillDownIconClick(params),
      ),
    );

    return {
      s2Ref,
      dataSet: partDrillDown.value?.drillConfig.dataSet,
      setDrillFields,
      drillVisible,
      drillDownPosition,
      drillFields,
      restProps,
      options,
    };
  },
  components: {
    BaseSheet,
  },
});
</script>

<template>
  <BaseSheet ref="s2Ref" :options="options" v-bind="restProps" />
</template>

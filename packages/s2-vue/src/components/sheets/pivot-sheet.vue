<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import type { Ref } from 'vue';
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
import S2DrillDown from '../drill-down/index.vue';
import type { BaseSheetInitEmits, BaseSheetInitProps } from '../../interface';
import { useExpose } from '../../hooks/useExpose';
import {
  initBaseSheetEmits,
  initBaseSheetProps,
} from '../../utils/initPropAndEmits';
import BaseSheet from './base-sheet.vue';

export default defineComponent({
  name: 'PivotSheet',
  // todo-zc:
  props: initBaseSheetProps(),
  emits: initBaseSheetEmits(),
  setup(props, ctx) {
    // fallthroughAttributes vs  inject
    const s2Ref = useExpose(ctx.expose);
    // Getting a value from the `props` in root scope of `setup()` will cause the value to lose reactivity
    const { options: pivotOptions, ...restProps } = toRefs(props);

    // console.log(props, 'props pivot sheet !!');
    const { dataCfg, partDrillDown } = toRefs(props);

    const drillVisible = ref<boolean>(false);

    // 下钻方法
    const drillFields = ref<string[]>([]);

    // 执行下钻操作
    const setDrillFields = (fields: string[]) => {
      // console.log(fields, 'fileds')
      const instance = s2Ref?.value?.instance;
      drillFields.value = fields;
      instance?.hideTooltip();
      drillVisible.value = false;
      if (isEmpty(drillFields)) {
        instance?.clearDrillDownData(instance?.store.get('drillDownNode')?.id);
      } else {
        // 执行下钻
        handleDrillDown({
          rows: dataCfg.value?.fields.rows ?? [],
          drillFields: drillFields.value,
          fetchData: partDrillDown.value?.fetchData,
          drillItemsNum: partDrillDown.value?.drillItemsNum,
          spreadsheet: instance as SpreadSheet,
        });
      }
    };

    /**
     * 点击下钻 出现 todo-zc: 完成点击后，下钻组件的出现
     * dataset + fetchData
     */
    const onDrillDownIconClick = (params: ActionIconCallbackParams) => {
      drillVisible.value = true;
    };
    // 展示下钻icon
    const options = computed(() =>
      buildDrillDownOptions(
        pivotOptions as S2Options,
        partDrillDown.value as PartDrillDown,
        (params) => onDrillDownIconClick(params),
      ),
    );
    // vue 如何像 react  一样监听一个变化呢？

    // 下钻mock 数据
    const disabledFields = ['name'];
    const clearButtonText = '清除';

    return {
      s2Ref,
      dataSet: partDrillDown.value?.drillConfig.dataSet ?? [],
      disabledFields,
      clearButtonText,
      setDrillFields,
      drillVisible,
      restProps,
      options,
    };
  },
  components: {
    BaseSheet,
    S2DrillDown,
  },
});
</script>
<template>
  <BaseSheet ref="s2Ref" :options="options" v-bind="restProps" />

  <S2DrillDown
    v-if="drillVisible"
    :setDrillFields="setDrillFields"
    :dataSet="dataSet"
    :disabledFields="disabledFields"
    :clearButtonText="clearButtonText"
  />
</template>

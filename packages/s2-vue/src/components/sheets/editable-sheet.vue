<script lang="ts">
import { defineComponent, computed, toRefs, watch, ref, reactive } from 'vue';
import type { CSSProperties } from 'vue';
import { Input } from 'ant-design-vue';
import { isNil, pick } from 'lodash';
import type { TargetCellInfo, S2Options, S2CellType } from '@antv/s2';
import { useExpose } from '../../hooks/useExpose';
import type { BaseSheetInitEmits } from '../../interface';
import { initBaseSheetProps } from '../../utils/initPropAndEmits';
import BaseSheet from './base-sheet.vue';

function buildEditProps(option: S2Options): S2Options {
  return { ...option };
}

export default defineComponent({
  name: 'EditableSheet',
  props: initBaseSheetProps(),
  emits: [] as unknown as BaseSheetInitEmits,
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);
    const { options: originOptions } = toRefs(props);

    const inputRef = ref<HTMLInputElement>(null);
    const targetCell = ref<S2CellType>(null);
    const inputValue = ref<string>('');

    const options = computed(() =>
      buildEditProps(originOptions.value as S2Options),
    ) as S2Options;

    const inputStyle = reactive({
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      display: 'none',
      zIndex: 1000,
      position: 'absolute',
    }) as CSSProperties;

    function setInputStyle() {
      const spreadsheet = s2Ref.value?.instance;
      const cell = targetCell.value;

      if (!spreadsheet || !cell) {
        inputStyle.display = 'none';

        return;
      }

      const scroll = spreadsheet.facet.getScrollOffset();
      let cellPosition = pick(cell.getMeta(), ['x', 'y', 'width', 'height']);

      if (isNil(cellPosition.x) || isNil(cellPosition.y)) {
        cellPosition = {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        };
      }

      const sampleColNode = spreadsheet.facet.getColNodes()[0];
      const sampleColNodeHeight = sampleColNode?.height || 0;

      cellPosition.x -= scroll.scrollX || 0;
      cellPosition.y -= (scroll.scrollY || 0) - sampleColNodeHeight;
      const {
        x: cellLeft,
        y: cellTop,
        width: cellWidth,
        height: cellHeight,
      } = cellPosition;
      const inSight =
        cellTop >= 0 &&
        cellTop <= spreadsheet.facet.getCanvasSize().height &&
        cellLeft >= 0 &&
        cellLeft <= spreadsheet.facet.getCanvasSize().width;

      inputStyle.width = cellWidth ? `${cellWidth}px` : '0px';
      inputStyle.height = cellHeight ? `${cellHeight}px` : '0px';
      inputStyle.left = cellLeft ? `${cellLeft}px` : '0px';
      inputStyle.top = cellTop ? `${cellTop}px` : '0px';
      inputStyle.display = targetCell.value && inSight ? 'block' : 'none';
    }
    watch([targetCell, s2Ref.value?.instance.facet.getScrollOffset()], () => {
      setInputStyle();
    });

    const onDataCellDbClick = (cell: TargetCellInfo) => {
      targetCell.value = cell.target;
      inputValue.value = cell.target.getActualText();
      setTimeout(() => {
        inputRef.value?.focus();
      }, 100);
    };

    function onSave() {
      const target = inputRef.value;
      const cell = targetCell.value;
      const spreadsheet = s2Ref.value?.instance;

      if (!spreadsheet || !cell || !target) {
        return;
      }

      const { rowIndex, valueField, id } = cell.getMeta();
      const inputVal = target.value;
      const displayData = spreadsheet.dataSet.getDisplayDataSet();

      displayData[rowIndex][valueField] = inputVal;
      // 编辑后的值作为格式化后的结果, formatter 不再触发, 避免二次格式化
      spreadsheet.dataSet.displayFormattedValueMap?.set(id, inputVal);
      spreadsheet.render();

      targetCell.value = null;
    }

    return {
      setInputStyle,
      s2Ref,
      options,
      inputStyle,
      onDataCellDbClick,
      inputRef,
      onSave,
      inputValue,
      Input,
    };
  },
  components: {
    BaseSheet,
  },
}) as unknown;
</script>
<template>
  <BaseSheet
    @dataCellDoubleClick="onDataCellDbClick"
    @scroll="setInputStyle"
    @dataCellClick="onSave"
    ref="s2Ref"
    v-bind="$props"
    :options="options"
  >
    <template #editCell>
      <Input
        @blur="onSave"
        :value="inputValue"
        ref="inputRef"
        :style="inputStyle"
      />
    </template>
  </BaseSheet>
</template>

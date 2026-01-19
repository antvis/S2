<!-- eslint-disable max-lines-per-function -->
<script lang="ts">
import {
  DataCell,
  FrozenFacet,
  FrozenGroupArea,
  InteractionStateName,
  S2Event,
  S2_PREFIX_CLS,
  type Point,
} from '@antv/s2';
import { get, pick, throttle } from 'lodash';
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type PropType,
} from 'vue';
import { useSpreadSheetInstance } from '../../../../context/SpreadSheetContext';

import './drag-copy-mask.less';

export default defineComponent({
  name: 'DragCopyMask',
  props: {
    onCopyFinished: {
      type: Function as PropType<() => void>,
      default: undefined,
    },
  },
  setup(props) {
    const s2Ref = useSpreadSheetInstance();
    const startCell = ref<DataCell>();
    const maskPosition = ref({ right: 0, bottom: 0 });
    const dragPoint = ref<Point>();

    // 利用闭包记录最近一次hover位置
    const lastHoverPoint = { x: 0, y: 0 };

    const isInCell = (point: Point, cell: DataCell) => {
      const s2 = s2Ref.value;

      if (!s2) {
        return false;
      }

      const cellMeta = pick(cell.getMeta(), [
        'x',
        'y',
        'width',
        'height',
        'fieldValue',
      ]);
      const scrollOffset = s2.facet.getScrollOffset();
      const sampleColNode = s2.facet.getColNodes()[0];
      const sampleColNodeHeight = sampleColNode?.height || 0;
      const pointX = point.x;
      const pointY = point.y;
      const scrollOffsetY = scrollOffset?.scrollY - sampleColNodeHeight;
      const cellMaxX = cellMeta.x - scrollOffset.scrollX + cellMeta.width + 4;
      const cellMinX = cellMeta.x - scrollOffset.scrollX;
      const cellMaxY = cellMeta.y - scrollOffsetY + cellMeta.height + 4;
      const cellMinY = cellMeta.y - scrollOffsetY;

      return (
        cellMaxX >= pointX &&
        cellMinX < pointX &&
        cellMaxY >= pointY &&
        cellMinY < pointY
      );
    };

    const judgePointInView = (point: Point) => {
      const s2 = s2Ref.value;

      if (!s2) {
        return false;
      }

      const rect = s2.getCanvasElement().getBoundingClientRect();
      const frozenGroupAreas = (s2.facet as FrozenFacet).frozenGroupAreas;
      const viewMinX = rect.x;
      const viewMaxX = rect.x + rect.width;
      const viewMinY = rect.y + frozenGroupAreas[FrozenGroupArea.Row].height;
      const viewMaxY = rect.y + rect.height;

      return (
        point.x <= viewMaxX &&
        point.x >= viewMinX &&
        point.y <= viewMaxY &&
        point.y >= viewMinY
      );
    };

    const getCurrentHoverCell = (event: MouseEvent) => {
      const s2 = s2Ref.value;

      if (!s2) {
        return undefined;
      }

      const rect = s2.getCanvasElement().getBoundingClientRect();
      const allCells = s2.facet.getDataCells();

      return allCells.find((dataCell) =>
        isInCell({ y: event.y - rect.y, x: event.x - rect.x }, dataCell),
      );
    };

    const getSelectedCellRange = (start: DataCell, end: DataCell) => {
      const s2 = s2Ref.value;

      if (!s2) {
        return [];
      }

      const startCellMeta = start.getMeta();
      const endCellMeta = end?.getMeta();
      const minX = Math.min(startCellMeta.colIndex, endCellMeta.colIndex);
      const maxX = Math.max(startCellMeta.colIndex, endCellMeta.colIndex);
      const maxY = Math.max(startCellMeta.rowIndex, endCellMeta.rowIndex);
      const minY = Math.min(startCellMeta.rowIndex, endCellMeta.rowIndex);
      const allCells = s2.facet.getDataCells();

      return allCells.filter((item) => {
        const itemMeta = item.getMeta();

        return (
          itemMeta.rowIndex <= maxY &&
          itemMeta.rowIndex >= minY &&
          itemMeta.colIndex <= maxX &&
          itemMeta.colIndex >= minX
        );
      });
    };

    const dragMove = throttle((event: MouseEvent) => {
      const s2 = s2Ref.value;

      if (!startCell.value || !s2) {
        return;
      }

      let targetCell = getCurrentHoverCell(event);
      let newX = event.x - dragPoint.value!.x;
      let newY = event.y - dragPoint.value!.y;

      if (!judgePointInView(event)) {
        targetCell = getCurrentHoverCell(lastHoverPoint as MouseEvent);
        newX = lastHoverPoint.x - dragPoint.value!.x;
        newY = lastHoverPoint.y - dragPoint.value!.y;
      } else {
        lastHoverPoint.x = event.x;
        lastHoverPoint.y = event.y;
      }

      maskPosition.value = { right: newX, bottom: newY };
      const selectedRange = getSelectedCellRange(startCell.value, targetCell!);

      s2.interaction.changeState({
        cells: selectedRange.map((v) => v.getMeta() as any),
        stateName: InteractionStateName.PREPARE_SELECT,
        force: true,
      });
    }, 10);

    const dragMouseUp = async (event: MouseEvent) => {
      const s2 = s2Ref.value;

      if (!startCell.value || !s2) {
        return;
      }

      const targetCell =
        getCurrentHoverCell(event) ||
        getCurrentHoverCell(lastHoverPoint as MouseEvent);
      const displayData = s2.dataSet.getDisplayDataSet();
      const selectedRange = getSelectedCellRange(startCell.value, targetCell!);
      const { fieldValue } = startCell.value.getMeta();

      const changedCells = selectedRange.map((item) => {
        const { rowIndex, valueField } = item.getMeta();

        if (
          displayData[rowIndex] &&
          typeof displayData[rowIndex][valueField] !== 'undefined'
        ) {
          displayData[rowIndex][valueField] = fieldValue;
        }

        return item;
      });

      s2.interaction.changeState({
        cells: changedCells.map((v) => v.getMeta() as any),
        stateName: InteractionStateName.PREPARE_SELECT,
        force: true,
      });
      await s2.render(true);

      maskPosition.value = { right: 0, bottom: 0 };
      s2.off(S2Event.GLOBAL_MOUSE_MOVE, dragMove);
      s2.off(S2Event.GLOBAL_MOUSE_UP, dragMouseUp);
      startCell.value = undefined;
      props.onCopyFinished?.();
    };

    const dragMouseDown = (event: MouseEvent) => {
      const s2 = s2Ref.value;

      if (!s2) {
        return;
      }

      if (get(event, 'target.id') !== 'spreadsheet-drag-copy-point') {
        return;
      }

      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const { top, left } = get(event, 'target.style', {}) as {
        top: string;
        left: string;
      };
      const allCells = s2.facet.getDataCells();
      const targetCell = allCells.find((v) =>
        isInCell({ y: parseFloat(top), x: parseFloat(left) }, v),
      );

      dragPoint.value = { x: rect.x, y: rect.y };
      startCell.value = targetCell as DataCell;
    };

    watch(startCell, (cell) => {
      const s2 = s2Ref.value;

      if (cell && s2) {
        s2.on(S2Event.GLOBAL_MOUSE_MOVE, dragMove);
        s2.on(S2Event.GLOBAL_MOUSE_UP, dragMouseUp);
      }
    });

    onMounted(() => {
      const pointElement = document.getElementById(
        'spreadsheet-drag-copy-point',
      );

      pointElement?.addEventListener('mousedown', dragMouseDown);
    });

    onUnmounted(() => {
      const pointElement = document.getElementById(
        'spreadsheet-drag-copy-point',
      );

      pointElement?.removeEventListener('mousedown', dragMouseDown);
    });

    return {
      S2_PREFIX_CLS,
      maskPosition,
    };
  },
});
</script>

<template>
  <div
    :class="`${S2_PREFIX_CLS}-drag-copy-mask`"
    :style="{
      right: maskPosition.right > 0 ? `${maskPosition.right}px` : '0',
      bottom: maskPosition.bottom > 0 ? `${maskPosition.bottom}px` : '0',
      left: maskPosition.right <= 0 ? `${maskPosition.right}px` : '0',
      top: maskPosition.bottom <= 0 ? `${maskPosition.bottom}px` : '0',
      width: `${Math.abs(maskPosition.right)}px`,
      height: `${Math.abs(maskPosition.bottom)}px`,
    }"
  />
</template>

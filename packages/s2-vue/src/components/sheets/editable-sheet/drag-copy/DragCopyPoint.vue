<!-- eslint-disable max-lines-per-function -->
<script lang="ts">
import type { FrozenFacet, ScrollOffset } from '@antv/s2';
import {
  DataCell,
  FrozenGroupArea,
  GEvent,
  S2Event,
  S2_PREFIX_CLS,
} from '@antv/s2';
import { isEqual, pick } from 'lodash';
import { defineComponent, onUnmounted, ref, watch, computed } from 'vue';
import { useSpreadSheetInstance } from '../../../../context/SpreadSheetContext';
import DragCopyMask from './DragCopyMask.vue';

import './drag-copy-point.less';

export default defineComponent({
  name: 'DragCopyPoint',
  components: { DragCopyMask },
  setup() {
    const s2Ref = useSpreadSheetInstance();

    const scroll = ref<ScrollOffset & { width?: number; overflow?: boolean }>({
      scrollX: -999,
      scrollY: -999,
      width: 8,
      overflow: true,
    });
    const position = ref({ left: -999, top: -999 });
    const cell = ref<DataCell>();

    const handleScroll = () => {
      const spreadsheet = s2Ref.value;

      if (!spreadsheet) {
        return;
      }

      const newScroll = spreadsheet.facet.getScrollOffset();
      const frozenGroupAreas = (spreadsheet.facet as FrozenFacet)
        .frozenGroupAreas;
      const rect = spreadsheet.getCanvasElement().getBoundingClientRect();
      const cellMeta = cell.value?.getMeta();

      if (!isEqual(newScroll, scroll.value)) {
        if (cellMeta) {
          const {
            verticalBorderWidth: vWidth = 0,
            horizontalBorderWidth: hWidth = 0,
          } = cell.value!.getStyle()!.cell!;

          const pointX = cellMeta.width + cellMeta.x;
          const pointY = cellMeta.height + cellMeta.y;
          const pointWidth =
            pointX - newScroll.scrollX - rect.width + (vWidth + hWidth) * 2;
          let overflow = true;

          if (
            frozenGroupAreas[FrozenGroupArea.Col].width >=
              pointX - newScroll.scrollX - hWidth * 2 ||
            frozenGroupAreas[FrozenGroupArea.Row].height >=
              pointY - newScroll.scrollY - vWidth * 2 ||
            rect.width <= pointX - newScroll.scrollX - hWidth * 2 ||
            rect.height <=
              pointY -
                newScroll.scrollY +
                frozenGroupAreas[FrozenGroupArea.Row].height
          ) {
            overflow = true;
          } else {
            overflow = false;
          }

          scroll.value = {
            ...newScroll,
            overflow,
            width: 8 - (pointWidth > 0 ? pointWidth : 0),
          };
        } else {
          scroll.value = { scrollX: -999, scrollY: -999, overflow: true };
        }
      }
    };

    const fixPosition = (event: GEvent) => {
      const spreadsheet = s2Ref.value;

      if (!spreadsheet) {
        return;
      }

      const eventCell = spreadsheet.getCell<DataCell>(event.target);
      const isEventCellSelected = spreadsheet.interaction.isSelectedCell(
        eventCell!,
      );

      if (isEventCellSelected) {
        cell.value = eventCell!;
      } else {
        cell.value = undefined;
      }
    };

    const batchSelected = () => {
      cell.value = undefined;
    };

    const onCopyFinished = () => {
      batchSelected();
    };

    const bindEvents = () => {
      const spreadsheet = s2Ref.value;

      if (!spreadsheet) {
        return;
      }

      spreadsheet.on(S2Event.COL_CELL_CLICK, batchSelected);
      spreadsheet.on(S2Event.ROW_CELL_CLICK, batchSelected);
      spreadsheet.on(S2Event.CORNER_CELL_CLICK, batchSelected);
      spreadsheet.on(S2Event.DATA_CELL_BRUSH_SELECTION, batchSelected);
      spreadsheet.on(S2Event.DATA_CELL_CLICK, fixPosition);
      spreadsheet.on(S2Event.GLOBAL_SCROLL, handleScroll);
    };

    const unbindEvents = () => {
      const spreadsheet = s2Ref.value;

      if (!spreadsheet) {
        return;
      }

      spreadsheet.off(S2Event.COL_CELL_CLICK, batchSelected);
      spreadsheet.off(S2Event.ROW_CELL_CLICK, batchSelected);
      spreadsheet.off(S2Event.CORNER_CELL_CLICK, batchSelected);
      spreadsheet.off(S2Event.DATA_CELL_BRUSH_SELECTION, batchSelected);
      spreadsheet.off(S2Event.DATA_CELL_CLICK, fixPosition);
      spreadsheet.off(S2Event.GLOBAL_SCROLL, handleScroll);
    };

    // Watch cell changes
    watch(cell, () => {
      handleScroll();
    });

    // Update position when scroll or cell changes
    watch([scroll, cell], () => {
      const spreadsheet = s2Ref.value;

      if (!spreadsheet?.getCanvasElement()) {
        return;
      }

      if (spreadsheet && cell.value) {
        const sampleColNode = spreadsheet.facet.getColNodes()[0];
        const sampleColNodeHeight = sampleColNode?.height || 0;
        const cellMeta = pick(cell.value.getMeta(), [
          'x',
          'y',
          'width',
          'height',
          'fieldValue',
        ]);

        cellMeta.x -= scroll.value?.scrollX!;
        cellMeta.y -= scroll.value?.scrollY! - sampleColNodeHeight;
        position.value = {
          left: cellMeta.x + cellMeta.width - 4,
          top: cellMeta.y + cellMeta.height - 4,
        };
      }
    });

    // Watch for dataSet changes to reset cell
    watch(
      () => [
        s2Ref.value?.dataSet.sortParams,
        s2Ref.value?.dataSet.filterParams,
      ],
      () => {
        if (cell.value) {
          cell.value = undefined;
        }
      },
    );

    // Watch s2Ref to bind/unbind events
    watch(
      s2Ref,
      (newS2, oldS2) => {
        if (oldS2) {
          oldS2.off(S2Event.COL_CELL_CLICK, batchSelected);
          oldS2.off(S2Event.ROW_CELL_CLICK, batchSelected);
          oldS2.off(S2Event.CORNER_CELL_CLICK, batchSelected);
          oldS2.off(S2Event.DATA_CELL_BRUSH_SELECTION, batchSelected);
          oldS2.off(S2Event.DATA_CELL_CLICK, fixPosition);
          oldS2.off(S2Event.GLOBAL_SCROLL, handleScroll);
        }

        if (newS2) {
          bindEvents();
        }
      },
      { immediate: true },
    );

    onUnmounted(() => {
      unbindEvents();
    });

    const pointStyle = computed(() => ({
      display: scroll.value.overflow ? 'none' : 'block',
      left: `${position.value.left}px`,
      top: `${position.value.top}px`,
      width: `${scroll.value.width}px`,
    }));

    return {
      S2_PREFIX_CLS,
      pointStyle,
      onCopyFinished,
    };
  },
});
</script>

<template>
  <div
    id="spreadsheet-drag-copy-point"
    :class="`${S2_PREFIX_CLS}-drag-copy-point`"
    :style="pointStyle"
  >
    <DragCopyMask :onCopyFinished="onCopyFinished" />
  </div>
</template>

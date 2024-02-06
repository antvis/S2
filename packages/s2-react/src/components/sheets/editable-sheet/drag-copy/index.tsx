import type { ScrollOffset } from '@antv/s2';
import { DataCell, GEvent, S2Event, S2_PREFIX_CLS } from '@antv/s2';
import { isEqual, pick } from 'lodash';
import React from 'react';
import { useS2Event } from '../../../../hooks';
import { useSpreadSheetInstance } from '../../../../context/SpreadSheetContext';
import { DragCopyMask } from './drag-copy-mask';
import './drag-copy-point.less';

export const DragCopyPoint = React.memo(() => {
  const spreadsheet = useSpreadSheetInstance();

  const [scroll, setScroll] = React.useState<
    ScrollOffset & { width?: number; overflow?: boolean }
  >({
    scrollX: -999,
    scrollY: -999,
    width: 8,
    overflow: true,
  });
  const [position, setPosition] = React.useState({ left: -999, top: -999 });
  const [cell, setCell] = React.useState<DataCell>();

  const handleScroll = () => {
    if (spreadsheet) {
      const newScroll = spreadsheet.facet.getScrollOffset();
      const { frozenCol, frozenRow } = (spreadsheet.facet as any)
        .frozenGroupInfo;
      const rect = spreadsheet.getCanvasElement().getBoundingClientRect();
      const cellMeta = cell?.getMeta();

      if (!isEqual(newScroll, scroll)) {
        // 超出可视区域隐藏point
        if (cellMeta) {
          const {
            verticalBorderWidth: vWidth = 0,
            horizontalBorderWidth: hWidth = 0,
          } = cell!.getStyle()!.cell!;

          // 确定点位
          const pointX = cellMeta.width + cellMeta.x;
          const pointY = cellMeta.height + cellMeta.y;
          // 计算点位的偏移量
          const pointWidth =
            pointX - newScroll.scrollX - rect.width + (vWidth + hWidth) * 2;
          let overflow = true;

          if (
            frozenCol.width >= pointX - newScroll.scrollX - hWidth * 2 ||
            frozenRow.height >= pointY - newScroll.scrollY - vWidth * 2 ||
            rect.width <= pointX - newScroll.scrollX - hWidth * 2 ||
            rect.height <= pointY - newScroll.scrollY + frozenRow.height
          ) {
            overflow = true;
          } else {
            overflow = false;
          }

          setScroll({
            ...newScroll,
            overflow,
            width: 8 - (pointWidth > 0 ? pointWidth : 0),
          });
        } else {
          setScroll({ scrollX: -999, scrollY: -999, overflow: true });
        }
      }
    }
  };

  const fixPosition = (event: GEvent) => {
    const eventCell = spreadsheet.getCell<DataCell>(event.target);
    const isEventCellSelected = spreadsheet.interaction.isSelectedCell(
      eventCell!,
    );

    // 如果点击单元格时，单元格取消选中，隐藏拖拽点
    if (isEventCellSelected) {
      setCell(eventCell!);
    } else {
      setCell(undefined);
    }
  };

  React.useEffect(() => {
    handleScroll();
    if (spreadsheet) {
      spreadsheet.off(S2Event.GLOBAL_SCROLL, handleScroll);
      spreadsheet.on(S2Event.GLOBAL_SCROLL, handleScroll);
    }

    return () => {
      spreadsheet?.off(S2Event.GLOBAL_SCROLL, handleScroll);
    };
  }, [cell]);

  /** 单元格实例更改，选中态去除 */
  React.useEffect(() => {
    if (cell) {
      setCell(undefined);
    }
  }, [spreadsheet?.dataSet.sortParams, spreadsheet?.dataSet.filterParams]);

  React.useEffect(() => {
    if (!spreadsheet?.getCanvasElement()) {
      return;
    }

    if (spreadsheet && cell) {
      const sampleColNode = spreadsheet.facet.getColNodes()[0];
      const sampleColNodeHeight = sampleColNode?.height || 0;
      const cellMeta = pick(cell.getMeta(), [
        'x',
        'y',
        'width',
        'height',
        'fieldValue',
      ]);

      cellMeta.x -= scroll?.scrollX!;
      cellMeta.y -= scroll?.scrollY! - sampleColNodeHeight;
      setPosition({
        left: cellMeta.x + cellMeta.width - 4,
        top: cellMeta.y + cellMeta.height - 4,
      });
    }
  }, [scroll, cell]);

  /**
   * 多选时隐藏拖拽点
   */
  const batchSelected = React.useCallback(() => {
    setCell(undefined);
  }, []);

  useS2Event(S2Event.COL_CELL_CLICK, batchSelected, spreadsheet);
  useS2Event(S2Event.ROW_CELL_CLICK, batchSelected, spreadsheet);
  useS2Event(S2Event.CORNER_CELL_CLICK, batchSelected, spreadsheet);
  useS2Event(S2Event.DATA_CELL_BRUSH_SELECTION, batchSelected, spreadsheet);
  useS2Event(S2Event.DATA_CELL_CLICK, fixPosition, spreadsheet);

  return (
    <div
      id="spreadsheet-drag-copy-point"
      className={`${S2_PREFIX_CLS}-drag-copy-point`}
      style={{
        display: scroll.overflow ? 'none' : 'block',
        left: position.left,
        top: position.top,
        width: scroll.width,
      }}
    >
      <DragCopyMask onCopyFinished={batchSelected} />
    </div>
  );
});

DragCopyPoint.displayName = 'DragCopyPoint';

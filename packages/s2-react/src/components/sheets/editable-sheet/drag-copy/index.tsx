/**
 * @file 拖拽复制单元格右下角标
 * @author 张威澳
 */

import React, { useState, useEffect } from 'react';
import { S2Event } from '@antv/s2';
import { isEqual, pick } from 'lodash';
import type { Event as CanvasEvent } from '@antv/g-canvas';
import { useS2Event } from '../../../../hooks';
import { useSpreadSheetRef } from '../../../../utils/SpreadSheetContext';
import './drag-copy-point.less';
import { DragCopyMask } from './drag-copy-mask';

export type DragCopyProps = {
  onChange?: (val) => void;
};

export function DragCopyPoint(props: DragCopyProps) {
  const spreadsheet = useSpreadSheetRef();

  const [scroll, setScroll] = useState<any>({
    scrollX: -999,
    scrollY: -999,
    width: 8,
    overflow: true,
  });
  const [position, setPosition] = useState({ left: -999, top: -999 });
  const [cell, setCell] = useState<any>();

  const handleScroll = () => {
    if (spreadsheet) {
      const newScroll = spreadsheet.facet.getScrollOffset();
      const { frozenCol, frozenRow } = (spreadsheet.facet as any)
        .frozenGroupInfo;
      const rect = spreadsheet.getCanvasElement().getBoundingClientRect();
      const cellMate = cell?.getMeta();
      if (!isEqual(newScroll, scroll)) {
        // 超出可视区域隐藏point
        if (cellMate) {
          // 确定点位
          const pointX = cellMate.width + cellMate.x;
          const pointY = cellMate.height + cellMate.y;
          // 计算点位的偏移量
          const pointWidth = pointX - newScroll.scrollX - rect.width + 4;
          let overflow = true;
          if (
            frozenCol.width >= pointX - newScroll.scrollX - 2 ||
            frozenRow.height >= pointY - newScroll.scrollY - 2 ||
            rect.width <= pointX - newScroll.scrollX - 2 ||
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

  const fixPostiton = (event: CanvasEvent) => {
    const eventCell = event.target.cfg.parent;
    const isEventCellSelected =
      spreadsheet.interaction.isSelectedCell(eventCell);
    // 如果点击单元格时，单元格取消选中，隐藏拖拽点
    if (isEventCellSelected) {
      setCell(eventCell);
    } else {
      setCell(undefined);
    }
  };

  useEffect(() => {
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
  useEffect(() => {
    if (cell) {
      setCell(undefined);
    }
  }, [spreadsheet?.dataSet.sortParams, spreadsheet?.dataSet.filterParams]);

  useEffect(() => {
    if (!spreadsheet?.container.cfg.container) {
      return;
    }

    if (spreadsheet && cell) {
      const cellMeta = pick(cell.getMeta(), [
        'x',
        'y',
        'width',
        'height',
        'fieldValue',
      ]);
      cellMeta.x -= scroll?.scrollX;
      cellMeta.y -=
        scroll?.scrollY -
        (spreadsheet.getColumnNodes()[0] || { height: 0 }).height;
      setPosition({
        left: cellMeta.x + cellMeta.width - 4,
        top: cellMeta.y + cellMeta.height - 4,
      });
    }
  }, [scroll, cell]);

  /** 多选时隐藏拖拽点 */
  const batchSelected = () => {
    setCell(undefined);
  };

  useS2Event(S2Event.COL_CELL_CLICK, batchSelected, spreadsheet);
  useS2Event(S2Event.ROW_CELL_CLICK, batchSelected, spreadsheet);
  useS2Event(S2Event.CORNER_CELL_CLICK, batchSelected, spreadsheet);
  useS2Event(S2Event.DATA_CELL_BRUSH_SELECTION, batchSelected, spreadsheet);

  useS2Event(S2Event.DATA_CELL_CLICK, fixPostiton, spreadsheet);

  return (
    <div
      id="spreadsheet-drag-copy-point"
      className="drag-copy-point"
      style={{
        display: scroll.overflow ? 'none' : 'block',
        left: position.left,
        top: position.top,
        width: scroll.width,
      }}
    >
      <DragCopyMask onCopyFinished={batchSelected} />
      <div></div>
    </div>
  );
}

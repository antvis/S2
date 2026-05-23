/* eslint-disable max-classes-per-file */
import { CheckCircleOutlined, UndoOutlined } from '@ant-design/icons';
import type {
  S2CellType,
  S2DataConfig,
  SimplePalette,
  SpreadSheet,
  ViewMeta,
} from '@antv/s2';
import {
  CellClipBox,
  CellType,
  InteractionStateName,
  KEY_GROUP_COL_RESIZE_AREA,
  KEY_GROUP_ROW_RESIZE_AREA,
  S2Event,
  SERIES_NUMBER_FIELD,
  TableColCell,
  TableCornerCell,
  TableDataCell,
  TableSeriesNumberCell,
} from '@antv/s2';
import { Button, Card, Switch, Tag, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import type { SheetComponentOptions, SheetComponentProps } from '../src';
import { SheetComponent } from '../src';
import { reactRender } from '../src/utils/reactRender';
import './index.less';

const { Text, Title } = Typography;
const EXCEL_ACTIVE_COLOR = '#217346';
const EXCEL_HEADER_SELECTED_BACKGROUND = '#C0DAC9';
const EXCEL_HEADER_HOVER_BACKGROUND = '#A2C7AE';
const EXCEL_ROW_COL_SELECTED_BACKGROUND = '#c6c6c6';
const EXCEL_ROW_COL_SELECTION_BORDER_ID = 'excel-row-col-selection-border';
const EXCEL_CORNER_DIAGONAL_ID = 'excel-corner-diagonal';
const EXCEL_CORNER_UPPER_BACKGROUND_ID = 'excel-corner-upper-background';
const EXCEL_CORNER_LOWER_BACKGROUND_ID = 'excel-corner-lower-background';
const EXCEL_CORNER_UPPER_BACKGROUND = '#F8F8F8';
const EXCEL_CORNER_LOWER_BACKGROUND = '#DFDFDF';
const EXCEL_CORNER_LOWER_HOVER_BACKGROUND = '#9E9E9E';
const EXCEL_SERIES_NUMBER_MIN_WIDTH = 32;

function setExcelCellCursor(shape?: unknown) {
  (
    shape as
      | {
          setAttribute: (name: 'cursor', value: 'cell') => void;
        }
      | undefined
  )?.setAttribute('cursor', 'cell');
}

function setShapeFillOpacity(shape: unknown, fillOpacity: number) {
  (
    shape as
      | {
          setAttribute: (name: 'fillOpacity', value: number) => void;
        }
      | undefined
  )?.setAttribute('fillOpacity', fillOpacity);
}

class ExcelDataCell extends TableDataCell {
  protected drawBackgroundShape() {
    super.drawBackgroundShape();
    setExcelCellCursor(this.backgroundShape);
  }

  protected afterDrawText() {
    super.afterDrawText();
    setExcelCellCursor(this.textShape);
    this.textShapes?.forEach((shape) => {
      setExcelCellCursor(shape);
    });
  }

  private getRowColSelectionType() {
    const selectedCells = this.spreadsheet.interaction.getCells();

    if (
      selectedCells.length &&
      selectedCells.every((cell) => cell.type === CellType.ROW_CELL)
    ) {
      return CellType.ROW_CELL;
    }

    if (
      selectedCells.length &&
      selectedCells.every((cell) => cell.type === CellType.COL_CELL)
    ) {
      return CellType.COL_CELL;
    }
  }

  private isCellInRowColSelection(cell: S2CellType, selectionType: CellType) {
    const meta = cell.getMeta();
    const { cells = [], nodes = [] } = this.spreadsheet.interaction.getState();
    const selectedItems = [...nodes, ...cells];

    if (selectionType === CellType.ROW_CELL) {
      return selectedItems.some((item) => item.rowIndex === meta.rowIndex);
    }

    if (this.spreadsheet.isTableMode() && nodes.length) {
      const leafNodes = nodes[0]?.hierarchy?.getLeaves?.() ?? [];

      return leafNodes.some((node, index) => {
        return nodes.includes(node) && index === meta.colIndex;
      });
    }

    return selectedItems.some((item) => item.colIndex === meta.colIndex);
  }

  private getSelectedDataCells(selectionType: CellType) {
    return (
      this.spreadsheet.facet?.getCells().filter((cell) => {
        const meta = cell.getMeta();

        return (
          cell.cellType === CellType.DATA_CELL &&
          meta.valueField !== SERIES_NUMBER_FIELD &&
          this.isCellInRowColSelection(cell, selectionType)
        );
      }) ?? []
    );
  }

  private getBrushSelectedDataCells() {
    const selectedCells = this.spreadsheet.interaction.getCells([
      CellType.DATA_CELL,
    ]);
    const currentStateName = this.spreadsheet.interaction.getCurrentStateName();
    const isDataCellBrushSelectionState = [
      InteractionStateName.DATA_CELL_BRUSH_SELECTED,
      InteractionStateName.PREPARE_SELECT,
    ].includes(currentStateName as InteractionStateName);

    if (!isDataCellBrushSelectionState || !selectedCells.length) {
      return [];
    }

    const selectedCellIds = new Set(selectedCells.map((cell) => cell.id));

    return (
      this.spreadsheet.facet?.getCells().filter((cell) => {
        const meta = cell.getMeta();

        return (
          cell.cellType === CellType.DATA_CELL &&
          meta.valueField !== SERIES_NUMBER_FIELD &&
          selectedCellIds.has(meta.id)
        );
      }) ?? []
    );
  }

  private hideRowColSelectionBorder() {
    this.spreadsheet.facet?.foregroundGroup
      ?.getElementById(EXCEL_ROW_COL_SELECTION_BORDER_ID)
      ?.setAttribute('visibility', 'hidden');
  }

  private updateSelectedDataCellsStyle(selectedDataCells: S2CellType[]) {
    if (!selectedDataCells.length) {
      return false;
    }

    const selectedMetas = selectedDataCells.map((cell) => cell.getMeta());
    const { scrollX, scrollY } = this.spreadsheet.facet.getScrollOffset();
    const { x: panelX, y: panelY } = this.spreadsheet.facet.panelBBox;
    const minX = Math.min(...selectedMetas.map((meta) => meta.x));
    const minY = Math.min(...selectedMetas.map((meta) => meta.y));
    const maxX = Math.max(...selectedMetas.map((meta) => meta.x + meta.width));
    const maxY = Math.max(...selectedMetas.map((meta) => meta.y + meta.height));
    const borderWidth = 2;
    const halfBorderWidth = borderWidth / 2;
    const left = minX + panelX - scrollX + halfBorderWidth;
    const right = maxX + panelX - scrollX - halfBorderWidth;
    const top = minY + panelY - scrollY + halfBorderWidth;
    const bottom = maxY + panelY - scrollY - halfBorderWidth;
    const selectionBorderPath = `M ${left} ${top} L ${right} ${top} L ${right} ${bottom} L ${left} ${bottom} Z`;
    const interactiveBgShape = this.getStateShapes().get('interactiveBgShape');
    const interactiveBorderShape = this.getStateShapes().get(
      'interactiveBorderShape',
    );
    const foregroundGroup = this.spreadsheet.facet?.foregroundGroup;
    const existedSelectionBorder = foregroundGroup?.getElementById(
      EXCEL_ROW_COL_SELECTION_BORDER_ID,
    );

    interactiveBgShape?.setAttribute('visibility', 'visible');
    interactiveBgShape?.setAttribute('fill', EXCEL_ROW_COL_SELECTED_BACKGROUND);
    interactiveBgShape?.setAttribute('fillOpacity', 1);

    interactiveBorderShape?.setAttribute('visibility', 'visible');
    interactiveBorderShape?.setAttribute('d', 'M 0 0');
    interactiveBorderShape?.setAttribute('fill', 'transparent');
    interactiveBorderShape?.setAttribute('stroke', 'transparent');
    interactiveBorderShape?.setAttribute('strokeOpacity', 0);
    interactiveBorderShape?.setAttribute('lineWidth', borderWidth);
    interactiveBorderShape?.setAttribute('opacity', 1);

    if (existedSelectionBorder) {
      existedSelectionBorder.setAttribute('d', selectionBorderPath);
      existedSelectionBorder.setAttribute('visibility', 'visible');
    } else if (foregroundGroup && interactiveBorderShape) {
      const BorderShape = interactiveBorderShape.constructor as new (config: {
        id: string;
        style: Record<string, unknown>;
      }) => NonNullable<typeof interactiveBorderShape>;

      foregroundGroup.appendChild(
        new BorderShape({
          id: EXCEL_ROW_COL_SELECTION_BORDER_ID,
          style: {
            d: selectionBorderPath,
            fill: 'transparent',
            stroke: EXCEL_ACTIVE_COLOR,
            strokeOpacity: 1,
            lineWidth: borderWidth,
            pointerEvents: 'none',
            zIndex: 10,
          },
        }),
      );
    }

    return true;
  }

  private updateRowColSelectedStyle(selectionType: CellType) {
    return this.updateSelectedDataCellsStyle(
      this.getSelectedDataCells(selectionType),
    );
  }

  private updateBrushSelectedStyle() {
    return this.updateSelectedDataCellsStyle(this.getBrushSelectedDataCells());
  }

  public updateByState(
    stateName: Parameters<TableDataCell['updateByState']>[0],
  ) {
    const rowColSelectionType = this.getRowColSelectionType();

    if (stateName === 'selected' && rowColSelectionType) {
      this.hideInteractionShape();

      if (!this.updateRowColSelectedStyle(rowColSelectionType)) {
        super.updateByState(stateName);

        return;
      }

      this.spreadsheet.interaction.setInteractedCells(this);

      return;
    }

    if (
      (stateName === InteractionStateName.SELECTED &&
        this.spreadsheet.interaction.getCurrentStateName() ===
          InteractionStateName.DATA_CELL_BRUSH_SELECTED) ||
      stateName === InteractionStateName.PREPARE_SELECT
    ) {
      this.hideInteractionShape();

      if (!this.updateBrushSelectedStyle()) {
        super.updateByState(stateName);

        return;
      }

      this.spreadsheet.interaction.setInteractedCells(this);

      return;
    }

    if (stateName === 'selected') {
      this.hideRowColSelectionBorder();
    }

    super.updateByState(stateName);
  }

  public hideInteractionShape() {
    super.hideInteractionShape();
    this.hideRowColSelectionBorder();
  }

  public drawResizeArea() {}
}

class ExcelSeriesNumberCell extends TableSeriesNumberCell {
  protected drawBackgroundShape() {
    super.drawBackgroundShape();
    setExcelCellCursor(this.backgroundShape);
  }

  protected afterDrawText() {
    super.afterDrawText();
    setExcelCellCursor(this.textShape);
    this.textShapes?.forEach((shape) => {
      setExcelCellCursor(shape);
    });
  }

  private isDirectSeriesNumberSelection() {
    return this.spreadsheet.interaction.getCells().some((cell) => {
      return (
        cell.type === CellType.ROW_CELL &&
        cell.rowIndex === this.meta.rowIndex &&
        cell.colIndex === this.meta.colIndex
      );
    });
  }

  private getFirstDataColIndex() {
    const dataColIndexes =
      this.spreadsheet.facet
        ?.getCells()
        .filter((cell) => {
          const meta = cell.getMeta();

          return (
            cell.cellType === CellType.DATA_CELL &&
            meta.valueField !== SERIES_NUMBER_FIELD
          );
        })
        .map((cell) => cell.getMeta().colIndex) ?? [];

    if (!dataColIndexes.length) {
      return 0;
    }

    return Math.min(...dataColIndexes);
  }

  private isFirstColDataCellSelection() {
    const firstDataColIndex = this.getFirstDataColIndex();

    return this.spreadsheet.interaction.getCells().some((cell) => {
      return (
        cell.type === CellType.DATA_CELL && cell.colIndex === firstDataColIndex
      );
    });
  }

  private updateSeriesNumberSelectedStyle() {
    const interactiveBgShape = this.getStateShapes().get('interactiveBgShape');
    const interactiveBorderShape = this.getStateShapes().get(
      'interactiveBorderShape',
    );
    const { x, y, width, height } = this.getBBoxByType(CellClipBox.PADDING_BOX);
    const borderWidth = 2;
    const borderX = x + width - borderWidth / 2;
    const isDirectSelection = this.isDirectSeriesNumberSelection();
    const shouldDrawRightBorder =
      !isDirectSelection && !this.isFirstColDataCellSelection();

    interactiveBgShape?.setAttribute('visibility', 'visible');
    interactiveBgShape?.setAttribute(
      'fill',
      isDirectSelection ? EXCEL_HEADER_SELECTED_BACKGROUND : 'transparent',
    );
    interactiveBgShape?.setAttribute('fillOpacity', isDirectSelection ? 1 : 0);

    interactiveBorderShape?.setAttribute('visibility', 'visible');
    interactiveBorderShape?.setAttribute(
      'd',
      shouldDrawRightBorder
        ? [
            ['M', borderX, y],
            ['L', borderX, y + height],
          ]
        : 'M 0 0',
    );
    interactiveBorderShape?.setAttribute('fill', 'transparent');
    interactiveBorderShape?.setAttribute(
      'stroke',
      shouldDrawRightBorder ? EXCEL_ACTIVE_COLOR : 'transparent',
    );
    interactiveBorderShape?.setAttribute(
      'strokeOpacity',
      shouldDrawRightBorder ? 1 : 0,
    );
    interactiveBorderShape?.setAttribute('lineWidth', borderWidth);
    interactiveBorderShape?.setAttribute('opacity', 1);
  }

  private updateSeriesNumberHoverStyle() {
    const interactiveBgShape = this.getStateShapes().get('interactiveBgShape');

    interactiveBgShape?.setAttribute('visibility', 'visible');
    interactiveBgShape?.setAttribute('fill', EXCEL_HEADER_HOVER_BACKGROUND);
    interactiveBgShape?.setAttribute('fillOpacity', 1);
  }

  public updateByState(
    stateName: Parameters<TableSeriesNumberCell['updateByState']>[0],
  ) {
    if (stateName === 'hover') {
      this.hideInteractionShape();
      this.updateSeriesNumberHoverStyle();
      this.spreadsheet.interaction.setInteractedCells(this);

      return;
    }

    if (stateName !== 'selected') {
      super.updateByState(stateName);

      return;
    }

    this.hideInteractionShape();
    this.updateSeriesNumberSelectedStyle();
    this.spreadsheet.interaction.setInteractedCells(this);
  }

  public drawResizeArea() {
    super.drawResizeArea();

    const resizeArea = this.spreadsheet.facet?.foregroundGroup?.getElementById(
      KEY_GROUP_ROW_RESIZE_AREA,
    );
    const children = resizeArea?.children ?? [];
    const resizeShape = children[children.length - 1];

    if (!resizeShape) {
      return;
    }

    const { x, width } = this.getBBoxByType();

    (
      resizeShape as unknown as {
        attr: (style: { x: number; width: number }) => void;
      }
    ).attr({ x, width });
  }
}

class ExcelCornerCell extends TableCornerCell {
  private getPathShapeConstructor() {
    const interactiveBorderShape = this.getStateShapes().get(
      'interactiveBorderShape',
    );

    if (!interactiveBorderShape) {
      return;
    }

    return interactiveBorderShape.constructor as new (config: {
      id: string;
      style: Record<string, unknown>;
    }) => NonNullable<typeof interactiveBorderShape>;
  }

  private drawCornerBackground() {
    const PathShape = this.getPathShapeConstructor();

    if (!PathShape) {
      return;
    }

    const { x, y, width, height } = this.getBBoxByType();
    const upperPath = `M ${x} ${y} L ${x + width} ${y} L ${x} ${y + height} Z`;
    const lowerPath = `M ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
    const upperBackground = this.getElementById(
      EXCEL_CORNER_UPPER_BACKGROUND_ID,
    );
    const lowerBackground = this.getElementById(
      EXCEL_CORNER_LOWER_BACKGROUND_ID,
    );

    if (upperBackground) {
      upperBackground.setAttribute('d', upperPath);
      upperBackground.setAttribute('fill', EXCEL_CORNER_UPPER_BACKGROUND);
    } else {
      this.appendChild(
        new PathShape({
          id: EXCEL_CORNER_UPPER_BACKGROUND_ID,
          style: {
            d: upperPath,
            fill: EXCEL_CORNER_UPPER_BACKGROUND,
            fillOpacity: 1,
            stroke: 'transparent',
            pointerEvents: 'none',
          },
        }),
      );
    }

    if (lowerBackground) {
      lowerBackground.setAttribute('d', lowerPath);
      lowerBackground.setAttribute('fill', EXCEL_CORNER_LOWER_BACKGROUND);
    } else {
      this.appendChild(
        new PathShape({
          id: EXCEL_CORNER_LOWER_BACKGROUND_ID,
          style: {
            d: lowerPath,
            fill: EXCEL_CORNER_LOWER_BACKGROUND,
            fillOpacity: 1,
            stroke: 'transparent',
            pointerEvents: 'none',
          },
        }),
      );
    }
  }

  private setLowerBackground(fill: string) {
    this.getElementById(EXCEL_CORNER_LOWER_BACKGROUND_ID)?.setAttribute(
      'fill',
      fill,
    );
  }

  private drawDiagonalLine() {
    const PathShape = this.getPathShapeConstructor();

    if (!PathShape) {
      return;
    }

    const { x, y, width, height } = this.getBBoxByType();
    const diagonalPath = `M ${x + width} ${y} L ${x} ${y + height}`;
    const existedDiagonalLine = this.getElementById(EXCEL_CORNER_DIAGONAL_ID);

    if (existedDiagonalLine) {
      existedDiagonalLine.setAttribute('d', diagonalPath);

      return;
    }

    this.appendChild(
      new PathShape({
        id: EXCEL_CORNER_DIAGONAL_ID,
        style: {
          d: diagonalPath,
          fill: 'transparent',
          stroke: '#b4b4b4',
          strokeOpacity: 1,
          lineWidth: 1,
          pointerEvents: 'none',
        },
      }),
    );
  }

  protected drawBackgroundShape() {
    super.drawBackgroundShape();
    setShapeFillOpacity(this.backgroundShape, 0);
    setExcelCellCursor(this.backgroundShape);
  }

  protected afterDrawText() {
    super.afterDrawText();
    setExcelCellCursor(this.textShape);
    this.textShapes?.forEach((shape) => {
      setExcelCellCursor(shape);
    });
    this.drawCornerBackground();
    this.drawDiagonalLine();
  }

  public updateByState(
    stateName: Parameters<TableCornerCell['updateByState']>[0],
  ) {
    const selectedCells = this.spreadsheet.interaction.getCells();
    const isSeriesNumberSelection = selectedCells.every((cell) => {
      return cell.type === CellType.ROW_CELL;
    });

    if (stateName === 'hover') {
      this.hideInteractionShape();
      this.setLowerBackground(EXCEL_CORNER_LOWER_HOVER_BACKGROUND);
      this.spreadsheet.interaction.setInteractedCells(this);

      return;
    }

    this.setLowerBackground(EXCEL_CORNER_LOWER_BACKGROUND);

    if (stateName === 'selected' && isSeriesNumberSelection) {
      this.hideInteractionShape();

      return;
    }

    super.updateByState(stateName);
  }

  public hideInteractionShape() {
    super.hideInteractionShape();
    this.setLowerBackground(EXCEL_CORNER_LOWER_BACKGROUND);
  }
}

class ExcelColCell extends TableColCell {
  protected drawBackgroundShape() {
    super.drawBackgroundShape();
    setExcelCellCursor(this.backgroundShape);
  }

  protected afterDrawText() {
    super.afterDrawText();
    setExcelCellCursor(this.textShape);
    this.textShapes?.forEach((shape) => {
      setExcelCellCursor(shape);
    });
  }

  private isDataCellSelection() {
    const selectedCells = this.spreadsheet.interaction.getCells();

    return (
      selectedCells.length > 0 &&
      selectedCells.every((cell) => cell.type === CellType.DATA_CELL)
    );
  }

  private isFirstRowDataCellSelection() {
    return this.spreadsheet.interaction.getCells().some((cell) => {
      return cell.type === CellType.DATA_CELL && cell.rowIndex === 0;
    });
  }

  private updateColHeaderSelectedByDataCellStyle() {
    const interactiveBgShape = this.getStateShapes().get('interactiveBgShape');
    const interactiveBorderShape = this.getStateShapes().get(
      'interactiveBorderShape',
    );
    const { x, y, width, height } = this.getBBoxByType(CellClipBox.PADDING_BOX);
    const borderWidth = 2;
    const borderY = y + height - borderWidth / 2;
    const shouldDrawBottomBorder =
      this.meta.isLeaf && !this.isFirstRowDataCellSelection();

    interactiveBgShape?.setAttribute('visibility', 'visible');
    interactiveBgShape?.setAttribute('fill', 'transparent');
    interactiveBgShape?.setAttribute('fillOpacity', 0);

    interactiveBorderShape?.setAttribute('visibility', 'visible');
    interactiveBorderShape?.setAttribute(
      'd',
      shouldDrawBottomBorder
        ? [
            ['M', x, borderY],
            ['L', x + width, borderY],
          ]
        : 'M 0 0',
    );
    interactiveBorderShape?.setAttribute('fill', 'transparent');
    interactiveBorderShape?.setAttribute(
      'stroke',
      shouldDrawBottomBorder ? EXCEL_ACTIVE_COLOR : 'transparent',
    );
    interactiveBorderShape?.setAttribute(
      'strokeOpacity',
      shouldDrawBottomBorder ? 1 : 0,
    );
    interactiveBorderShape?.setAttribute('lineWidth', borderWidth);
    interactiveBorderShape?.setAttribute('opacity', 1);
  }

  public updateByState(
    stateName: Parameters<TableColCell['updateByState']>[0],
  ) {
    if (stateName === 'selected' && this.isDataCellSelection()) {
      this.hideInteractionShape();
      this.updateColHeaderSelectedByDataCellStyle();
      this.spreadsheet.interaction.setInteractedCells(this);

      return;
    }

    super.updateByState(stateName);
  }

  protected drawVerticalResizeArea() {
    if (this.meta.isLeaf || !this.meta.extra?.isCustomNode) {
      super.drawVerticalResizeArea();

      return;
    }

    const [leafNode] = this.meta.children ?? [];

    if (!leafNode) {
      return;
    }

    const originalIsLeaf = this.meta.isLeaf;

    this.meta.isLeaf = true;
    super.drawVerticalResizeArea();
    this.meta.isLeaf = originalIsLeaf;

    const resizeArea = this.spreadsheet.facet?.foregroundGroup?.getElementById(
      KEY_GROUP_COL_RESIZE_AREA,
    );
    const resizeShape = (resizeArea?.children ?? []).find((shape) => {
      return (
        (shape as unknown as { appendInfo?: { cell?: ExcelColCell } })
          .appendInfo?.cell === this
      );
    });

    if (!resizeShape) {
      return;
    }

    const appendInfo = (
      resizeShape as unknown as {
        appendInfo?: { meta?: Record<string, unknown> };
      }
    ).appendInfo;

    if (appendInfo) {
      appendInfo.meta = {
        ...this.meta,
        field: leafNode.field,
      };
    }
  }
}

// 2. 转换函数：0 -> A, 1 -> B, 25 -> Z, 26 -> AA
function getExcelColumnLabel(index: number): string {
  let label = '';
  let temp = index;

  while (temp >= 0) {
    label = String.fromCharCode((temp % 26) + 65) + label;
    temp = Math.floor(temp / 26) - 1;
  }

  return label;
}

function getExcelSeriesNumberWidth(rowCount: number) {
  const digitCount = String(Math.max(rowCount, 1)).length;

  return Math.max(EXCEL_SERIES_NUMBER_MIN_WIDTH, digitCount * 8 + 20);
}

// 原始测试数据
const RAW_DATA = [
  {
    col0: 'Apples',
    col1: 50,
    col2: 1.2,
    col3: 'Fruit',
    col4: '2026-05-01',
    col5: 60,
    col6: 'In Stock',
    col7: 'Aisle 1',
  },
  {
    col0: 'Bananas',
    col1: 120,
    col2: 0.8,
    col3: 'Fruit',
    col4: '2026-05-02',
    col5: 96,
    col6: 'In Stock',
    col7: 'Aisle 1',
  },
  {
    col0: 'Carrots',
    col1: 80,
    col2: 1.5,
    col3: 'Vegetable',
    col4: '2026-05-03',
    col5: 120,
    col6: 'Low Stock',
    col7: 'Aisle 2',
  },
  {
    col0: 'Dates',
    col1: 15,
    col2: 5.0,
    col3: 'Fruit',
    col4: '2026-05-04',
    col5: 75,
    col6: 'Out of Stock',
    col7: 'Aisle 3',
  },
  {
    col0: 'Eggplant',
    col1: 40,
    col2: 2.0,
    col3: 'Vegetable',
    col4: '2026-05-05',
    col5: 80,
    col6: 'In Stock',
    col7: 'Aisle 2',
  },
  {
    col0: 'Figs',
    col1: 30,
    col2: 4.5,
    col3: 'Fruit',
    col4: '2026-05-06',
    col5: 135,
    col6: 'In Stock',
    col7: 'Aisle 3',
  },
  {
    col0: 'Grapes',
    col1: 150,
    col2: 2.5,
    col3: 'Fruit',
    col4: '2026-05-07',
    col5: 375,
    col6: 'In Stock',
    col7: 'Aisle 1',
  },
  {
    col0: 'Honey',
    col1: 25,
    col2: 8.5,
    col3: 'Sweetener',
    col4: '2026-05-08',
    col5: 212.5,
    col6: 'In Stock',
    col7: 'Aisle 4',
  },
];

interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
}

function MainLayout() {
  const s2Ref = useRef<SpreadSheet | null>(null);
  const sheetContainerRef = useRef<HTMLDivElement>(null);

  // 基础开关配置
  const [useExcelTheme, setUseExcelTheme] = useState(true);
  const [useExcelHeaders, setUseExcelHeaders] = useState(true);
  const [disableCrosshair, setDisableCrosshair] = useState(true);

  // 表格数据 & 条件高亮状态
  const [data, setData] = useState(RAW_DATA);
  const [highlightedCol, setHighlightedCol] = useState<string | null>(null);

  // Chat Excel 模拟器状态
  const [, setChatQuery] = useState('');
  const [, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      text: '你好！我是 Chat Excel 助手。你可以让我对表格进行【筛选】、【高亮】或【排序】，例如：\n1. "筛选出 Fruit 商品"\n2. "高亮总额大于 100 的格子"\n3. "按数量降序排序"',
    },
  ]);

  // 处理 Chat 命令
  const handleCommand = (queryText: string) => {
    if (!queryText.trim()) {
      return;
    }

    // 1. 添加用户消息
    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatQuery('');

    // 2. 模拟 AI 逻辑处理并更新表格
    setTimeout(() => {
      let replyText = '抱歉，我不明白这个指令。试着点击下方的快捷提示词吧！';
      const cleanQuery = queryText.toLowerCase();

      if (cleanQuery.includes('fruit') || cleanQuery.includes('水果')) {
        setData(RAW_DATA.filter((item) => item.col3 === 'Fruit'));
        replyText = '✨ 已为您筛选出分类 (Category) 为 "Fruit" 的所有数据！';
      } else if (
        cleanQuery.includes('大于100') ||
        cleanQuery.includes('> 100') ||
        cleanQuery.includes('highlight') ||
        cleanQuery.includes('高亮')
      ) {
        // col5 是总额 (Total)
        setHighlightedCol('col5');
        replyText = '✨ 已为您高亮标记总额 (Total) 大于 100 的单元格！';
      } else if (
        cleanQuery.includes('排序') ||
        cleanQuery.includes('sort') ||
        cleanQuery.includes('降序')
      ) {
        const sorted = [...RAW_DATA].sort((a, b) => b.col1 - a.col1);

        setData(sorted);
        replyText = '✨ 已按数量 (Quantity) 列进行降序排列！';
      } else if (
        cleanQuery.includes('重置') ||
        cleanQuery.includes('reset') ||
        cleanQuery.includes('恢复')
      ) {
        setData(RAW_DATA);
        setHighlightedCol(null);
        replyText = '✨ 表格数据与高亮状态已恢复初始设置！';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: replyText,
        },
      ]);
    }, 600);
  };

  // 生成 S2 的 dataCfg
  const dataCfg = useMemo<S2DataConfig>(() => {
    const fieldsList = Array.from({ length: 8 }, (_, i) => `col${i}`);

    // 原始业务标题映射
    const defaultMeta = [
      { field: 'col0', name: 'Product Name' },
      { field: 'col1', name: 'Quantity' },
      { field: 'col2', name: 'Unit Price ($)' },
      { field: 'col3', name: 'Category' },
      { field: 'col4', name: 'Date' },
      { field: 'col5', name: 'Total ($)' },
      { field: 'col6', name: 'Status' },
      { field: 'col7', name: 'Location' },
    ];

    // If useExcelHeaders is true, columns is a hierarchical custom tree node list
    const columns = useExcelHeaders
      ? defaultMeta.map((m, idx) => ({
          field: `${m.field}_parent`,
          title: getExcelColumnLabel(idx),
          children: [
            {
              field: m.field,
              title: m.name,
            },
          ],
        }))
      : fieldsList;

    // 条件高亮配置 (模拟 Chat Excel 指令)
    const conditions = highlightedCol
      ? {
          background: [
            {
              field: highlightedCol,
              mapping: (value: number) => {
                if (value > 100) {
                  return {
                    // Excel 浅绿色
                    fill: '#E2EFDA',
                  };
                }

                return {};
              },
            },
          ],
        }
      : undefined;

    return {
      fields: {
        columns,
      },
      meta: defaultMeta,
      data,
      conditions,
    };
  }, [data, useExcelHeaders, highlightedCol]);

  const themeCfg = useMemo(() => {
    return {
      name: (useExcelTheme ? 'excel' : 'default') as 'excel' | 'default',
      getCustomTheme: (palette: SimplePalette) => {
        if (!useExcelTheme) {
          return {};
        }

        return {
          rowCell: {
            seriesNumberWidth: getExcelSeriesNumberWidth(data.length),
            cell: {
              // Excel header gray (#E6E6E6)
              backgroundColor: palette.basicColors[3],
              // Gray header border (#B4B4B4)
              horizontalBorderColor: palette.basicColors[10],
              verticalBorderColor: palette.basicColors[10],
              interactionState: {
                hover: {
                  backgroundColor: EXCEL_HEADER_HOVER_BACKGROUND,
                  backgroundOpacity: 1,
                },
                selected: {
                  backgroundColor: EXCEL_HEADER_SELECTED_BACKGROUND,
                  backgroundOpacity: 1,
                },
              },
            },
            seriesText: {
              fill: '#000000',
            },
            text: {
              fill: '#000000',
            },
          },
          colCell: {
            cell: {
              interactionState: {
                hover: {
                  backgroundColor: EXCEL_HEADER_HOVER_BACKGROUND,
                  backgroundOpacity: 1,
                },
                selected: {
                  backgroundColor: EXCEL_HEADER_SELECTED_BACKGROUND,
                  backgroundOpacity: 1,
                },
              },
            },
          },
          dataCell: {
            cell: {
              interactionState: {
                selected: {
                  // Light gray background selection mask
                  backgroundColor: palette.basicColors[2],
                  backgroundOpacity: 0.2,
                  // Excel green border
                  borderColor: (palette as any).brandColor,
                  borderWidth: 2,
                  borderOpacity: 1,
                },
                hoverFocus: {
                  backgroundColor: palette.basicColors[2],
                  backgroundOpacity: 0.2,
                  borderColor: (palette as any).brandColor,
                  borderWidth: 2,
                  borderOpacity: 1,
                },
              },
            },
          },
        };
      },
    };
  }, [data.length, useExcelTheme]);

  // 生成 S2 的 options
  const options = useMemo<SheetComponentOptions>(() => {
    const interactionConfig = disableCrosshair
      ? {
          // 仅高亮行头/列头，去掉十字形选中高亮
          hoverHighlight: {
            rowHeader: false,
            colHeader: false,
            currentRow: false,
            currentCol: false,
          },
          selectedCellHighlight: {
            rowHeader: true,
            colHeader: true,
            currentRow: false,
            currentCol: false,
          },
        }
      : {
          // 默认十字高亮效果
          hoverHighlight: true,
          selectedCellHighlight: true,
        };

    return {
      width: 780,
      height: 400,
      tooltip: {
        enable: false,
      },
      dataCell: useExcelTheme
        ? (viewMeta: ViewMeta, spreadsheet: SpreadSheet) => {
            if (viewMeta.valueField === SERIES_NUMBER_FIELD) {
              return new ExcelSeriesNumberCell(viewMeta, spreadsheet);
            }

            return new ExcelDataCell(viewMeta, spreadsheet);
          }
        : undefined,
      colCell: useExcelTheme
        ? (...args) => {
            return new ExcelColCell(...args);
          }
        : undefined,
      seriesNumberCell: useExcelTheme
        ? (...args) => {
            return new ExcelCornerCell(...args) as never;
          }
        : undefined,
      // 禁用默认的序号行为以防冲突
      showSeriesNumber: false,
      seriesNumber: {
        // 开启数字序号列
        enable: useExcelHeaders,
        // 序号列顶部角头显示为空
        text: '',
      },
      placeholder: {
        cell: (cell) => {
          const meta = cell?.['getMeta']?.();

          if (meta?.field === '$$series_number$$') {
            return ' ';
          }

          return '-';
        },
      },
      interaction: {
        ...interactionConfig,
        // 不启用选中变暗效果，保持 excel 式的聚焦
        selectedCellsSpotlight: false,
        resize: useExcelTheme
          ? {
              // Excel 模式只允许通过列头调整列宽。
              // 行高热区由自定义 dataCell 控制：只让 123 序号格绘制。
              rowCellVertical: true,
              // 不开放普通角头行头宽度调整；序号列宽度由列头上的序号节点承担。
              cornerCellHorizontal: false,
              // 列头叶子节点可调列宽，包含 seriesNumber 开启后的左侧序号列节点。
              colCellHorizontal: true,
              // 不允许调整列头高度。
              colCellVertical: false,
              rowResizeType: 'current',
              colResizeType: 'current',
            }
          : true,
      },
    };
  }, [useExcelHeaders, disableCrosshair, useExcelTheme]);

  const updateSelectedSeriesNumberCell: SheetComponentProps['onDataCellSelected'] =
    (cells) => {
      const selectedDataCell = cells.find((cell) => {
        return cell.getMeta().valueField !== SERIES_NUMBER_FIELD;
      });

      if (!selectedDataCell) {
        return;
      }

      const selectedRowIndex = selectedDataCell.getMeta().rowIndex;
      const seriesNumberCells = (
        s2Ref.current?.facet as unknown as {
          getSeriesNumberCells?: () => ExcelSeriesNumberCell[];
        }
      )?.getSeriesNumberCells?.();
      const seriesNumberCell = seriesNumberCells?.find((cell) => {
        return cell.getMeta().rowIndex === selectedRowIndex;
      });

      seriesNumberCell?.updateByState('selected');
    };

  return (
    <div
      className="playground"
      style={{
        padding: '24px',
        background: '#f5f7f6',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 头部样式插入 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .excel-chat-bubble {
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          max-width: 85%;
          word-break: break-all;
        }
        .excel-chat-user {
          background-color: #217346;
          color: white;
          align-self: flex-end;
          margin-left: auto;
        }
        .excel-chat-assistant {
          background-color: #e9ecef;
          color: #333;
          align-self: flex-start;
          white-space: pre-line;
        }
        .antv-s2-wrapper {
          border: 1px solid #d4d4d4 !important;
          border-radius: 4px;
          overflow: hidden;
        }
      `,
        }}
      />

      {/* 顶栏 */}
      <Card
        style={{
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                margin: 0,
                color: '#217346',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '28px' }}>📊</span> AntV S2 Excel
              高级仿真 Playground
            </Title>
            <Text type="secondary">
              在此预览配色微调、ABC/123 标题和去除十字高亮的效果，并测试 Chat
              Excel 智能操控。
            </Text>
          </div>
          <Tag color="success" icon={<CheckCircleOutlined />}>
            S2 v2 Engine Running
          </Tag>
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
        }}
      >
        {/* 左侧控制与模拟器栏 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 交互开关控制 */}
          <Card
            title="🎛️ 仿真效果开关"
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>Excel 配色调色板</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    使用 Excel 主题网格和主色
                  </Text>
                </div>
                <Switch checked={useExcelTheme} onChange={setUseExcelTheme} />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>ABC / 123 报表头</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    顶部字母，左侧数字行号
                  </Text>
                </div>
                <Switch
                  checked={useExcelHeaders}
                  onChange={setUseExcelHeaders}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>禁止十字高亮</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    仅高亮选中的单元格
                  </Text>
                </div>
                <Switch
                  checked={disableCrosshair}
                  onChange={setDisableCrosshair}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧 S2 展示栏 */}
        <Card
          title="⚡ Excel 仿真表格预览"
          extra={
            <Button
              size="small"
              icon={<UndoOutlined />}
              onClick={() => handleCommand('重置')}
            >
              重置数据
            </Button>
          }
          style={{
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '4px',
              border: '1px dashed #e8e8e8',
            }}
          >
            <div
              ref={sheetContainerRef}
              style={{
                width: '100%',
                height: 'calc(100vh - 220px)',
                minHeight: 400,
              }}
            >
              <SheetComponent
                sheetType="table"
                dataCfg={dataCfg}
                options={options}
                themeCfg={themeCfg}
                adaptive={{
                  width: true,
                  height: true,
                  getContainer: () => sheetContainerRef.current!,
                }}
                onMounted={(instance) => {
                  (window as any).s2 = instance;
                  instance.on(S2Event.COL_CELL_CLICK, (event) => {
                    const cell = instance.getCell(event.target);

                    if (cell instanceof ExcelCornerCell) {
                      instance.interaction.selectAll();
                    }
                  });
                }}
                onDataCellSelected={updateSelectedSeriesNumberCell}
                ref={s2Ref}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

reactRender(<MainLayout />, document.getElementById('root')!);

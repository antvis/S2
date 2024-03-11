/* eslint-disable max-lines-per-function */
import fs from 'fs';
import path from 'path';
import { dsvFormat } from 'd3-dsv';
import EE from '@antv/event-emitter';
import {
  Canvas,
  FederatedMouseEvent,
  FederatedPointerEvent,
  type CanvasConfig,
  Group,
} from '@antv/g';
import { omit } from 'lodash';
import * as simpleDataConfig from 'tests/data/simple-data.json';
import * as dataConfig from 'tests/data/mock-dataset.json';
import { Renderer } from '@antv/g-canvas';
import {
  getTheme,
  type BaseDataSet,
  type Node,
  Hierarchy,
  EventController,
} from '../../src';

import { assembleOptions, assembleDataCfg } from '.';
import { RootInteraction } from '@/interaction/root';
import { Store } from '@/common/store';
import type {
  InternalFullyTheme,
  LayoutResult,
  S2CellType,
  S2DataConfig,
  S2Options,
  ViewMeta,
} from '@/common/interface';
import { PivotSheet, SpreadSheet, TableSheet } from '@/sheet-type';
import type { BaseTooltip } from '@/ui/tooltip';
import { customMerge } from '@/utils/merge';
import { DEFAULT_OPTIONS, FrozenGroupType } from '@/common/constant';
import type { BaseFacet } from '@/facet';
import type { PanelBBox } from '@/facet/bbox/panel-bbox';

export const parseCSV = (csv: string, header?: string[]) => {
  const DELIMITER = ',';

  // add header
  const content = header ? `${header.join(DELIMITER)}\n${csv}` : csv;

  return dsvFormat(DELIMITER).parse(content);
};

export const getMockData = (dataPath: string) => {
  const data = fs.readFileSync(path.resolve(__dirname, dataPath), 'utf8');

  return parseCSV(data);
};

export const getContainer = () => {
  const rootContainer = document.createElement('div');

  rootContainer.setAttribute('style', 'margin-left: 32px');
  document.body.appendChild(rootContainer);

  return rootContainer;
};

export const sleep = async (timeout = 0) => {
  await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const createFakeSpreadSheet = (config?: {
  s2Options?: Partial<S2Options>;
  s2DataConfig?: Partial<S2DataConfig>;
}) => {
  const { s2Options = {}, s2DataConfig = {} } = config || {};
  const container = getContainer();

  class FakeSpreadSheet extends EE {
    public options: S2Options;

    public setOptions(options: Partial<S2Options>) {
      this.options = customMerge(this.options, options);
    }
  }

  const s2 = new FakeSpreadSheet() as unknown as SpreadSheet;

  s2.options = assembleOptions(
    {
      ...DEFAULT_OPTIONS,
      hd: false,
    },
    s2Options,
  );

  s2.dataCfg = assembleDataCfg({ sortParams: [] }, s2DataConfig);
  s2.container = new Canvas({
    width: DEFAULT_OPTIONS.width!,
    height: DEFAULT_OPTIONS.height!,
    container,
    renderer: new Renderer() as unknown as CanvasConfig['renderer'],
  });
  s2.dataSet = {
    ...s2.dataCfg,
    getCellMultiData() {
      return [];
    },
    getField: jest.fn(),
    displayFormattedValueMap: new Map(),
  } as unknown as any;

  const layoutResult: LayoutResult = {
    rowLeafNodes: [],
    colLeafNodes: [],
    rowNodes: [],
    colNodes: [],
    colsHierarchy: new Hierarchy(),
    rowsHierarchy: new Hierarchy(),
  };

  s2.facet = {
    panelBBox: {
      maxX: s2.options.width,
      maxY: s2.options.height,
    } as PanelBBox,
    panelGroup: s2.container.appendChild(new Group()),
    foregroundGroup: s2.container.appendChild(new Group()),
    backgroundGroup: s2.container.appendChild(new Group()),
    layoutResult,
    getLayoutResult: () => layoutResult,
    getCellMeta: jest.fn(),
    getCellById: jest.fn(),
    getCellChildrenNodes: () => [],
    getCells: () => [],
    getColCells: () => [],
    getRowCells: () => [],
    getDataCells: () => [],
    getRowNodesByField: () => [],
    getRowNodes: () => [],
    getRowLeafNodes: () => [],
    getColNodes: () => [],
    getColLeafNodes: () => [],
    getInitColLeafNodes: () => [],
    getHeaderCells: () => [],
    getHiddenColumnsInfo: jest.fn(),
    getCellAdaptiveHeight: jest.fn(),
    getRowLeafNodeByIndex: jest.fn(),
    getColLeafNodeByIndex: jest.fn(),
    frozenGroupInfo: {
      [FrozenGroupType.FROZEN_ROW]: {},
      [FrozenGroupType.FROZEN_COL]: {},
      [FrozenGroupType.FROZEN_TRAILING_ROW]: {},
      [FrozenGroupType.FROZEN_TRAILING_COL]: {},
    },
    cornerBBox: {},
    destroy: jest.fn(),
  } as unknown as BaseFacet;
  s2.container.render = jest.fn();
  s2.store = new Store();
  s2.tooltip = {
    container: {} as HTMLElement,
  } as BaseTooltip;
  s2.dataSet = {
    getFieldDescription: jest.fn(),
    getCustomFieldDescription: jest.fn(),
    getCellMultiData: jest.fn(() => []),
  } as unknown as BaseDataSet;

  s2.getCellType = jest.fn();
  s2.render = jest.fn();
  s2.hideTooltip = jest.fn();
  s2.showTooltip = jest.fn();
  s2.showTooltipWithInfo = jest.fn();
  s2.isTableMode = jest.fn();
  s2.isPivotMode = jest.fn();
  s2.getCell = jest.fn();
  s2.isHierarchyTreeType = jest.fn();
  s2.facet.getRowNodes = jest.fn().mockReturnValue([]);
  s2.facet.getCells = jest.fn().mockReturnValue([]);
  s2.getCanvasElement = () =>
    s2.container.getContextService().getDomElement() as HTMLCanvasElement;
  s2.getCanvasConfig = () => s2.container.getConfig();
  s2.isCustomHeaderFields = jest.fn(() => false);
  s2.isCustomRowFields = jest.fn(() => false);
  s2.isCustomColumnFields = jest.fn(() => false);
  s2.isValueInCols = jest.fn();
  s2.isCustomHeaderFields = jest.fn();
  s2.isCustomColumnFields = jest.fn();
  s2.isCustomRowFields = jest.fn();
  s2.getTotalsConfig = jest.fn();
  s2.getLayoutWidthType = jest.fn();
  s2.enableFrozenHeaders = jest.fn();
  s2.measureTextWidth = jest.fn();
  s2.isFrozenRowHeader = jest.fn();
  s2.theme = getTheme({
    name: 'default',
    spreadsheet: s2,
  }) as InternalFullyTheme;

  const interaction = new RootInteraction(s2 as unknown as SpreadSheet);

  s2.interaction = interaction;
  s2.interaction.eventController = new EventController(s2);

  return s2;
};

export const createMockCellInfo = (
  cellId: string,
  {
    colIndex = 0,
    rowIndex = 0,
    colId = '0',
    level = 0,
    cornerType = '',
    cellType = undefined,
  }: Partial<ViewMeta> = {},
) => {
  const mockCellViewMeta: Partial<ViewMeta> = {
    id: cellId,
    field: cellId,
    colIndex,
    rowIndex,
    colId,
    level,
    type: undefined,
    cornerType,
    x: 0,
    y: 0,
    spreadsheet: {
      dataCfg: {
        meta: null,
        data: [],
        fields: {},
      },
      dataSet: {
        getFieldDescription: jest.fn(),
        getCustomRowFieldDescription: jest.fn(),
      },
      facet: {
        layoutResult: {
          getCellMeta: jest.fn(),
        },
      } as unknown as BaseFacet,
    } as unknown as SpreadSheet,
  };
  const mockCellMeta = omit(mockCellViewMeta, [
    'x',
    'y',
    'update',
    'spreadsheet',
    'level',
    'field',
    'colId',
    'field',
    'cornerType',
  ]);
  const mockCell = {
    ...mockCellViewMeta,
    cellType,
    getMeta: () => mockCellViewMeta,
    update: jest.fn(),
    getActualText: jest.fn(),
    getFieldValue: jest.fn(),
    hideInteractionShape: jest.fn(),
    updateByState: jest.fn(),
    isTextOverflowing: jest.fn(),
  } as unknown as S2CellType;

  const getNode = () => mockCellViewMeta as unknown as Node;

  return {
    mockCell,
    mockCellMeta,
    mockCellViewMeta,
    getNode,
  };
};

export const createPivotSheet = (
  s2Options: S2Options,
  {
    useSimpleData,
    useTotalData,
  }: { useSimpleData: boolean; useTotalData?: boolean } = {
    useSimpleData: true,
    useTotalData: true,
  },
) =>
  new PivotSheet(
    getContainer(),
    useSimpleData
      ? simpleDataConfig
      : {
          ...dataConfig,
          data: useTotalData
            ? dataConfig.data.concat(dataConfig.totalData as any)
            : dataConfig.data,
        },
    {
      ...s2Options,
      debug: false,
    },
  );

export const createFederatedPointerEvent = (
  spreadsheet: SpreadSheet,
  eventType: string,
) => {
  const evt = new FederatedPointerEvent(
    spreadsheet.container.getEventService(),
  );

  evt.type = eventType;
  evt.pointerType = 'mouse';

  return evt;
};

export const createFederatedMouseEvent = (
  spreadsheet: SpreadSheet,
  eventType: string,
) => {
  const evt = new FederatedMouseEvent(spreadsheet.container.getEventService());

  evt.type = eventType;

  return evt;
};

export const createTableSheet = (
  s2Options: S2Options | null,
  { useSimpleData } = { useSimpleData: true },
) =>
  new TableSheet(
    getContainer(),
    useSimpleData ? simpleDataConfig : dataConfig,
    {
      hd: false,
      ...s2Options,
    },
  );

/**
 * 获取基于 canvas 坐标系的真实 clientX/Y 坐标
 * @param canvas g canvas 实例
 * @param x 相对于 canvas 左上角的 x 坐标
 * @param y 相对于 canvas 左上角的 y 坐标
 * @returns 全局 clientX/Y 坐标
 */
export const getClientPointOnCanvas = (
  canvas: Canvas,
  x: number,
  y: number,
) => {
  const point = canvas.viewport2Client({
    x,
    y,
  });

  return {
    clientX: point.x,
    clientY: point.y,
  };
};

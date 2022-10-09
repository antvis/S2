import fs from 'fs';
import path from 'path';
import { dsvFormat } from 'd3-dsv';
import EE from '@antv/event-emitter';
import { Canvas } from '@antv/g-canvas';
import { omit } from 'lodash';
import * as simpleDataConfig from 'tests/data/simple-data.json';
import * as dataConfig from 'tests/data/mock-dataset.json';
import type { BaseDataSet } from '../../src';
import { RootInteraction } from '@/interaction/root';
import { Store } from '@/common/store';
import type { S2CellType, S2Options, ViewMeta } from '@/common/interface';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { BaseTooltip } from '@/ui/tooltip';
import { customMerge } from '@/utils/merge';
import { DEFAULT_OPTIONS } from '@/common/constant';
import type { PanelBBox } from '@/facet/bbox/panelBBox';
import type { BaseFacet } from '@/facet';

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
  await new Promise((resolve) => setTimeout(resolve, timeout));
};

export const createFakeSpreadSheet = () => {
  const container = getContainer();

  class FakeSpreadSheet extends EE {
    public options: S2Options;

    public setOptions(options: Partial<S2Options>) {
      this.options = customMerge(this.options, options);
    }
  }

  const s2 = new FakeSpreadSheet() as unknown as SpreadSheet;
  s2.options = DEFAULT_OPTIONS;
  s2.dataCfg = {
    meta: null,
    data: [],
    fields: {},
  };
  s2.container = new Canvas({
    width: DEFAULT_OPTIONS.width,
    height: DEFAULT_OPTIONS.height,
    container,
  });
  s2.facet = {
    panelBBox: {
      maxX: s2.options.width,
      maxY: s2.options.height,
    },
  } as BaseFacet;
  s2.container.draw = jest.fn();
  s2.store = new Store();
  s2.tooltip = {
    container: {} as HTMLElement,
  } as BaseTooltip;
  s2.dataSet = {
    getFieldDescription: jest.fn(),
    getCustomRowFieldDescription: jest.fn(),
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
  s2.getCanvasElement = () => s2.container.get('el');
  s2.isCustomFields = jest.fn(() => false);

  const interaction = new RootInteraction(s2 as unknown as SpreadSheet);
  s2.interaction = interaction;
  return s2;
};

// 可借助 tiny gradient 完成功能更全面的颜色过渡
export function getGradient(
  rate: number,
  startColor: string,
  endColor: string,
) {
  function toGgb(color: string) {
    color = color.slice(1);
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return [r, g, b];
  }

  const start = toGgb(startColor);
  const end = toGgb(endColor);
  const r = start[0] + (end[0] - start[0]) * rate;
  const g = start[1] + (end[1] - start[1]) * rate;
  const b = start[2] + (end[2] - start[2]) * rate;

  return `rgb(${r},${g},${b})`;
}

export const createMockCellInfo = (
  cellId: string,
  { colIndex = 0, rowIndex = 0 } = {},
) => {
  const mockCellViewMeta: Partial<ViewMeta> = {
    id: cellId,
    colIndex,
    rowIndex,
    type: undefined,
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
    } as unknown as SpreadSheet,
  };
  const mockCellMeta = omit(mockCellViewMeta, [
    'x',
    'y',
    'update',
    'spreadsheet',
  ]);
  const mockCell = {
    ...mockCellViewMeta,
    getMeta: () => mockCellViewMeta,
    update: jest.fn(),
    getActualText: jest.fn(),
    getFieldValue: jest.fn(),
    hideInteractionShape: jest.fn(),
    updateByState: jest.fn(),
  } as unknown as S2CellType;

  return {
    mockCell,
    mockCellMeta,
  };
};

export const createPivotSheet = (
  s2Options: S2Options,
  { useSimpleData } = { useSimpleData: true },
) => {
  return new PivotSheet(
    getContainer(),
    useSimpleData ? simpleDataConfig : dataConfig,
    s2Options,
  );
};

/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { dsvFormat } from 'd3-dsv';
import EE from '@antv/event-emitter';
import type { Canvas } from '@antv/g';
import {
  Store,
  type S2Options,
  SpreadSheet,
  PivotSheet,
  BaseTooltip,
  customMerge,
  DEFAULT_OPTIONS,
  RootInteraction,
  type ViewMeta,
} from '@antv/s2';
import { omit } from 'lodash';

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

export const createFakeSpreadSheet = () => {
  class FakeSpreadSheet extends EE {
    public options: S2Options;

    public setOptions(options: S2Options) {
      this.options = customMerge(this.options, options);
    }
  }

  const s2 = new FakeSpreadSheet() as unknown as SpreadSheet;

  s2.options = DEFAULT_OPTIONS;
  const interaction = new RootInteraction(s2 as unknown as SpreadSheet);

  s2.store = new Store();
  s2.interaction = interaction;
  s2.tooltip = {
    container: {} as HTMLElement,
  } as BaseTooltip;
  s2.container = {
    draw: jest.fn(),
  } as unknown as Canvas;
  s2.getCellType = jest.fn();
  s2.render = jest.fn();
  s2.hideTooltip = jest.fn();
  s2.showTooltipWithInfo = jest.fn();
  s2.isTableMode = jest.fn();

  return s2;
};
// 可借助 tinygradient 完成功能更全面的颜色过渡
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

export function getMockSheetInstance(Sheet: typeof SpreadSheet = PivotSheet) {
  const instance = Object.create(Sheet.prototype);

  return instance as unknown as SpreadSheet;
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
    update: jest.fn(),
    spreadsheet: {
      options: {
        style: {},
      },
      facet: {
        getRowNodes: jest.fn(),
        getColNodes: jest.fn(),
      },
      dataCfg: {
        meta: null,
        data: [],
        fields: {},
      },
      dataSet: {
        getFieldDescription: jest.fn(),
        getCustomFieldDescription: jest.fn(),
        getCustomRowFieldName: jest.fn(),
        getFieldName: jest.fn(),
      },
    } as unknown as SpreadSheet,
  };
  const mockCellMeta = omit(mockCellViewMeta, 'update');
  const mockCell = {
    ...mockCellViewMeta,
    getMeta: () => mockCellViewMeta,
    getFieldValue: jest.fn(),
    hideInteractionShape: jest.fn(),
    getActualText: jest.fn(),
  } as any;

  return {
    mockCell,
    mockCellMeta,
  };
};

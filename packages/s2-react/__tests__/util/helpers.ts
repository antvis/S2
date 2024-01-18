/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { PivotSheet, SpreadSheet, type ViewMeta } from '@antv/s2';
import { dsvFormat } from 'd3-dsv';
import { omit } from 'lodash';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

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

export function getMockSheetInstance(Sheet: typeof SpreadSheet = PivotSheet) {
  const instance = Object.create(Sheet.prototype);

  return instance as unknown as SpreadSheet;
}

export const createMockCellInfo = (
  cellId: string,
  { colIndex = 0, rowIndex = 0, extra = {} } = {},
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
        getColLeafNodeByIndex: jest.fn(),
        getRowLeafNodeByIndex: jest.fn(),
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
    extra,
  };
  const mockCellMeta = omit(mockCellViewMeta, 'update');
  const mockCell = {
    ...mockCellViewMeta,
    getMeta: () => mockCellViewMeta,
    getFieldValue: jest.fn(),
    hideInteractionShape: jest.fn(),
    getActualText: jest.fn(),
    update: jest.fn(),
    updateByState: jest.fn(),
    isTextOverflowing: jest.fn(),
  } as any;

  return {
    mockCell,
    mockCellMeta,
  };
};

export const renderComponent = (
  Component: React.JSX.Element,
  mountContainer?: HTMLDivElement,
) => {
  let root: Root;
  const container = mountContainer || getContainer();

  act(() => {
    root = createRoot(container);
    root.render(Component);
  });

  return () => {
    act(() => {
      root.unmount();
      container?.remove();
    });
  };
};

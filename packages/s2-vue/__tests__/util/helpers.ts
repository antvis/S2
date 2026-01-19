import { PivotSheet, SpreadSheet, type ViewMeta } from '@antv/s2';
import { omit } from 'lodash';

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

export function getMockSheetInstance(Sheet: typeof SpreadSheet = PivotSheet) {
  const instance = Object.create(Sheet.prototype);

  return instance as unknown as SpreadSheet;
}

import { FederatedPointerEvent } from '@antv/g';
import { omit } from 'lodash';
import type { SpreadSheet } from '../../../../src';
import { OriginEventType } from '../../../../src/common';
import { getBaseCellData } from '../../../../src/utils/interaction/formatter';
import {
  createFakeSpreadSheet,
  createFederatedPointerEvent,
  createMockCellInfo,
} from '../../../util/helpers';

describe('#getBaseCellData()', () => {
  let event: FederatedPointerEvent;
  let s2: SpreadSheet;

  const getData = (e: FederatedPointerEvent) =>
    omit(getBaseCellData(e), ['event']);

  beforeEach(() => {
    s2 = createFakeSpreadSheet();

    event = createFederatedPointerEvent(s2, OriginEventType.POINTER_UP);
  });

  test('should get empty cell data', () => {
    expect(getData(event)).toMatchSnapshot();
  });

  test('should get correctly cell data', () => {
    const cell = createMockCellInfo('test-a').mockCell;

    cell.parentNode = cell;
    event.target = cell;

    expect(getData(event)).toMatchSnapshot();
  });

  test('should get correctly cell data by append info', () => {
    const cellData = 'test';
    const cell = createMockCellInfo('test-a').mockCell;

    // @ts-ignore
    cell.appendInfo = { cellData };
    event.target = cell;

    expect(getData(event).viewMeta).toEqual(cellData);
  });
});

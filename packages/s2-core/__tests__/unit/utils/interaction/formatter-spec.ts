import { Event } from '@antv/g-canvas';
import { omit } from 'lodash';
import { getBaseCellData } from '../../../../src/utils/interaction/formatter';
import { createMockCellInfo } from '../../../util/helpers';

describe('#getBaseCellData()', () => {
  let event: Event;

  const getData = (e: Event) => omit(getBaseCellData(e), ['event']);

  beforeEach(() => {
    event = {
      target: {},
    } as Event;
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
    const { mockCell: cell, mockCellMeta } = createMockCellInfo('test-a');

    cell.appendInfo = { mockCellMeta };
    event.target = cell;
    cell.get = () => cell;

    expect(getData(event).viewMeta).toEqual(cell.getMeta());
  });
});

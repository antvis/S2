import { createFakeSpreadSheet } from 'tests/util/helpers';
import { RowTextClick } from '@/interaction/base-interaction/click';
import type { RawData, S2DataConfig, S2Options } from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/base-interaction/click/row-column-click');
jest.mock('@/interaction/range-selection');

describe('Interaction Row Text Click Tests', () => {
  let rowTextClick: RowTextClick;
  let s2: SpreadSheet;

  const data: RawData[] = [
    {
      'key-0': 'value1',
      'key-1': 'value2',
      'key-2': 'value3',
    },
    {
      'key-0': 'value4',
      'key-1': 'value5',
      'key-2': 'value6',
    },
  ];

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    rowTextClick = new RowTextClick(s2 as unknown as SpreadSheet);
    s2.options = {
      hierarchyType: 'grid',
    } as S2Options;
    s2.isHierarchyTreeType = () => false;
    s2.dataCfg = {
      data,
    } as S2DataConfig;
  });

  test('should bind events', () => {
    expect(rowTextClick.bindEvents).toBeDefined();
  });
});

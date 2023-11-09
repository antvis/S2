import { getContainer } from 'tests/util/helpers';
import { s2Options, dataCfg } from '../data/total-group-data';
import { PivotSheet } from '@/sheet-type';
import type { S2Options } from '@/common';

describe('Total Group Dimension Test', () => {
  let container: HTMLDivElement;

  let s2: PivotSheet;
  beforeEach(() => {
    container = getContainer();
    s2 = new PivotSheet(container, dataCfg, s2Options as S2Options);
    s2.render();
  });

  test('should get correct result', () => {
    // TODO: 补充单测
    expect(true).toBeTrue();
  });
});

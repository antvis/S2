import { getContainer } from 'tests/util/helpers';
import { assembleOptions, assembleDataCfg } from '../util';
import { PivotSheet } from '@/sheet-type';

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({}),
      assembleOptions({}),
    );

    s2.render();

    expect(1).toBe(1);
  });
});

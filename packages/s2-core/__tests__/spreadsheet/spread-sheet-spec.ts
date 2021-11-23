import { assembleOptions, assembleDataCfg } from '../util';
import { PivotSheet } from '@/index';

const container = document.createElement('div');
document.body.appendChild(container);

const s2 = new PivotSheet(container, assembleDataCfg({}), assembleOptions({}));

s2.render();

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });
});

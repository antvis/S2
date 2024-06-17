import { getContainer } from 'tests/util/helpers';
import { SpreadSheet } from '../../src';
import { type S2Options } from '../../src/common/interface';
import { PivotChart } from '../../src/extends';
import dataCfg from '../data/mock-dataset.json';

describe('SpreadSheet Collapse/Expand Tests', () => {
  let container: HTMLElement;
  let s2: SpreadSheet;

  const s2Options: S2Options = {
    width: 1000,
    height: 800,
    style: {},
  };

  beforeEach(async () => {
    container = getContainer();
    s2 = new PivotChart(
      container,
      {
        ...dataCfg,
        fields: {
          rows: ['province', 'city'],
          columns: ['type', 'sub_type'],
          values: ['number'],
          valueInCols: true,
        },
      },
      s2Options,
    );
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should render pivot chart', () => {
    window.s2 = s2;
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * 明细表数据含有空值导致排序失效
 * @description spec for issue 2707
 * https://github.com/antvis/S2/issues/2707
 */

import type { S2Options, SpreadSheet } from '@/index';
import { EMPTY_PLACEHOLDER } from '../../src';
import * as mockDataConfig from '../data/data-issue-2707.json';
import { createTableSheet } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 480,
};

describe('PivotSheet Special Dimension Values Copy Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = createTableSheet(s2Options);
    s2.setDataCfg(mockDataConfig);
    await s2.render();
  });

  test('should sort correctly data by DESC sort method', async () => {
    s2.setDataCfg({
      sortParams: [{ sortFieldId: 'key7', sortMethod: 'DESC' }],
    });
    await s2.render();

    // @ts-ignore
    expect(s2.dataSet.displayData).toMatchSnapshot();
  });

  test('should sort correctly data by ASC sort method', async () => {
    s2.setDataCfg({
      sortParams: [{ sortFieldId: 'key7', sortMethod: 'ASC' }],
    });
    await s2.render();

    // @ts-ignore
    expect(s2.dataSet.displayData).toMatchSnapshot();
  });

  test('should sort correctly data by DESC sort method and custom sortBy', async () => {
    s2.setDataCfg({
      sortParams: [
        {
          sortFieldId: 'key7',
          sortMethod: 'ASC',
          sortBy: (record) => {
            if (record.key7 === EMPTY_PLACEHOLDER) {
              return Number.MAX_VALUE;
            }

            return record.key7;
          },
        },
      ],
    });
    await s2.render();

    // @ts-ignore
    expect(s2.dataSet.displayData).toMatchSnapshot();
  });
});

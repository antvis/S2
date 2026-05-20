/**
 * @description spec for issue #3335
 * https://github.com/antvis/S2/issues/3335
 */
import type { S2DataConfig, S2Options, SpreadSheet } from '@/index';
import { createTableSheet } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 480,
};

const dataCfg: S2DataConfig = {
  fields: {
    columns: ['city'],
  },
  data: [
    { city: '长春' },
    { city: '舟山' },
    { city: '北京' },
    { city: '上海' },
  ],
};

describe('issue #3335', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = createTableSheet(s2Options);
    s2.setDataCfg(dataCfg);
    await s2.render();
  });

  test('should sort chinese strings by zh locale in asc order', async () => {
    s2.setDataCfg({
      ...dataCfg,
      sortParams: [{ sortFieldId: 'city', sortMethod: 'ASC' }],
    });
    await s2.render();

    expect(
      s2.dataSet.getCellMultiData({
        query: {
          field: 'city',
        },
      }),
    ).toEqual(['北京', '上海', '长春', '舟山']);
  });

  test('should sort chinese strings by zh locale in desc order', async () => {
    s2.setDataCfg({
      ...dataCfg,
      sortParams: [{ sortFieldId: 'city', sortMethod: 'DESC' }],
    });
    await s2.render();

    expect(
      s2.dataSet.getCellMultiData({
        query: {
          field: 'city',
        },
      }),
    ).toEqual(['舟山', '长春', '上海', '北京']);
  });
});

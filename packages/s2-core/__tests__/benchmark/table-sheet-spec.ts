/* eslint-disable no-console */
import { S2DataConfig, TableSheet, type S2Options } from '../../src';
import { generateRawData, getContainer } from '../util/helpers';

async function measureTableSheetRender(
  title: string,
  s2DataCfg: S2DataConfig,
  s2Options?: S2Options,
) {
  performance.mark('startTask');
  const s2 = new TableSheet(getContainer(), s2DataCfg, s2Options || null);

  await s2.render();
  performance.mark('endTask');

  const measure = performance.measure('render', 'startTask', 'endTask');

  console.log(title, measure.duration);
}

describe('table sheet benchmark', () => {
  const baseDataCfg: S2DataConfig = {
    fields: {
      columns: ['province', 'city', 'type', 'subType', 'number'],
    },
    data: [],
  };

  test('should render 1000 items', async () => {
    const s2DataCfg: S2DataConfig = {
      ...baseDataCfg,
      data: generateRawData(
        [
          ['province', 10],
          ['city', 1],
          ['type', 10],
          ['subType', 10],
        ],
        ['number'],
      ),
    };

    await measureTableSheetRender('🚀 1000 items', s2DataCfg);
  });

  test('should render 10000 items', async () => {
    const s2DataCfg: S2DataConfig = {
      ...baseDataCfg,
      data: generateRawData(
        [
          ['province', 10],
          ['city', 10],
          ['type', 10],
          ['subType', 10],
        ],
        ['number'],
      ),
    };

    await measureTableSheetRender('🚀 10000 items', s2DataCfg);
  });

  test('should render 10_0000 items', async () => {
    const s2DataCfg: S2DataConfig = {
      ...baseDataCfg,
      data: generateRawData(
        [
          ['province', 100],
          ['city', 10],
          ['type', 10],
          ['subType', 10],
        ],
        ['number'],
      ),
    };

    await measureTableSheetRender('🚀 10_0000 items', s2DataCfg);
  });

  test('should render 100_0000 items', async () => {
    const s2DataCfg: S2DataConfig = {
      ...baseDataCfg,
      data: generateRawData(
        [
          ['province', 100],
          ['city', 10],
          ['type', 100],
          ['subType', 10],
        ],
        ['number'],
      ),
    };

    await measureTableSheetRender('🚀 100_0000 items', s2DataCfg);
  });

  describe('multi line text', () => {
    const s2Options: S2Options = {
      style: {
        colCell: {
          maxLines: 3,
        },
        dataCell: {
          maxLines: 3,
        },
      },
    };

    test('should render 10_0000 items', async () => {
      const s2DataCfg: S2DataConfig = {
        ...baseDataCfg,
        data: generateRawData(
          [
            ['province', 100],
            ['city', 10],
            ['type', 10],
            ['subType', 10],
          ],
          ['number'],
        ),
      };

      await measureTableSheetRender('🚀 10_0000 items', s2DataCfg, s2Options);
    });

    test('should render 100_0000 items', async () => {
      const s2DataCfg: S2DataConfig = {
        ...baseDataCfg,
        data: generateRawData(
          [
            ['province', 100],
            ['city', 10],
            ['type', 100],
            ['subType', 10],
          ],
          ['number'],
        ),
      };

      await measureTableSheetRender('🚀 100_0000 items', s2DataCfg, s2Options);
    });
  });
});

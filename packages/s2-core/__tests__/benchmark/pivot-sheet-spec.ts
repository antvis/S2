/* eslint-disable no-console */
import { PivotSheet, S2DataConfig, type S2Options } from '../../src';
import { generateRawData, getContainer } from '../util/helpers';

async function measurePivotSheetRender(
  title: string,
  s2DataCfg: S2DataConfig,
  s2Options?: S2Options,
) {
  performance.mark('startTask');
  const s2 = new PivotSheet(getContainer(), s2DataCfg, s2Options || null);

  await s2.render();
  performance.mark('endTask');

  const measure = performance.measure('render', 'startTask', 'endTask');

  console.log(title, measure.duration);
}

describe('pivot sheet benchmark', () => {
  describe('single values', () => {
    const baseDataCfg: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'subType'],
        values: ['number'],
      },
      data: [],
    };

    test('should render 10 * 100', async () => {
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

      await measurePivotSheetRender(
        '🚀 10 * 100 for single measure',
        s2DataCfg,
      );
    });

    test('should render 100 * 100', async () => {
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

      await measurePivotSheetRender(
        '🚀 100 * 100 for single measure',
        s2DataCfg,
      );
    });

    test('should render 1000 * 100', async () => {
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

      await measurePivotSheetRender(
        '🚀 1000 * 100 for single measure',
        s2DataCfg,
      );
    });

    test('should render 1000 * 1000', async () => {
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

      await measurePivotSheetRender(
        '🚀 1000 * 1000 for single measure',
        s2DataCfg,
      );
    });
  });

  describe('multi values', () => {
    const baseDataCfg: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'subType'],
        values: ['number'],
      },
      data: [],
    };

    test('should render 10 * 100', async () => {
      const s2DataCfg: S2DataConfig = {
        ...baseDataCfg,
        data: generateRawData(
          [
            ['province', 10],
            ['city', 1],
            ['type', 10],
            ['subType', 10],
          ],
          ['number1', 'number2', 'number3', 'number4', 'number5'],
        ),
      };

      await measurePivotSheetRender('🚀 10 * 100 for multi measure', s2DataCfg);
    });

    test('should render 100 * 100', async () => {
      const s2DataCfg: S2DataConfig = {
        ...baseDataCfg,
        data: generateRawData(
          [
            ['province', 10],
            ['city', 10],
            ['type', 10],
            ['subType', 10],
          ],
          ['number1', 'number2', 'number3', 'number4', 'number5'],
        ),
      };

      await measurePivotSheetRender(
        '🚀 100 * 100 for multi measure',
        s2DataCfg,
      );
    });

    test('should render 1000 * 100', async () => {
      const s2DataCfg: S2DataConfig = {
        ...baseDataCfg,
        data: generateRawData(
          [
            ['province', 100],
            ['city', 10],
            ['type', 10],
            ['subType', 10],
          ],
          ['number1', 'number2', 'number3', 'number4', 'number5'],
        ),
      };

      await measurePivotSheetRender(
        '🚀 1000 * 100 for multi measure',
        s2DataCfg,
      );
    });

    test('should render 1000 * 1000', async () => {
      const s2DataCfg: S2DataConfig = {
        ...baseDataCfg,
        data: generateRawData(
          [
            ['province', 100],
            ['city', 10],
            ['type', 100],
            ['subType', 10],
          ],
          ['number1', 'number2', 'number3', 'number4', 'number5'],
        ),
      };

      await measurePivotSheetRender(
        '🚀 1000 * 1000 for multi measure',
        s2DataCfg,
      );
    });
  });

  describe('multi line text', () => {
    const baseDataCfg: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'subType'],
        values: ['number'],
      },
      data: [],
    };

    const s2Options: S2Options = {
      style: {
        cornerCell: {
          maxLines: 3,
        },
        rowCell: {
          maxLines: 3,
        },
        colCell: {
          maxLines: 3,
        },
        dataCell: {
          maxLines: 3,
        },
      },
    };

    test('should render 100 * 100', async () => {
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

      await measurePivotSheetRender(
        '🚀 100 * 100 for single measure',
        s2DataCfg,
        s2Options,
      );
    });

    test('should render 1000 * 1000', async () => {
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

      await measurePivotSheetRender(
        '🚀 1000 * 1000 for single measure',
        s2DataCfg,
        s2Options,
      );
    });
  });
});

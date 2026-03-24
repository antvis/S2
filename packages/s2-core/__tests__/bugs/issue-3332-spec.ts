/**
 * @description spec for issue #3332
 * https://github.com/antvis/S2/issues/3332
 * 明细表导出不支持序号的格式化
 */
import { TableSheet } from '@/sheet-type';
import { asyncGetAllPlainData } from '@/utils';
import { slice } from 'lodash';
import { data as originData } from 'tests/data/mock-dataset.json';
import { LINE_SEPARATOR, SERIES_NUMBER_FIELD, TAB_SEPARATOR } from '../../src';
import { assembleDataCfg, assembleOptions } from '../util';
import { getContainer } from '../util/helpers';

describe('TableSheet Export Series Number Formatter Tests', () => {
  const formatter = (value: number | string) =>
    String.fromCharCode(96 + Number(value));

  const createSheetWithSeriesNumberFormatter = async () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: SERIES_NUMBER_FIELD,
            name: '序号',
            formatter,
          },
        ],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
        data: slice(originData, 0, 5),
      }),
      assembleOptions({
        seriesNumber: {
          enable: true,
        },
      }),
    );

    await s2.render();

    return s2;
  };

  // https://github.com/antvis/S2/issues/3332
  test('should apply series number formatter when exporting with formatOptions: true', async () => {
    const s2 = await createSheetWithSeriesNumberFormatter();

    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: true,
    });

    const rows = data.split(LINE_SEPARATOR);

    // 序号列应为格式化后的字母 a, b, c, d, e
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(TAB_SEPARATOR);

      expect(cols[0]).toBe(formatter(i));
    }
  });

  test('should apply series number formatter when exporting async', async () => {
    const s2 = await createSheetWithSeriesNumberFormatter();

    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: true,
      async: true,
    });

    const rows = data.split(LINE_SEPARATOR);

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(TAB_SEPARATOR);

      expect(cols[0]).toBe(formatter(i));
    }
  });

  test('should not apply series number formatter when formatOptions is false', async () => {
    const s2 = await createSheetWithSeriesNumberFormatter();

    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: false,
    });

    const rows = data.split(LINE_SEPARATOR);

    // formatOptions: false 时，序号列应为原始数字
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(TAB_SEPARATOR);

      expect(cols[0]).toBe(String(i));
    }
  });
});

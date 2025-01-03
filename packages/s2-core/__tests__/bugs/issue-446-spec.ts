/**
 * @description spec for issue #446
 * https://github.com/antvis/S2/issues/446
 * #asyncGetAllPlainData error in table mode
 *
 */
import { TableSheet } from '@/sheet-type';
import { asyncGetAllPlainData } from '@/utils';
import { TAB_SEPARATOR, type S2Options } from '../../src';
import * as mockDataConfig from '../data/data-issue-446.json';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  seriesNumber: {
    enable: true,
  },
};

describe('export', () => {
  test('should export correct data with show seriesNumber', async () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
      formatOptions: true,
    });

    expect(data.split('\n').length).toEqual(3);
    expect(data.split('\n')[0].split('\t').length).toEqual(4);
    expect(data.split('\n')[0].split('\t')[0]).toEqual('序号');
    expect(data).toMatchSnapshot();
  });

  test('should export correct data without show seriesNumber', async () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      seriesNumber: {
        enable: false,
      },
    });

    await s2.render();
    const data = await asyncGetAllPlainData({
      sheetInstance: s2,
      split: TAB_SEPARATOR,
    });

    expect(data.split('\n').length).toEqual(3);
    expect(data.split('\n')[0].split('\t').length).toEqual(3);
    expect(data.split('\n')[0].split('\t')[0]).toEqual('col0');
    expect(data).toMatchSnapshot();
  });
});

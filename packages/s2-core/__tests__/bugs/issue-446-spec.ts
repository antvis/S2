/**
 * @description spec for issue #446
 * https://github.com/antvis/S2/issues/446
 * copyData error in table mode
 *
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-446.json';
import { TableSheet } from '@/sheet-type';
import { copyData } from '@/utils';

const s2Options = {
  width: 800,
  height: 600,
  showSeriesNumber: true,
};

describe('export', () => {
  test('should export correct data with showSeriesNumber', () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, s2Options);
    s2.render();
    const data = copyData(s2, '\t');

    expect(data.split('\n').length).toEqual(3);
    expect(data.split('\n')[0].split('\t').length).toEqual(4);
    expect(data.split('\n')[0].split('\t')[0]).toEqual('"序号"');
    expect(data.length).toEqual(89);
  });

  test('should export correct data without showSeriesNumber', () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      showSeriesNumber: false,
    });
    s2.render();
    const data = copyData(s2, '\t');

    expect(data.split('\n').length).toEqual(3);
    expect(data.split('\n')[0].split('\t').length).toEqual(3);
    expect(data.split('\n')[0].split('\t')[0]).toEqual('"col0"');
    expect(data.length).toEqual(76);
  });
});

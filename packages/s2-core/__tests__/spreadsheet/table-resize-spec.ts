import type { IGroup } from '@antv/g-canvas';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-table-data.json';
import { TableSheet } from '@/sheet-type';
import { KEY_GROUP_ROW_RESIZE_AREA } from '@/common/constant';

describe('Table Sheet Resize Test', () => {
  test('should draw resize area in series cell when show series', () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      width: 800,
      height: 600,
      showSeriesNumber: true,
    });
    s2.render();

    const resizeGroup = s2.facet.foregroundGroup.findById(
      KEY_GROUP_ROW_RESIZE_AREA,
    ) as IGroup;

    expect(resizeGroup.getChildren().length).toBeGreaterThan(0);
  });

  test('should draw resize area in data cell when hide series', () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      width: 800,
      height: 600,
      showSeriesNumber: false,
    });
    s2.render();

    const resizeGroup = s2.facet.foregroundGroup.findById(
      KEY_GROUP_ROW_RESIZE_AREA,
    ) as IGroup;

    expect(resizeGroup.getChildren().length).toBeGreaterThan(0);
  });
});

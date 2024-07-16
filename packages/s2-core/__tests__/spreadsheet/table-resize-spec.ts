import { KEY_GROUP_ROW_RESIZE_AREA } from '@/common/constant';
import { TableSheet } from '@/sheet-type';
import type { Group } from '@antv/g';
import * as mockDataConfig from '../data/simple-table-data.json';
import { getContainer } from '../util/helpers';

describe('Table Sheet Resize Test', () => {
  test('should draw resize area in series cell when show series', async () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      width: 800,
      height: 600,
      seriesNumber: {
        enable: true,
      },
    });

    await s2.render();

    const resizeGroup = s2.facet.foregroundGroup.getElementById(
      KEY_GROUP_ROW_RESIZE_AREA,
    ) as Group;

    expect(resizeGroup.children.length).toBeGreaterThan(0);
  });

  test('should draw resize area in data cell when hide series', async () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      width: 800,
      height: 600,
      seriesNumber: {
        enable: false,
      },
    });

    await s2.render();

    const resizeGroup = s2.facet.foregroundGroup.getElementById(
      KEY_GROUP_ROW_RESIZE_AREA,
    ) as Group;

    expect(resizeGroup.children.length).toBeGreaterThan(0);
  });
});

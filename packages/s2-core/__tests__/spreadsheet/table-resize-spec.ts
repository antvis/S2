import type { Group } from '@antv/g';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-table-data.json';
import { TableSheet } from '@/sheet-type';
import { KEY_GROUP_ROW_RESIZE_AREA } from '@/common/constant';

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

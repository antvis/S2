import type { IGroup } from '@antv/g-canvas';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-table-data.json';
import * as mock2588DataConfig from '../data/data-issue-2588.json';
import { TableSheet } from '@/sheet-type';
import {
  KEY_GROUP_ROW_RESIZE_AREA,
  KEY_GROUP_COL_RESIZE_AREA,
} from '@/common/constant';

describe('Table Sheet Resize Test', () => {
  test('should draw resize area in series cell when show series', () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      width: 800,
      height: 600,
      showSeriesNumber: true,
    });
    s2.render();

    const resizeGroup = s2.foregroundGroup.findById(
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

    const resizeGroup = s2.foregroundGroup.findById(
      KEY_GROUP_ROW_RESIZE_AREA,
    ) as IGroup;

    expect(resizeGroup.getChildren().length).toBeGreaterThan(0);
  });

  test('is the size area located correctly in col cell When freezing the first column', () => {
    const s2 = new TableSheet(getContainer(), mock2588DataConfig, {
      width: 400,
      height: 600,
      frozenColCount: 1,
    });
    s2.render();

    const offsetX = 20;

    s2.updateScrollOffset({
      offsetX: {
        value: offsetX,
        animate: false,
      },
    });

    const resizeGroup = s2.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZE_AREA,
    ) as IGroup;

    const children = resizeGroup.getChildren().filter((rect) => {
      return rect.get('attrs').cursor === 'col-resize';
    });

    children.forEach((rect) => {
      const attrs = rect.get('attrs');
      const meta = attrs.appendInfo.meta;
      expect(meta.x + meta.width).toEqual(attrs.width / 2 + attrs.x + offsetX);
    });

    s2.destroy();
  });

  test('is the size area located correctly in col cell When freezing the last column', () => {
    const s2 = new TableSheet(getContainer(), mock2588DataConfig, {
      width: 400,
      height: 600,
      frozenTrailingColCount: 1,
    });
    s2.render();

    const offsetX = 20;

    s2.updateScrollOffset({
      offsetX: {
        value: offsetX,
        animate: false,
      },
    });

    const resizeGroup = s2.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZE_AREA,
    ) as IGroup;

    const children = resizeGroup.getChildren().filter((rect) => {
      return rect.get('attrs').cursor === 'col-resize';
    });

    children.forEach((rect) => {
      const attrs = rect.get('attrs');
      const meta = attrs.appendInfo.meta;
      expect(meta.x + meta.width).toEqual(attrs.width / 2 + attrs.x + offsetX);
    });

    s2.destroy();
  });
});

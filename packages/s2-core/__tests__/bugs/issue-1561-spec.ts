/**
 * @description spec for issue #1561
 * https://github.com/antvis/S2/issues/1561
 * 内容未填充整个画布且存在滚动条（横向或者纵向）情况下，拖动滚动条会导致边框绘制到内容区之外
 *
 */
import { getContainer } from 'tests/util/helpers';
import type { IGroup } from '@antv/g-canvas';
import dataCfg from '../data/simple-table-data.json';
import { TableSheet } from '@/sheet-type';
import type { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 200,
  height: 1000,
};

describe('Grid Border Tests', () => {
  test('should draw left border without series number', () => {
    const s2 = new TableSheet(getContainer(), dataCfg, s2Options);
    s2.render();

    const panelScrollGroup = s2.facet.panelGroup.getChildren()[0];
    const gridGroup = (panelScrollGroup as any).gridGroup as IGroup;
    const originalLeftBorderBbox = gridGroup.getChildren()[0].getBBox();

    s2.facet.updateScrollOffset({ offsetX: { value: 100, animate: false } });
    s2.facet.updateScrollOffset({ offsetX: { value: 200, animate: false } });
    s2.facet.updateScrollOffset({ offsetX: { value: 300, animate: false } });
    s2.facet.updateScrollOffset({ offsetX: { value: 0, animate: false } });
    const newLeftBorderBbox = gridGroup.getChildren()[0].getBBox();

    const widthRatio =
      newLeftBorderBbox.maxX -
      newLeftBorderBbox.minX -
      (originalLeftBorderBbox.maxX - originalLeftBorderBbox.minX);
    const heightRatio =
      newLeftBorderBbox.maxY -
      newLeftBorderBbox.minY -
      (originalLeftBorderBbox.maxY - originalLeftBorderBbox.minY);
    // g绘制时，会将坐标1变成0.5，来达到真正绘制1px的效果，因此宽高不一定完全相同，会有1px的差值
    expect(widthRatio).toBeLessThanOrEqual(1);
    expect(heightRatio).toBeLessThanOrEqual(1);
  });
});

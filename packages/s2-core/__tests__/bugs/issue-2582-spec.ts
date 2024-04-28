/**
 * 透视表分页功能，以树状结构展示行维度，切换分页，在点击角头行图标，表格数据渲染异常
 * @description spec for issue #2582
 * https://github.com/antvis/S2/issues/2582
 */

import { createPivotSheet } from '../util/helpers';
import type { S2Options, SpreadSheet } from '@/index';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'tree',
  pagination: {
    current: 2,
    pageSize: 4,
  },
};

describe('PivotSheet Tree Mode Pagination Layout Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = createPivotSheet(s2Options);
    await s2.render();
  });

  test('should render correctly when row header wider than canvas if hierarchyCollapse enable', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          collapseAll: true,
        },
      },
    });
    await s2.render(false);

    expect(s2.facet.panelGroup.getBBox()).toEqual({
      bottom: 92,
      height: 30,
      left: 122,
      right: 400,
      top: 62,
      width: 278,
      x: 122,
      y: 62,
    });
  });
});

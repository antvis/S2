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

  beforeEach(() => {
    s2 = createPivotSheet(s2Options);
    s2.render();
  });

  test('should render correctly when row header wider than canvas', () => {
    expect(s2.facet.panelGroup.getCanvasBBox()).toMatchInlineSnapshot(`
      Object {
        "height": 90.5,
        "maxX": 399.57421875,
        "maxY": 150.5,
        "minX": 123,
        "minY": 60,
        "width": 276.57421875,
        "x": 123,
        "y": 60,
      }
    `);
  });

  test('should render correctly when row header wider than canvas if hierarchyCollapse enable', () => {
    s2.setOptions({
      style: {
        hierarchyCollapse: true,
      },
    });
    s2.render(false);

    expect(s2.facet.panelGroup.getCanvasBBox()).toMatchInlineSnapshot(`
      Object {
        "height": 30.5,
        "maxX": 399.57421875,
        "maxY": 90.5,
        "minX": 123,
        "minY": 60,
        "width": 276.57421875,
        "x": 123,
        "y": 60,
      }
    `);
  });
});

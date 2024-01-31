import {
  PivotSheet,
  SeriesNumberCell,
  Node,
  S2DataConfig,
  S2Options,
} from '@antv/s2';

/**
 * 自定义 SeriesNumberCell，改变背景色
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/series-number-cell.ts
 * 明细表需要继承 TableSeriesNumberCell  https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-series-number-cell.ts
 */
class CustomSeriesCell extends SeriesNumberCell {
  // 覆盖背景绘制，可覆盖或者增加绘制方法
  getBackgroundColor() {
    return {
      backgroundColor: 'cyan',
      backgroundColorOpacity: 0.5,
      intelligentReverseTextColor: false,
    };
  }
}

const layoutSeriesNumberNodes: S2Options['layoutSeriesNumberNodes'] = (
  rowsHierarchy,
  seriesNumberWidth,
  spreadsheet,
) => {
  const isHierarchyTreeType = spreadsheet.isHierarchyTreeType();
  const leaves = isHierarchyTreeType
    ? rowsHierarchy.getNodes()
    : rowsHierarchy.getLeaves();

  return leaves.map((node, idx) => {
    const sNode = new Node({
      id: '',
      field: '',
      rowIndex: idx,
      // 序号从 a 开始递增，在大量数据下，需要更完善的处理
      value: `${String.fromCharCode(97 + idx)}`,
    });

    sNode.x = 0;
    sNode.y = node.y;
    sNode.width = seriesNumberWidth;
    sNode.height = node.height;

    return sNode;
  });
};

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      // 切换到 grid 模式试试看
      hierarchyType: 'tree',
      seriesNumber: {
        enable: true
      },
      layoutSeriesNumberNodes,
      seriesNumberCell: (node, s2, headConfig) => {
        return new CustomSeriesCell(node, s2, headConfig);
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });

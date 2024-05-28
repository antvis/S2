import { PivotSheet, S2Options, Node } from '@antv/s2';

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
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 300,
      seriesNumber: {
        enable: true,
      },
      layoutSeriesNumberNodes, // 开启自定义序号列时，行冻结失效，注释掉试试看
      frozen: {
        rowCount: 1,
        trailingRowCount: 1,
        colCount: 1,
        trailingColCount: 1,
      },
      totals: {
        row: {
          showGrandTotals: true,
          reverseGrandTotalsLayout: true,
        },
      },
      style: {
        colCell: {
          widthByField: {
            'root[&]家具[&]沙发[&]number': 200,
            'root[&]办公用品[&]笔[&]number': 200,
          },
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });

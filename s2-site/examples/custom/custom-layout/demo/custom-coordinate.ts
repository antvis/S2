import { PivotSheet, SpreadSheetFacetCfg, Node } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
    };

    const s2options = {
      width: 660,
      height: 600,
      layoutCoordinate: (facetCfg, rowNode, colNode) => {
        // layoutCoordinate 用于改变行列叶子结点的尺寸（长、宽）和坐标（x、y）
        // 改变「宁波市」节点高度和所有 「number」 列叶子节点宽度。
        console.log(rowNode);
        console.log(colNode);
        if (rowNode?.label === '宁波市') {
          rowNode.height = 100;
        }
        if (colNode?.label === 'number') {
          colNode.width = 200;
        }
      }
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });

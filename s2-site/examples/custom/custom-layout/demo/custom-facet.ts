import {
  Hierarchy,
  LayoutResult,
  Node,
  PivotSheet,
  S2DataConfig,
  S2Options,
  PivotFacet,
} from '@antv/s2';

/**
 * 自定义 Facet, 修改单元格布局逻辑和宽高坐标
 * 查看更多 https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/pivot-facet.ts
 */
class CustomFacet extends PivotFacet {
  // 自定义行头节点高度
  getRowNodeHeight(rowNode: Node) {
    const defaultHeight = super.getRowNodeHeight(rowNode);

    return 200;
  }

  // 自定义列头节点高度
  getColNodeHeight(colNode: Node, colsHierarchy: Hierarchy) {
    const defaultHeight = super.getColNodeHeight(colNode, colsHierarchy);

    return 100;
  }

  // 自定义行头节点坐标
  calculateRowNodesCoordinate(layoutResult: LayoutResult) {
    super.calculateRowNodesCoordinate(layoutResult);
    // 你的自定义逻辑...
  }

  // 自定义列头节点坐标
  calculateColNodesCoordinate(layoutResult: LayoutResult) {
    super.calculateColNodesCoordinate(layoutResult);
    // 你的自定义逻辑...
  }

  // 自定义内容区域高度
  getContentHeight() {
    const defaultHeight = super.getContentHeight();

    // 你的自定义逻辑...
    return defaultHeight;
  }

  // 自定义单元格元数据
  getCellMeta(rowIndex: number, colIndex: number) {
    const cellMeta = super.getCellMeta(rowIndex, colIndex);

    // 你的自定义逻辑...
    return cellMeta;
  }

  // 自定义渲染逻辑
  render() {
    super.render();
    // 你的自定义逻辑...
  }
}

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
        valueInCols: true,
      },
      data: res.data,
      meta: [
        {
          field: 'number',
          name: '数量',
        },
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '类别',
        },
        {
          field: 'sub_type',
          name: '子类别',
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      facet: (spreadsheet) => new CustomFacet(spreadsheet),
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });

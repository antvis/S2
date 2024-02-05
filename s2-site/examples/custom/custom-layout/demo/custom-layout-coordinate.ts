import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

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
      layoutCoordinate: (spreadsheet, rowNode, colNode) => {
        // layoutCoordinate 用于特定场景改变行列叶子节点的坐标（x、y）
        // 如果只希望改变宽高, 请查看 "自定义单元格宽高" 章节 https://s2.antv.antgroup.com/manual/advanced/custom/cell-size
        // 改变「宁波市」节点高度
        console.log(rowNode, colNode);
        if (rowNode?.value === '宁波市') {
          rowNode.height = 100;
          rowNode.x += 10;
        }
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });

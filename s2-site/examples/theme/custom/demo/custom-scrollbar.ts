import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price', 'cost'],
      },
      meta: [
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
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      style: {
        rowCell: {
          width: 200,
        },
        dataCell: {
          width: 100,
          height: 200,
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.setTheme({
      scrollBar: {
        /** 滚动条轨道颜色 */
        trackColor: 'rgba(0,0,0,.1)',
        /** 滚动条 hover 态颜色 */
        thumbHoverColor: 'rgba(0,0,0,.4)',
        /** 滚动条颜色 */
        thumbColor: 'rgba(0,0,0,.1)',
        /** 滚动条水平最小尺寸 */
        thumbHorizontalMinSize: 10,
        /** 滚动条垂直最小尺寸 */
        thumbVerticalMinSize: 10,
        /** 滚动条尺寸 */
        size: 10,
        /** 滚动条 hover 态尺寸 */
        hoverSize: 14,
        /** 指定如何绘制每一条线段末端，可选: 'butt' | 'round' | 'square'; */
        lineCap: 'butt',
      },
    });

    await s2.render();
  });

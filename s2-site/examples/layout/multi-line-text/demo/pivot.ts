import {
  CellTextWordWrapStyle,
  PivotSheet,
  S2DataConfig,
  S2Options,
} from '@antv/s2';
import '@antv/s2/dist/style.min.css';

fetch('https://assets.antv.antgroup.com/s2/basic.json')
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
          name: '省份省份省份省份省份省份省份省份省份',
        },
        {
          field: 'city',
          name: '城市城市城市城市城市城市城市',
        },
        {
          field: 'type',
          name: '商品类别商品类别商品类别商品类别商品类别商品类别',
        },
        {
          field: 'price',
          name: '价格价格价格价格价格价格',
        },
        {
          field: 'cost',
          name: '成本成本成本成本成本成本成本',
        },
      ],
      data: [
        {
          province: '浙江浙江浙江浙江浙江浙江',
          city: '杭州杭州杭州杭州杭州杭州',
          type: '纸张纸张纸张纸张纸张',
          price: '2',
          cost: '20',
        },
        ...data,
      ],
    };

    const cellTextWordWrapStyle: CellTextWordWrapStyle = {
      // 最大行数，文本超出后将被截断
      maxLines: 2,
      // 文本是否换行
      wordWrap: true,
      // 可选项见：https://g.antv.antgroup.com/api/basic/text#textoverflow
      textOverflow: 'ellipsis',
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      seriesNumber: {
        enable: true,
        text: '序号序号序号序号序号序号',
      },
      tooltip: {
        enable: true,
        content: (cell) => {
          const text = cell?.getOriginalText();
          const span = document.createElement('span');

          span.innerHTML = text;

          return span;
        },
      },
      // 如果有省略号, 复制到的是完整文本
      interaction: {
        copy: {
          enable: true,
          withFormat: true,
          withHeader: true,
        },
        brushSelection: {
          dataCell: true,
          rowCell: true,
          colCell: true,
        },
      },
      style: {
        seriesNumberCell: cellTextWordWrapStyle,
        colCell: cellTextWordWrapStyle,
        cornerCell: cellTextWordWrapStyle,
        rowCell: {
          ...cellTextWordWrapStyle,
          height: 50,
        },
        // 数值不建议换行, 容易产生歧义
        // dataCell: cellTextWordWrapStyle,
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });

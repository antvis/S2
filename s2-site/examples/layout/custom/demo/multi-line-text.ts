import {
  DefaultCellTheme,
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

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      showSeriesNumber: true,
      seriesNumberText: '序号序号序号序号序号序号',
      tooltip: {
        enable: true,
        content: (cell) => {
          const text = cell.getOriginalText();
          const span = document.createElement('span');

          span.innerHTML = text;

          return span;
        },
      },
      // 如果有省略号, 复制到的是完整文本
      interaction: {
        enableCopy: true,
        copyWithFormat: true,
        copyWithHeader: true,
        brushSelection: {
          dataCell: true,
          rowCell: true,
          colCell: true,
        },
      },
      style: {
        rowCell: {
          height: 50,
        },
        colCell: {},
        dataCell: {},
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    const cellTheme: DefaultCellTheme = {
      text: {
        // 最大行数，文本超出后将被截断
        maxLines: 2,
        // 文本是否换行
        wordWrap: true,
        // 可选项见：https://g.antv.antgroup.com/api/basic/text#textoverflow
        textOverflow: 'ellipsis',
      },
      bolderText: {
        maxLines: 2,
        wordWrap: true,
        textOverflow: 'ellipsis',
      },
      measureText: {
        maxLines: 2,
        wordWrap: true,
        textOverflow: 'ellipsis',
      },
    };

    s2.setTheme({
      seriesNumberCell: cellTheme,
      colCell: cellTheme,
      cornerCell: cellTheme,
      rowCell: cellTheme,
      // 数值不建议换行, 容易产生歧义
      // dataCell: cellTheme,
    });

    await s2.render();
  });

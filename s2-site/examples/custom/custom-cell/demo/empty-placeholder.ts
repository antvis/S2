import { S2DataConfig, S2Options, TableSheet } from '@antv/s2';

const container = document.getElementById('container');
const s2DataConfig: S2DataConfig = {
  fields: {
    columns: ['province', 'city', 'type', 'price', 'cost'],
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
  data: [],
};

const s2Options: S2Options = {
  width: 600,
  height: 480,
  seriesNumber: {
    enable: true,
    text: '序号',
  },
  // 自定义空数据占位符: 文本,图标的大小和间距可以通过主题配置修改 https://s2.antv.antgroup.com/api/general/s2-theme#empty
  placeholder: {
    empty: {
      /**
       * 自定义 Icon, 支持 customSVGIcons 自定义注册和内置的 Icon
       * @see https://s2.antv.antgroup.com/manual/advanced/custom/custom-icon
       */
      icon: 'Empty',
      description: '暂无数据',
    },
  },
};

const s2 = new TableSheet(container, s2DataConfig, s2Options);

s2.render();

import { TableSheet, S2Event } from '@antv/s2';

fetch(
  '../data/basic-table-mode.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['type', 'province', 'city', 'price', 'cost'],
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

    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        // 默认隐藏 [省份] 和 [价格]
        hiddenColumnFields: ['province', 'price'],
      },
      tooltip: {
        showTooltip: true,
        operation: {
          // 开启手动隐藏
          hiddenColumns: true,
        },
      },
    };
    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.on(S2Event.LAYOUT_COLS_EXPANDED, (cell) => {
      console.log('列头展开', cell);
    });
    s2.on(
      S2Event.LAYOUT_COLS_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );

    s2.render();
  });

import { TableSheet, S2Event } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/94a016a4-6672-41b1-aef3-8f6094cd2c18.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['type', 'price', 'province', 'city'],
      },
      data,
    };

    const s2options = {
      width: 800,
      height: 600,
      hiddenColumnFields: ['price'],
      tooltip: {
        showTooltip: true,
        operation: {
          hiddenColumns: true,
        },
      },
    };
    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, (cell) => {
      console.log('列头展开', cell);
    });
    s2.on(
      S2Event.LAYOUT_TABLE_COL_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );

    s2.render();
  });

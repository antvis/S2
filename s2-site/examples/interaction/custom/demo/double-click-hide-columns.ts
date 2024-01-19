/* eslint-disable max-classes-per-file */
import {
  TableSheet,
  BaseEvent,
  S2Event,
  S2DataConfig,
  S2Options,
} from '@antv/s2';

class HiddenInteraction extends BaseEvent {
  bindEvents() {
    // 列头双击
    this.spreadsheet.on(S2Event.COL_CELL_DOUBLE_CLICK, (event) => {
      const cell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();

      this.spreadsheet.interaction.hideColumns([meta.field]);
    });

    this.spreadsheet.on(S2Event.COL_CELL_EXPANDED, (cell) => {
      console.log('列头展开:', cell);
    });

    this.spreadsheet.on(
      S2Event.COL_CELL_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏:', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );
  }
}

class ContextMenuInteraction extends BaseEvent {
  bindEvents() {
    // 禁止弹出右键菜单
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, (event) => {
      event?.preventDefault?.();
      console.log('右键', event);
    });
  }
}

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json',
)
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
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

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      tooltip: {
        enable: true,
      },
      interaction: {
        customInteractions: [
          {
            key: 'HiddenInteraction',
            interaction: HiddenInteraction,
          },
          {
            key: 'ContextMenuInteraction',
            interaction: ContextMenuInteraction,
          },
        ],
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });

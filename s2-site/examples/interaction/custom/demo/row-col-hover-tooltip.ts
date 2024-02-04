import { PivotSheet, BaseEvent, S2Event, S2Options } from '@antv/s2';
import '@antv/s2/dist/style.min.css';

class RowColumnHoverTooltipInteraction extends BaseEvent {
  bindEvents() {
    // 行头 hover
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (event) => {
      this.showTooltip(event);
    });
    // 列头 hover
    this.spreadsheet.on(S2Event.COL_CELL_HOVER, (event) => {
      this.showTooltip(event);
    });
  }

  showTooltip(event) {
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell?.getMeta();
    const content = meta?.value || 'custom';

    this.spreadsheet.showTooltip({
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      content,
    });
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      tooltip: {
        enable: true,
      },
      interaction: {
        customInteractions: [
          {
            key: 'RowColumnHoverTooltipInteraction',
            interaction: RowColumnHoverTooltipInteraction,
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });

import { PivotSheet, BaseEvent, S2Event } from '@antv/s2';

class RowColumnHoverTooltipInteraction extends BaseEvent {
  bindEvents() {
    // 行头hover
    this.spreadsheet.on(S2Event.ROW_CELL_HOVER, (event) => {
      this.showTooltip(event);
    });
    // 列头hover
    this.spreadsheet.on(S2Event.COL_CELL_HOVER, (event) => {
      this.showTooltip(event);
    });
  }

  showTooltip(event) {
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell.getMeta();
    const content = meta.value;

    this.spreadsheet.tooltip.show({
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
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options = {
      width: 600,
      height: 480,
      tooltip: {
        showTooltip: true,
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

    s2.render();
  });

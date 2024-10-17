import { BaseEvent, PivotSheet, S2Options } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

class DisableContextMenuInteraction extends BaseEvent {
  bindEvents() {
    this.spreadsheet
      .getCanvasElement()
      .addEventListener('contextmenu', (event) => {
        event.preventDefault();
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
      interaction: {
        customInteractions: [
          {
            key: 'DisableContextMenuInteraction',
            interaction: DisableContextMenuInteraction,
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });

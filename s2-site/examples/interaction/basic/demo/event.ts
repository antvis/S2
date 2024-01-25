import { PivotSheet, S2Options, S2Event } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      style: {
        rowCell: {
          width: 200,
        },
        dataCell: {
          width: 100,
          height: 100,
        },
      },
      interaction: {
        enableCopy: true,
        hoverHighlight: true,
        brushSelection: true,
        multiSelection: true,
        selectedCellHighlight: true,
        selectedCellsSpotlight: true,
        selectedCellMove: true,
        overscrollBehavior: 'none',
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    [
      S2Event.GLOBAL_SCROLL,
      S2Event.ROW_CELL_CLICK,
      S2Event.GLOBAL_SELECTED,
      S2Event.DATA_CELL_BRUSH_SELECTION,
    ].forEach((eventName) => {
      s2.on(eventName, (...args) => {
        console.log(eventName, ...args);
      });
    });

    await s2.render();
  });

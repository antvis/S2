import { PivotSheet, S2DataConfig, S2Event, S2Options } from '@antv/s2';
import insertCSS from 'insert-css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const button = document.createElement('button');

    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
      meta: res.meta,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        selectedCellsSpotlight: true,
      },
      mergedCellsInfo: [
        [
          { colIndex: 1, rowIndex: 6, showText: true },
          { colIndex: 1, rowIndex: 7 },
          { colIndex: 2, rowIndex: 6 },
          { colIndex: 2, rowIndex: 7 },
          { colIndex: 3, rowIndex: 6 },
          { colIndex: 3, rowIndex: 7 },
        ],
      ],
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    const dataCellTooltip = () => {
      button.innerText = '点击合并单元格';
      button.className = 'merge-cells-button';
      button.onclick = () => {
        s2.interaction.mergeCells();
      };

      return button;
    };

    const mergedCellsTooltip = (mergedCell) => {
      button.innerText = '取消合并单元格';
      button.className = 'merge-cells-button';
      button.onclick = () => {
        s2.interaction.unmergeCell(mergedCell);
      };

      return button;
    };

    s2.on(S2Event.DATA_CELL_CLICK, (event) => {
      s2.tooltip.show({
        position: { x: event.clientX, y: event.clientY },
        content: dataCellTooltip(),
      });
    });

    s2.on(S2Event.MERGED_CELLS_CLICK, (event) => {
      const cell = s2.getCell(event.target);

      s2.tooltip.show({
        position: { x: event.clientX, y: event.clientY },
        content: mergedCellsTooltip(cell),
      });
    });

    await s2.render();
  });

insertCSS(`
  .merge-cells-button {
    border: 1px solid transparent;
    box-shadow: 0 2px #00000004;
    cursor: pointer;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 2px;
    color: #000000d9;
    border-color: #d9d9d9;
    background: #fff;
  }
  .merge-cells-button:hover {
    color: #40a9ff;
    border-color: #40a9ff;
  }
  .merge-cells-button:active {
    color: #096dd9;
    border-color: #096dd9;
  }
  .antv-s2-tooltip-container  {
    padding: 10px 64px;
  }
`);

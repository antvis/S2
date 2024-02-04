/* eslint-disable no-console */
import {
  TableSheet,
  S2Event,
  S2Options,
  S2DataConfig,
  SpreadSheet,
  S2CellType,
  TooltipShowOptions,
} from '@antv/s2';
import '@antv/s2/dist/style.min.css';

function hideSelectedColumns(s2: SpreadSheet) {
  // 兼容多选
  const selectedColumnNodes = s2.interaction
    .getActiveCells()
    .map((cell) => cell.getMeta());

  const selectedColumnFields = selectedColumnNodes.map((node) => node.field);

  s2.interaction.hideColumns(selectedColumnFields, true);
}

// 使用 `@antv/s2` tooltip 的 ui 需要自己封装, `@antv/s2-react` 已经内置.
function getTooltipContent(cell: S2CellType, options: TooltipShowOptions) {
  const { spreadsheet, isLeaf } = cell.getMeta();

  if (!isLeaf || !spreadsheet.options.tooltip?.operation?.hiddenColumns) {
    return null;
  }

  const button = document.createElement('button');

  button.type = 'button';
  button.innerHTML = '隐藏';
  button.className = 'ant-btn';
  button.addEventListener('click', () => {
    hideSelectedColumns(spreadsheet);
  });

  return button;
}

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
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
      interaction: {
        // 默认隐藏 [省份] 和 [价格]
        hiddenColumnFields: ['province', 'price'],
      },
      tooltip: {
        enable: true,
        operation: {
          // 开启手动隐藏
          hiddenColumns: true,
        },
        content: getTooltipContent,
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.on(S2Event.COL_CELL_EXPANDED, (cell) => {
      console.log('列头展开', cell);
    });

    s2.on(
      S2Event.COL_CELL_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );

    await s2.render();
  });

import { PivotSheet, S2Event, S2Options } from '@antv/s2';

function hideSelectedColumns(s2) {
  // 兼容多选
  const selectedColumnNodes = s2.interaction
    .getActiveCells()
    .map((cell) => cell.getMeta());

  const selectedColumnFields = selectedColumnNodes.map((node) => node.id);
  s2.interaction.hideColumns(selectedColumnFields, true);
}

function getTooltipContent(cell, options) {
  const { spreadsheet, isLeaf } = cell.getMeta();

  if (!isLeaf || !spreadsheet.options.tooltip.operation.hiddenColumns) {
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
        // 透视表默认隐藏需要指定唯一列头id
        // 可通过 `s2.facet.getColCellNodes()` 获取列头节点查看id
        hiddenColumnFields: ['root[&]家具[&]沙发[&]number'],
      },
      tooltip: {
        enable: true,
        operation: {
          // 开启手动隐藏, 叶子节点有效
          hiddenColumns: true,
        },
        content: getTooltipContent,
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

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

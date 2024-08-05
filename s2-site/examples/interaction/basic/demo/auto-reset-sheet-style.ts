import {
  S2DataConfig,
  S2Options,
  TableSheet,
  type SpreadSheet,
} from '@antv/s2';

function addButton(s2: SpreadSheet) {
  const btn = document.createElement('button');

  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = '点我选中列头, 但是不会重置交互状态';

  btn.addEventListener('click', () => {
    const colCell = s2.facet.getColCells()[0];

    s2.interaction.selectCell(colCell);
  });

  const canvas = document.querySelector('#container > canvas');

  if (canvas) {
    canvas.style.marginTop = '10px';

    canvas.before(btn);
  }
}

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
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
        // 在按下 ESC 键或者鼠标移出表格区域后，自动重置单元格选中,高亮状态
        // autoResetSheetStyle: true,
        autoResetSheetStyle: (event) => {
          // 支持根据 event 动态判断, 如: 点击操作按钮时不自动重置交互
          if (event?.target instanceof HTMLElement) {
            return !event.target.classList.contains('ant-btn');
          }

          // 其他情况正常重置
          return true;
        },
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    await s2.render();

    addButton(s2);
  });

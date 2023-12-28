import { PivotSheet, S2Options } from '@antv/s2';
import '@antv/s2/dist/style.min.css';

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
        content: '我是自定义内容',
        rowCell: {
          content: (cell, showOptions) => {
            console.log(cell, showOptions);
            const meta = cell.getMeta();
            const summary = showOptions.data?.summaries?.[0];

            return `
              <div>
                <p>我是 rowCell 自定义内容</p>
                <p>${meta.value} (${summary?.selectedData?.length} 项已选中)</p>
                <p>${summary?.name}-${summary?.value}</p>
              </div>
            `;
          },
        },
        colCell: {
          content: `
            <div>
              <p>我是自定义内容1</p>
              <p>我是自定义内容2</p>
            </div>
          `,
        },
        dataCell: {
          content() {
            const div = document.createElement('div');

            div.innerHTML = '我是 dataCell 自定义内容';

            return div;
          },
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });

import { PivotSheet, S2DataConfig, S2Event } from '@antv/s2';
import { SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
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
      ],
      data,
    };

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      showDefaultHeaderActionIcon: true,

      /**
       * `@antv/s2-react` 提供开箱即用的组内排序组件
       * 详情请查看: https://s2.antv.antgroup.com/manual/basic/sort/group
       */
      tooltip: {
        enable: true,
        operation: {
          // 开启组内排序
          sort: true,
        },
        colCell: {
          content: (cell) => {
            const meta = cell.getMeta();
            const { spreadsheet: s2 } = meta;

            if (!meta.isLeaf) {
              return null;
            }

            const config = [
              {
                label: '降序',
                method: 'desc',
              },
              {
                label: '升序',
                method: 'asc',
              },
              {
                label: '不排序',
                method: 'none',
              },
            ];

            // 自定义列头叶子节点的 Tooltip 内容, 展示一个简易的排序菜单
            const ul = document.createElement('ul');

            config.forEach((item) => {
              const li = document.createElement('li');

              li.style.cursor = 'pointer';

              li.addEventListener('click', (e) => {
                e.stopPropagation();
                s2.groupSortByMethod(item.method, meta);
              });
              li.innerText = item.label;
              ul.appendChild(li);
            });

            return ul;
          },
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.on(S2Event.RANGE_SORT, (sortParams) => {
      console.log('sortParams:', sortParams);
    });

    await s2.render();
  });

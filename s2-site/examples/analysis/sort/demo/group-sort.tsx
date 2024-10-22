// organize-imports-ignore
import React from 'react';
import { S2DataConfig } from '@antv/s2';
import { Menu } from 'antd';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then((data) => {
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
       * `@antv/s2` 提供组内排序的能力，如果不使用 `@antv/s2-react` 的话, 可以自行实现 Tooltip 排序菜单，然后调用相关 API.
       * 详情请查看: https://s2.antv.antgroup.com/manual/basic/sort/group
       */
      tooltip: {
        enable: true,
        operation: {
          // 开启组内排序
          sort: true,
          menu: {
            render: (props) => {
              return <Menu {...props} />;
            },
          },
        },
      },
    };

    const onRangeSort = (sortParams) => {
      console.log('sortParams:', sortParams);
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          sheetType="pivot"
          adaptive={false}
          dataCfg={s2DataConfig}
          options={s2Options}
          onRangeSort={onRangeSort}
        />,
      );
  });

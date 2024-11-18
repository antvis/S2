/* eslint-disable no-console */
// organize-imports-ignore
import { S2DataConfig } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { Pagination } from 'antd';
import React from 'react';
import '@antv/s2-react/dist/s2-react.min.css';

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  pagination: {
    current: 1,
    pageSize: 5,
  },
};

function App({ dataCfg }) {
  return (
    <>
      <SheetComponent dataCfg={dataCfg} options={s2Options} sheetType="table">
        {({ pagination }) => (
          // 结合任意分页器使用: 如 antd 的 Pagination 组件
          <Pagination
            size="small"
            defaultCurrent={1}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共计 ${total} 条`}
            {...pagination}
          />
        )}
      </SheetComponent>
    </>
  );
}

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
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
      data: res,
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App dataCfg={s2DataConfig} />);
  });

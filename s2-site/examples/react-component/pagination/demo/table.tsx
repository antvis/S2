/* eslint-disable no-console */
// organize-imports-ignore
import React from 'react';
import { S2DataConfig } from '@antv/s2';
import { Pagination } from 'antd';
import {
  SheetComponent,
  SheetComponentOptions,
  usePagination,
} from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  pagination: {
    pageSize: 5,
    current: 2,
  },
};

function App({ dataCfg }) {
  const s2Ref = React.useRef();
  // 处理分页器和 S2 分页渲染的逻辑
  const pagination = usePagination(s2Ref.current);

  return (
    <>
      <SheetComponent dataCfg={dataCfg} options={s2Options} sheetType="table" />
      <Pagination
        size="small"
        defaultCurrent={1}
        showSizeChanger
        {...pagination}
      />
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

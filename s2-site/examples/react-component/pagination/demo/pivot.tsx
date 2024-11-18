// organize-imports-ignore
import React from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { Pagination } from 'antd';
import '@antv/s2-react/dist/s2-react.min.css';

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  pagination: {
    current: 1,
    pageSize: 4,
  },
};

function App({ dataCfg }) {
  return (
    <>
      <SheetComponent dataCfg={dataCfg} options={s2Options}>
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

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App dataCfg={dataCfg} />);
  });

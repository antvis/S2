// organize-imports-ignore
import React from 'react';
import {
  SheetComponent,
  SheetComponentOptions,
  usePagination,
} from '@antv/s2-react';
import { Pagination } from 'antd';
import '@antv/s2-react/dist/style.min.css';

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  pagination: {
    current: 1,
    pageSize: 4,
  },
};

function App({ dataCfg }) {
  const s2Ref = React.useRef();
  // 处理分页器和 S2 分页渲染的逻辑
  const pagination = usePagination(s2Ref.current);

  return (
    <>
      <SheetComponent dataCfg={dataCfg} options={s2Options} ref={s2Ref} />
      <Pagination
        size="small"
        defaultCurrent={1}
        showSizeChanger
        {...pagination}
      />
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

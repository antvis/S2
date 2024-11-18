/* eslint-disable no-console */
// organize-imports-ignore
import React from 'react';
import { S2DataConfig, type SpreadSheet } from '@antv/s2';
import { SheetComponent, type SheetComponentOptions } from '@antv/s2-react';
import { Export } from '@antv/s2-react-components';
import { Button, Space } from 'antd';
import '@antv/s2-react/dist/s2-react.min.css';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  interaction: {
    copy: {
      enable: true,
    },
  },
};

function App({ dataCfg }) {
  const s2Ref = React.useRef<SpreadSheet>();

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Export sheetInstance={s2Ref.current}>
          <Button>自定义导出按钮</Button>
        </Export>
        <Export
          sheetInstance={s2Ref.current}
          onCopySuccess={(data) => {
            console.log('copy success:', data);
          }}
          onCopyError={(error) => {
            console.log('copy failed:', error);
          }}
          onDownloadSuccess={(data) => {
            console.log('download success', data);
          }}
          onDownloadError={(error) => {
            console.log('download failed:', error);
          }}
        />
      </Space>
      <SheetComponent dataCfg={dataCfg} options={s2Options} ref={s2Ref} />
    </>
  );
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App dataCfg={s2DataConfig} />);
  });

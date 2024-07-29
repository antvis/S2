/* eslint-disable no-console */
// organize-imports-ignore
import React from 'react';
import { S2DataConfig, type SpreadSheet } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

// 初始化配置
const s2Options: SheetComponentOptions = {
  width: 600,
  height: 400,
  seriesNumber: {
    enable: true,
  },
  tooltip: { enable: false },
  interaction: {
    copy: {
      enable: true,
    },
    hoverHighlight: false,
  },
  showDefaultHeaderActionIcon: false,
};

// 初始化数据
const s2DataCfg: S2DataConfig = {
  fields: {
    columns: ['province', 'city', 'type', 'price'],
  },
  sortParams: [],
  data: [],
};

const App = ({ data }) => {
  const s2Ref = React.useRef<SpreadSheet>(null);
  const [options, setOptions] =
    React.useState<SheetComponentOptions>(s2Options);
  const [dataCfg, setDataCfg] = React.useState<S2DataConfig>({
    ...s2DataCfg,
    data,
  });

  const onMounted = () => {
    console.log('s2:', s2Ref.current);
  };

  return (
    <div style={{ position: 'relative' }}>
      <SheetComponent
        ref={s2Ref}
        dataCfg={dataCfg}
        options={options}
        sheetType="editable"
        onMounted={onMounted}
      />
    </div>
  );
};

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App data={res} />);
  });

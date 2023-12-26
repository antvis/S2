import { S2DataConfig } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import 'antd/es/checkbox/style/index.css';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

// 初始化配置
const s2Options: SheetComponentOptions = {
  width: 600,
  height: 400,
  showSeriesNumber: true,
  tooltip: { enable: false },
  interaction: { enableCopy: true, hoverHighlight: false },
  showDefaultHeaderActionIcon: false,
};

// 初始化数据
const s2DataCfg: S2DataConfig = {
  fields: { columns: ['province', 'city', 'type', 'price'] },
  sortParams: [],
  data: [],
};

const App = ({ data }) => {
  const S2Ref = useRef(null);
  const [options, setOptions] = useState<SheetComponentOptions>(s2Options);
  const [dataCfg, setDataCfg] = useState<S2DataConfig>({ ...s2DataCfg, data });

  return (
    <div style={{ position: 'relative' }}>
      <SheetComponent
        ref={S2Ref}
        dataCfg={dataCfg}
        options={options}
        sheetType="editable"
      />
    </div>
  );
};

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    ReactDOM.createRoot(document.getElementById('container')).render(
      <App data={res} />,
    );
  });

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, S2Options, S2DataConfig } from '@antv/s2';
import { Divider, Space, InputNumber } from 'antd';
import '@antv/s2/dist/s2.min.css';
import 'antd/es/input-number/style/index.css';

const App = ({ dataCfg }) => {
  const [options, setOptions] = useState({
    width: 450,
    height: 400,
    showSeriesNumber: true,
    frozenColCount: 1,
    frozenRowCount: 1,
    frozenTrailingColCount: 2,
    frozenTrailingRowCount: 1,
  });

  const setFrozenCount = (key, value) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  const maxColCount = dataCfg.fields.columns.length + 1;
  const maxRowCount = dataCfg.data.length;

  return (
    <div>
      <Space>
        <div>
          <div>frozenColCount</div>
          <InputNumber
            value={options.frozenColCount}
            min={0}
            max={maxColCount - options.frozenTrailingColCount}
            onChange={(v) => {
              setFrozenCount('frozenColCount', Number(v));
            }}
          />
        </div>
        <div>
          <div>frozenTrailingColCount</div>
          <InputNumber
            min={0}
            max={maxColCount - options.frozenColCount}
            value={options.frozenTrailingColCount}
            onChange={(v) =>
              setFrozenCount('frozenTrailingColCount', Number(v))
            }
          />
        </div>
        <div>
          <div>frozenRowCount</div>
          <InputNumber
            min={0}
            value={options.frozenRowCount}
            max={maxRowCount - options.frozenTrailingRowCount}
            onChange={(val) => setFrozenCount('frozenRowCount', Number(val))}
          />
        </div>
        <div>
          <div>frozenTrailingRowCount</div>
          <InputNumber
            min={0}
            value={options.frozenTrailingRowCount}
            max={maxRowCount - options.frozenRowCount}
            onChange={(val) =>
              setFrozenCount('frozenTrailingRowCount', Number(val))
            }
          />
        </div>
      </Space>
      <Divider />
      <SheetComponent dataCfg={dataCfg} options={options} sheetType="table" />
    </div>
  );
};

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((res) => {
    const s2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price'],
      },
      data: res,
    };

    ReactDOM.render(
      <App dataCfg={s2DataConfig} />,
      document.getElementById('container'),
    );
  });

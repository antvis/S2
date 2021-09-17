import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Switch } from 'antd';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';
import {
  withColHeaderDataCfg,
  withoutColHeaderDataCfg,
} from '../data/issue-285-dataset.json';

function MainLayout() {
  const [dataCfg, setDataCfg] = useState(withoutColHeaderDataCfg);
  const [colHeaderMode, setColHeaderMode] = useState(false);

  const onColHeaderChange = (checked) => {
    setColHeaderMode(checked);
    const newDataSet = checked ? withColHeaderDataCfg : withoutColHeaderDataCfg;
    setDataCfg(newDataSet);
  };
  return (
    <div>
      <SheetEntry
        dataCfg={dataCfg}
        options={{}}
        themeCfg={{ name: 'default' }}
        forceUpdateDataCfg={true}
        header={
          <Switch
            checkedChildren="有列头"
            unCheckedChildren="无列头"
            checked={colHeaderMode}
            onChange={onColHeaderChange}
          />
        }
      />
    </div>
  );
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});

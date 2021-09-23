/**
 * @description spec for issue #285
 * https://github.com/antvis/S2/issues/285
 * Wrong render state when updating the dataCfg and options
 *
 */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Switch } from 'antd';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';
import * as withColHeaderDataCfg from '../data/data-issue-285/data-col-header.json';
import * as withoutColHeaderDataCfg from '../data/data-issue-285/data-without-col-header.json';
import { S2DataConfig } from '@/common/interface';

function MainLayout() {
  const [dataCfg, setDataCfg] = useState<S2DataConfig>(withColHeaderDataCfg);
  const [colHeaderMode, setColHeaderMode] = useState(false);

  const onColHeaderChange = (checked: boolean) => {
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

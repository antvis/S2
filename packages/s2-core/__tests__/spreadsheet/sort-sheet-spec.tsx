import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'antd';
import { act } from 'react-dom/test-utils';
import { S2DataConfig } from '../../src';
import { getContainer } from '../util/helpers';
import { SheetEntry, assembleOptions, assembleDataCfg } from '../util/sheet-entry';

const dataCfg: Partial<S2DataConfig> = {
  ...assembleDataCfg({
  }),
};

function MainLayout() {
  const [isTotals, setIsTotals] = useState(false);
  const [mergedOptions, setMergedOptions] = useState(assembleOptions({}));

  const onTotalsChange = (checked) => {
    setIsTotals(checked);
    setMergedOptions({
      totals: {
        row: {
          showGrandTotals: checked,
          showSubTotals: checked,
          reverseLayout: checked,
          reverseSubLayout: checked,
          subTotalsDimensions: ['area', 'province'],
        },
        col: {
          showGrandTotals: checked,
          showSubTotals: checked,
          reverseLayout: checked,
          reverseSubLayout: checked,
          subTotalsDimensions: ['type'],
        },
      },
    });
  };

  return (
    <SheetEntry
      dataCfg={dataCfg}
      options={mergedOptions}
      header={
        <Switch
          checkedChildren="关闭总计/小计"
          unCheckedChildren="打开总计/小计"
          checked={isTotals}
          onChange={onTotalsChange}
        />
      }
    />
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
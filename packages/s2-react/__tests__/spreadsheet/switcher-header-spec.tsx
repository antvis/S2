import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { S2Options } from '@antv/s2';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import { SheetComponent } from '@/components';

import 'antd/dist/antd.min.css';

const s2Options: S2Options = {
  width: 500,
  height: 500,
};

function MainLayout() {
  return (
    <div>
      <h2>指标切换 Header</h2>
      <SheetComponent
        adaptive={false}
        dataCfg={mockDataConfig}
        options={{ ...s2Options, interaction: { hiddenColumnFields: [] } }}
        header={{ switcherCfg: { open: true } }}
      />
    </div>
  );
}

describe('Dimension Switch Test', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});

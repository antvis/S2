import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import { assembleDataCfg, assembleOptions } from '../../playground/sheet-entry';
import { SheetComponent } from '@/components';

const extra = [
  {
    field: 'type',
    value: '笔',
    tips: '说明：这是笔的说明',
  },
];

const infos = '按住 Shift 多选或框选，查看多个数据点';

function MainLayout() {
  return (
    <SheetComponent
      dataCfg={assembleDataCfg({})}
      options={assembleOptions({})}
      getSpreadSheet={(instance) => {
        instance.showTooltip = (tooltipOptions) => {
          const { data = {} } = tooltipOptions;
          const { tips } = extra.find((item) => item.value === data.name) || {};
          const options = {
            ...tooltipOptions,
            data: {
              ...data,
              infos,
              tips,
            },
          };
          instance.tooltip.show(options);
        };
      }}
    />
  );
}

describe('spreadsheet custom show tooltip spec', () => {
  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
  test('should pass test', () => {
    expect(1).toBe(1);
  });
});

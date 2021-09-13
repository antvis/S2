import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';
import { CustomHover } from './custom/custom-interaction';
import { S2Options } from '@/common/interface';

const options: Partial<S2Options> = {
  customInteractions: [
    {
      key: 'spreadsheet:custom-hover',
      interaction: CustomHover,
    },
  ],
  tooltip: {
    showTooltip: true,
  },
};

function MainLayout() {
  return <SheetEntry dataCfg={{}} options={options} />;
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});

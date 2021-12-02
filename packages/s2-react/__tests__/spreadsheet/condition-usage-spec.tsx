import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { S2Options, SpreadSheet } from '@antv/s2';
import { getContainer, getGradient } from '../util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import { SheetComponent } from '@/components';

const sheetInstance: React.MutableRefObject<SpreadSheet> = { current: null };

const intervalValue = { min: 0, max: 1000 };
const backgroundValue = { min: 0, max: 1000 };

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

function MainLayout() {
  return (
    <SheetComponent
      dataCfg={mockDataConfig}
      options={{
        ...s2Options,
        conditions: {
          interval: [
            {
              field: 'number',
              mapping(fieldValue) {
                const rage =
                  (fieldValue - intervalValue.min) /
                  (intervalValue.max - intervalValue.min);
                const intervalColor = getGradient(rage, '#7ee5f6', '#3a9dbf');
                return {
                  fill: intervalColor,
                  isCompare: true,
                  minValue: intervalValue.min,
                  maxValue: intervalValue.max,
                };
              },
            },
          ],
          background: [
            {
              field: 'number',
              mapping(value: number) {
                const rage =
                  (value - backgroundValue.min) /
                  (backgroundValue.max - backgroundValue.min);
                const intervalColor = getGradient(rage, '#daccfa', '#a171f7');
                return {
                  fill: intervalColor,
                };
              },
            },
          ],
          text: [
            {
              field: 'number',
              mapping(fieldValue) {
                return {
                  fill: fieldValue >= 15000 && '#fff',
                };
              },
            },
          ],
        },
      }}
      ref={sheetInstance}
    />
  );
}

describe('spreadsheet multiple values cell spec', () => {
  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });

  test('should get correct condition count', () => {
    expect(sheetInstance.current.options.conditions.interval).toHaveLength(1);
    expect(sheetInstance.current.options.conditions.background).toHaveLength(1);
    expect(sheetInstance.current.options.conditions.icon).toBeUndefined();
  });
});

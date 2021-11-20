import { InputNumber, Switch } from 'antd';
import React, { MutableRefObject, useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { SpreadSheet } from '@antv/s2';
import { getContainer, getGradient } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';

const sheetInstance: MutableRefObject<SpreadSheet> = { current: null };

function MainLayout() {
  const [isCompare, setCompare] = useState(true);
  const [intervalValue, setIntervalValue] = useState({ min: 0, max: 1000 });
  const [backgroundValue, setBackgroundValue] = useState({ min: 0, max: 1000 });
  const [enableBg, setEnableBg] = useState(true);

  const onCompareChange = (checked) => {
    setCompare(checked);
  };

  const onBgChange = (checked) => {
    setEnableBg(checked);
  };

  return (
    <SheetEntry
      dataCfg={{}}
      options={{
        conditions: {
          interval: [
            {
              field: 'number',
              mapping(fieldValue) {
                const rage =
                  (fieldValue - intervalValue.min) /
                  (intervalValue.max - intervalValue.min);
                const intervalColor = getGradient(rage, '#7ee5f6', '#3a9dbf');
                return isCompare
                  ? {
                      fill: intervalColor,
                      isCompare: true,
                      minValue: intervalValue.min,
                      maxValue: intervalValue.max,
                    }
                  : {
                      fill: '',
                      isCompare,
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
                return (
                  enableBg && {
                    fill: intervalColor,
                  }
                );
              },
            },
          ],
          text: [
            {
              field: 'number',
              mapping(fieldValue) {
                return {
                  fill: fieldValue >= 15000 && enableBg ? '#fff' : '#282b32',
                };
              },
            },
          ],
        },
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseLayout: true,
            reverseSubLayout: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseLayout: true,
            reverseSubLayout: true,
            subTotalsDimensions: ['type', 'sub_type'],
          },
        },
      }}
      ref={sheetInstance}
      header={
        <div>
          <div style={{ display: 'block', marginBottom: 20 }}>
            开启颜色条自定义区间：
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked={isCompare}
              onChange={onCompareChange}
              style={{ marginRight: 10 }}
            />
            最小值：{' '}
            <InputNumber
              disabled={!isCompare}
              value={intervalValue.min}
              onChange={(v) => {
                const updated = { ...intervalValue, min: v };
                setIntervalValue(updated);
              }}
            />
            最大值：{' '}
            <InputNumber
              disabled={!isCompare}
              value={intervalValue.max}
              onChange={(v) => {
                const updated = { ...intervalValue, max: v };
                setIntervalValue(updated);
              }}
            />
          </div>

          <div style={{ display: 'block', marginBottom: 20 }}>
            开启背景自定义区间：
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked={enableBg}
              onChange={onBgChange}
              style={{ marginRight: 10 }}
            />
            最小值：{' '}
            <InputNumber
              disabled={!enableBg}
              value={backgroundValue.min}
              onChange={(v) => {
                const updated = { ...backgroundValue, min: v };
                setBackgroundValue(updated);
              }}
            />
            最大值：{' '}
            <InputNumber
              disabled={!enableBg}
              value={backgroundValue.max}
              onChange={(v) => {
                const updated = { ...backgroundValue, max: v };
                setBackgroundValue(updated);
              }}
            />
          </div>
        </div>
      }
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

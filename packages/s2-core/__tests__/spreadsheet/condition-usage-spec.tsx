import { InputNumber, Switch } from 'antd';
import React, { MutableRefObject, useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { SpreadSheet } from '../../src';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';

const intervalColor = 'red';
const bgColor = '#29A294';

const sheetInstance: MutableRefObject<SpreadSheet> = { current: null };

function MainLayout() {
  const [isCompare, setCompare] = useState(false);
  const [values, setValues] = useState({ min: 0, max: 1000 });

  const [enableBg, setEnableBg] = useState(false);
  const [bgThreshold, setBgThreshold] = useState(0);

  const onCompareChange = (checked) => {
    setCompare(checked);
  };

  const onBgChange = (checked) => {
    setEnableBg(checked);
  };

  const onThresholdChange = (threshold: number) => {
    setBgThreshold(threshold);
  };

  return (
    <SheetEntry
      dataCfg={{}}
      options={{
        conditions: {
          interval: [
            {
              field: 'price',
              mapping() {
                return isCompare
                  ? {
                      fill: intervalColor,
                      isCompare: true,
                      minValue: values.min,
                      maxValue: values.max,
                    }
                  : { fill: intervalColor };
              },
            },
          ],
          background: [
            {
              field: 'cost',
              mapping(value: number) {
                return (
                  enableBg &&
                  value >= bgThreshold && {
                    fill: bgColor,
                  }
                );
              },
            },
          ],
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
              value={values.min}
              onChange={(v) => {
                const updated = { ...values, min: v };
                setValues(updated);
              }}
            />
            最大值：{' '}
            <InputNumber
              disabled={!isCompare}
              value={values.max}
              onChange={(v) => {
                const updated = { ...values, max: v };
                setValues(updated);
              }}
            />
          </div>
          <div style={{ display: 'block', marginBottom: 20 }}>
            开启背景色条自定义区间：
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked={enableBg}
              onChange={onBgChange}
              style={{ marginRight: 10 }}
            />
            阈值：{' '}
            <InputNumber
              disabled={!enableBg}
              value={bgThreshold}
              onChange={onThresholdChange}
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
    expect(sheetInstance.current.options.conditions.text).toBeUndefined();
  });
});

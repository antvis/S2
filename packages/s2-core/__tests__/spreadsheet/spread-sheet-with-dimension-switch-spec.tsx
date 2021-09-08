import { DimensionSwitchPopover } from '@/components/dimension-switch';
import { DimensionType } from '@/components/dimension-switch/dimension';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';

const getDimensionData = (): DimensionType[] => {
  return [
    {
      type: 'value',
      displayName: '指标',
      items: [
        {
          id: 'cost',
          displayName: '成本',
          checked: true,
        },
        {
          id: 'price',
          displayName: '价格',
          checked: true,
        },
        {
          id: 'cost/price',
          displayName: '成本率',
          checked: true,
        },
      ],
    },
  ];
};

function MainLayout() {
  const [values, setValues] = useState(['cost', 'price', 'cost/price']);
  const [dimension, setDimension] = useState(getDimensionData());

  const onSubmit = (result: DimensionType[]) => {
    const checkedValues = result[0].items
      .filter((i) => i.checked)
      .map((i) => i.id);

    setValues(checkedValues);
    setDimension(result);
  };
  return (
    <div>
      <div style={{ margin: '10px' }}>
        <DimensionSwitchPopover data={dimension} onSubmit={onSubmit} />
      </div>
      <SheetEntry
        dataCfg={{
          fields: {
            values: values,
          },
        }}
        options={{}}
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

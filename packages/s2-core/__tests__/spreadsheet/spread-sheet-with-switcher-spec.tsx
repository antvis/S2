import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';
import {
  DimensionItem,
  MeasureItem,
} from '@/components/switcher/dimension/dimension';
import { Switcher } from '@/components/switcher';

const mockRows: DimensionItem[] = [
  { id: 'area', displayName: '区域' },
  { id: 'province', displayName: '省' },
  { id: 'city', displayName: '城市' },
];
const mockCols: DimensionItem[] = [
  { id: 'area', displayName: '区域' },
  { id: 'province', displayName: '省' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
];
const mockValues: MeasureItem[] = [
  { id: 'area', displayName: '区域' },
  { id: 'province', displayName: '省' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
  { id: 'city', displayName: '城市' },
];

function MainLayout() {
  const [values, setValues] = useState(['cost', 'price', 'cost/price']);

  return (
    <div>
      <div style={{ margin: '10px' }}>
        <Switcher
          rows={mockRows}
          cols={mockCols}
          values={mockValues}
        ></Switcher>
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

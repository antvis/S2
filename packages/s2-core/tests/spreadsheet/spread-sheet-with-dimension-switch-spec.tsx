import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { getContainer, getMockData } from '../util/helpers';
import { act } from 'react-dom/test-utils';

import { DimensionSwitchPopover } from 'src/components/dimension-switch';
import { DimensionType } from 'src/components/dimension-switch/dimension';
import { SheetComponent } from '@/components';
import { clone } from 'lodash';

const mockData = getMockData('../data/tableau-supermarket.csv');

const getDataCfg = () => {
  return {
    fields: {
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit', 'count', 'sale_amt', 'discount'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'sale_amt',
        name: '销售额',
        formatter: (v) => v,
      },
      {
        field: 'count',
        name: '销售个数',
        formatter: (v) => v,
      },
      {
        field: 'discount',
        name: '折扣',
        formatter: (v) => v,
      },
      {
        field: 'profit',
        name: '利润',
        formatter: (v) => v,
      },
    ],
    data: mockData,
  };
};

const getDimestionData = (): DimensionType[] => {
  return [
    {
      type: 'value',
      displayName: '指标',
      items: [
        {
          id: 'profit',
          displayName: '利润',
          checked: true,
        },
        {
          id: 'count',
          displayName: '销售个数',
          checked: true,
        },
        {
          id: 'discount',
          displayName: '折扣',
          checked: true,
        },
        {
          id: 'sale_amt',
          displayName: '销售额',
          checked: true,
        },
      ],
    },
  ];
};

const getOptions = () => {
  return {
    width: 800,
    height: 600,
    hierarchyType: 'grid',
    hierarchyCollapse: false,
    showSeriesNumber: true,
    freezeRowHeader: false,
    mode: 'pivot',
  };
};

const getTheme = () => {
  return {};
};

function MainLayout({ dataCfg, dimensionData, options, theme }) {
  const [data, setData] = useState(dataCfg);
  const [dimension, setDimension] = useState(dimensionData);

  const onSubmit = (result: DimensionType[]) => {
    const checkedValues = result[0].items
      .filter((i) => i.checked)
      .map((i) => i.id);

    const newData = clone(data);
    newData.fields.values = checkedValues;
    setData(newData);
    setDimension(result);
  };
  return (
    <div>
      <div style={{ margin: '10px' }}>
        <DimensionSwitchPopover data={dimension} onSubmit={onSubmit} />
      </div>
      <SheetComponent dataCfg={data} options={options} theme={theme} />
    </div>
  );
}

describe('Dimension Switch Test', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <MainLayout
        dataCfg={getDataCfg()}
        dimensionData={getDimestionData()}
        options={getOptions()}
        theme={getTheme()}
      />,
      getContainer(),
    );
  });
});

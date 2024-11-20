// organize-imports-ignore
import React from 'react';
import { type DrillDownDataSet } from '@antv/s2-react';
import { DrillDown } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

const dataSet: DrillDownDataSet[] = [
  {
    name: '性别',
    value: 'sex',
    type: 'text',
  },
  {
    name: '姓名',
    value: 'name',
    type: 'text',
  },
  {
    name: '城市',
    value: 'city',
    type: 'location',
  },
  {
    name: '日期',
    value: 'date',
    type: 'date',
  },
];

reactDOMClient
  .createRoot(document.getElementById('container'))
  .render(
    <DrillDown
      title="选择下钻维度"
      searchText="搜索"
      clearText="清除"
      disabledFields={['name']}
      dataSet={dataSet}
    />,
  );

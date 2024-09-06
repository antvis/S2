// organize-imports-ignore
import React from 'react';
import { DrillDown, type DataSet } from '@antv/s2-react';

const dataSet: DataSet[] = [
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
      title="下钻"
      searchText="搜索"
      clearText="清除"
      disabledFields={['name']}
      dataSet={dataSet}
    />,
  );

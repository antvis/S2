import React from 'react';
import ReactDOM from 'react-dom';
import { DrillDown } from '@antv/s2-react';

const disabledFields = ['name'];
const clearButtonText = '清除';

const dataSet = [
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

ReactDOM.render(
  <DrillDown
    disabledFields={disabledFields}
    clearButtonText={clearButtonText}
    dataSet={dataSet}
  />,
  document.getElementById('container'),
);

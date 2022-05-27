import React from 'react';
import ReactDOM from 'react-dom';
import { Switcher } from '@antv/s2-react';

const switcherFields = {
  rows: {
    items: [{ id: 'province' }, { id: 'city' }],
    allowEmpty: false,
  },
  columns: {
    items: [{ id: 'type' }],
  },
  values: {
    selectable: true,
    items: [{ id: 'price' }, { id: 'cost' }],
  },
};

const onSubmit = (result) => {
  console.log('result:', result);
};

ReactDOM.render(
  <Switcher {...switcherFields} onSubmit={onSubmit} />,
  document.getElementById('container'),
);

import React from 'react';
import ReactDOM from 'react-dom';
import { Switcher } from '@antv/s2';
import { SearchIcon } from '@antv/s2/esm/common/icons';
import insertCss from 'insert-css';

const switcherFields = {
  rows: {
    items: [{ id: 'province' }, { id: 'city' }],
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

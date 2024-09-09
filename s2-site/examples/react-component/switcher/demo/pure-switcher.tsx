/* eslint-disable no-console */
// organize-imports-ignore
import React from 'react';
import { Switcher } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/style.min.css';

const switcherFields = {
  rows: {
    items: [
      { id: 'province', displayName: '省份 (province)' },
      { id: 'city', displayName: '城市 (city)' },
    ],
    allowEmpty: false,
  },
  columns: {
    items: [{ id: 'type', displayName: '类型 (type)' }],
  },
  values: {
    selectable: true,
    items: [
      { id: 'price', checked: true },
      { id: 'cost', checked: false },
    ],
  },
};

const onSubmit = (result) => {
  console.log('result:', result);
};

reactDOMClient
  .createRoot(document.getElementById('container'))
  .render(<Switcher {...switcherFields} onSubmit={onSubmit} />);

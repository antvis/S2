import React from 'react';
import { Switcher } from '@antv/s2-react';

const switcherFields = {
  rows: {
    items: [{ id: 'province' }, { id: 'city' }],
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

import React from 'react';
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

reactDOMClient
  .createRoot(document.getElementById('container'))
  .render(<Switcher {...switcherFields} onSubmit={onSubmit} />);

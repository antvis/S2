/* eslint-disable no-console */
// organize-imports-ignore
import React from 'react';
import { Space, Button } from 'antd';
import { Switcher } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

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

function App() {
  const onSubmit = (result) => {
    console.log('result:', result);
  };

  return (
    <Space>
      <Switcher {...switcherFields} onSubmit={onSubmit} />
      <Switcher
        {...switcherFields}
        title="标题"
        icon={<antdIcons.EditOutlined />}
        onSubmit={onSubmit}
      />
      <Switcher {...switcherFields} onSubmit={onSubmit}>
        <Button size="small" icon={<antdIcons.SwapOutlined />}>
          自定义入口
        </Button>
      </Switcher>
    </Space>
  );
}

reactDOMClient.createRoot(document.getElementById('container')).render(<App />);

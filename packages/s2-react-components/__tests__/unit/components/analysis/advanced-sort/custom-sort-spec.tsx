import { CustomSort } from '@/components';
import { render } from '@testing-library/react';
import React from 'react';

describe('CustomSort Component Tests', () => {
  test('should render component', () => {
    const { asFragment } = render(
      <CustomSort
        splitOrders={[
          '杭州市',
          '绍兴市',
          '宁波市',
          '舟山市',
          '成都市',
          '绵阳市',
          '南充市',
          '乐山市',
        ]}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

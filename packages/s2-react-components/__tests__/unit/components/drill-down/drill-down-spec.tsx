import { DrillDown } from '@/components';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('DrillDown Component Tests', () => {
  test('should render component', () => {
    const { asFragment } = render(<DrillDown dataSet={[]} />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render extra content', () => {
    const { asFragment } = render(
      <DrillDown dataSet={[]} extra={<div>Extra</div>} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom config', () => {
    const { asFragment, container } = render(
      <DrillDown
        className="test"
        extra="extra"
        title="下钻"
        clearText="清空"
        searchText="搜索"
        dataSet={[]}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
    expect(screen.getByText('extra')).toBeDefined();
    expect(screen.getByText('下钻')).toBeDefined();
    expect(screen.getByText('清空')).toBeDefined();
  });

  test('should render custom dataset', () => {
    const { asFragment, container } = render(
      <DrillDown
        disabledFields={['name']}
        dataSet={[
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
        ]}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelectorAll('.ant-menu-item')).toHaveLength(4);
    expect(container.querySelectorAll('.ant-menu-item-disabled')).toHaveLength(
      1,
    );
  });
});

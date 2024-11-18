import { Switcher } from '@/components';
import { UpCircleOutlined } from '@ant-design/icons';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('switcher component test', () => {
  test('should render component', () => {
    const { asFragment, container } = render(<Switcher title="行列切换" />);

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('行列切换')).toBeDefined();
    expect(container.querySelector('.anticon-swap')).toBeDefined();
  });

  test('should render custom icon', () => {
    const { asFragment, container } = render(
      <Switcher icon={<UpCircleOutlined />} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.anticon-up-circle')).toBeDefined();
  });

  test('should render custom children', () => {
    const { asFragment } = render(
      <Switcher>
        <div>自定义</div>
      </Switcher>,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('自定义')).toBeDefined();
  });

  test('should render custom popover props', () => {
    const { asFragment } = render(
      <Switcher
        popover={{
          open: true,
          className: 'custom-popover',
          content: <div>自定义内容</div>,
        }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('自定义内容')).toBeDefined();
  });
});

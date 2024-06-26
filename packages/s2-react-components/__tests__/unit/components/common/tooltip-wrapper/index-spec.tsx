import { TooltipWrapper } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('Tooltip Wrapper Component Tests', () => {
  test('should render correctly', () => {
    const { asFragment } = render(
      <TooltipWrapper title="测试" className="test" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom content', () => {
    render(
      <TooltipWrapper title="测试">
        <div>自定义内容</div>
      </TooltipWrapper>,
    );

    expect(screen.getByText('自定义内容')).toBeTruthy();
  });

  test('should show custom label when tooltip clicked', () => {
    render(
      <TooltipWrapper title="测试" trigger="click">
        <div>自定义内容</div>
      </TooltipWrapper>,
    );

    fireEvent.click(screen.getByText('自定义内容'));

    expect(screen.getByText('测试')).toBeTruthy();
  });
});

import { ResetGroup } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('Reset Group Component Tests', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<ResetGroup />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom width', () => {
    const { asFragment } = render(<ResetGroup width={400} />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom style and class name', () => {
    const { asFragment } = render(
      <ResetGroup style={{ padding: 10 }} className="test" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom title', () => {
    render(<ResetGroup title="恢复" />);

    expect(screen.getByText('恢复')).toBeTruthy();
  });

  test('should render custom content', () => {
    render(<ResetGroup title="恢复">内容</ResetGroup>);

    expect(screen.getByText('内容')).toBeTruthy();
  });

  test('should render collapsed group', () => {
    const { container, asFragment } = render(
      <ResetGroup defaultCollapsed>
        <div className="content">test</div>
      </ResetGroup>,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.content')).toBeFalsy();
  });

  test('should trigger rest event', () => {
    const onResetClick = jest.fn();

    render(<ResetGroup onResetClick={onResetClick} />);

    fireEvent.click(screen.getByText('重置'));

    expect(onResetClick).toHaveBeenCalledTimes(1);
  });
});

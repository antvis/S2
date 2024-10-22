import { FrozenPanel } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('Frozen Panel Component Tests', () => {
  test('should render correctly panel', () => {
    const { asFragment } = render(<FrozenPanel />);

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('冻结行列头')).toBeDefined();
    expect(screen.getByText('冻结行头')).toBeDefined();
    expect(screen.getByText('冻结行')).toBeDefined();
    expect(screen.getByText('冻结列')).toBeDefined();
  });

  test('should render custom panel title', () => {
    const title = '自定义标题';

    render(<FrozenPanel title={title} />);

    expect(screen.getByText(title)).toBeDefined();
  });

  test('should default collapse panel', () => {
    const { asFragment } = render(<FrozenPanel defaultCollapsed />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom content', () => {
    const { container } = render(
      <FrozenPanel>
        <span className="custom-content">content</span>
      </FrozenPanel>,
    );

    expect(container.querySelector('.custom-content')).toBeDefined();
  });

  test('should hidden frozen row header', () => {
    const { asFragment } = render(<FrozenPanel showFrozenRowHeader={false} />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should hidden frozen row', () => {
    const { asFragment } = render(<FrozenPanel showFrozenRow={false} />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should hidden frozen col', () => {
    const { asFragment } = render(<FrozenPanel showFrozenCol={false} />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should set custom input number props', () => {
    const { asFragment } = render(
      <FrozenPanel
        inputNumberProps={{
          size: 'large',
          step: 1,
        }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('should trigger onReset event', () => {
    const onRest = jest.fn();

    render(<FrozenPanel onReset={onRest} />);

    fireEvent.click(screen.getByText('重置'));

    expect(onRest).toHaveReturnedTimes(1);
    expect(onRest).toHaveBeenCalledWith(
      {
        frozenCol: [],
        frozenRow: [],
        frozenRowHeader: true,
      },
      expect.anything(),
    );
  });

  test('should trigger onReset event with prev options', () => {
    const onRest = jest.fn();

    render(<FrozenPanel onReset={onRest} />);

    fireEvent.click(screen.getByText('冻结行头'));
    fireEvent.click(screen.getByText('冻结行'));
    fireEvent.click(screen.getByText('冻结列'));
    fireEvent.click(screen.getByText('重置'));

    expect(onRest).toHaveBeenCalledWith(
      {
        frozenCol: [],
        frozenRow: [],
        frozenRowHeader: true,
      },
      {
        frozenCol: [1, 1],
        frozenRow: [1, 1],
        frozenRowHeader: false,
      },
    );
  });

  test('should trigger onChange event', () => {
    const onChange = jest.fn();

    render(<FrozenPanel onChange={onChange} />);

    fireEvent.click(screen.getByText('冻结行头'));

    expect(onChange).toHaveBeenLastCalledWith({
      frozenCol: [],
      frozenRow: [],
      frozenRowHeader: false,
    });

    fireEvent.click(screen.getByText('冻结行'));

    expect(onChange).toHaveBeenLastCalledWith({
      frozenCol: [],
      frozenRow: [1, 1],
      frozenRowHeader: false,
    });

    fireEvent.click(screen.getByText('冻结列'));

    expect(onChange).toHaveBeenLastCalledWith({
      frozenCol: [1, 1],
      frozenRow: [1, 1],
      frozenRowHeader: false,
    });
  });

  test('should disable input number', () => {
    const { container } = render(<FrozenPanel />);

    expect([
      ...container.querySelectorAll('.ant-input-number-disabled'),
    ]).toHaveLength(4);
  });

  test('should enable input number', () => {
    const { container } = render(
      <FrozenPanel
        defaultOptions={{
          frozenRow: [1, 1],
          frozenCol: [1, 1],
        }}
      />,
    );

    expect([
      ...container.querySelectorAll('.ant-input-number-disabled'),
    ]).toHaveLength(0);
  });
});

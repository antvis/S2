import { TextAlignPanel } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('Text Align Panel Component Tests', () => {
  test('should render correctly panel', () => {
    const { asFragment } = render(<TextAlignPanel />);

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('文字对齐')).toBeDefined();
  });

  test('should render custom panel title', () => {
    const title = '自定义标题';

    render(<TextAlignPanel title={title} />);

    expect(screen.getByText(title)).toBeDefined();
  });

  test('should default collapse panel', () => {
    const { asFragment } = render(<TextAlignPanel defaultCollapsed />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom content', () => {
    const { container } = render(
      <TextAlignPanel>
        <span className="custom-content">content</span>
      </TextAlignPanel>,
    );

    expect(container.querySelector('.custom-content')).toBeDefined();
  });

  test('should trigger onReset event', () => {
    const onRest = jest.fn();

    render(<TextAlignPanel onReset={onRest} />);

    fireEvent.click(screen.getByText('重置'));

    expect(onRest).toHaveReturnedTimes(1);
    expect(onRest).toHaveBeenCalledWith(
      {
        dataCellTextAlign: 'right',
        rowCellTextAlign: 'left',
      },
      expect.anything(),
      expect.anything(),
    );
  });

  test('should trigger onReset event with prev options', () => {
    const onRest = jest.fn();

    const { container } = render(<TextAlignPanel onReset={onRest} />);

    fireEvent.click(container.querySelectorAll('.ant-radio-button')[1]!);
    fireEvent.click(screen.getByText('重置'));

    expect(onRest).toHaveBeenCalledWith(
      {
        dataCellTextAlign: 'right',
        rowCellTextAlign: 'left',
      },
      {
        colCellTextAlign: 'center',
        dataCellTextAlign: 'center',
        rowCellTextAlign: 'left',
      },
      expect.anything(),
    );
  });

  test('should trigger onChange event', () => {
    const onChange = jest.fn();

    const { container } = render(<TextAlignPanel onChange={onChange} />);

    fireEvent.click(container.querySelectorAll('.ant-radio-button')[1]!);

    expect(onChange).toHaveBeenLastCalledWith(
      {
        colCellTextAlign: 'center',
        dataCellTextAlign: 'center',
        rowCellTextAlign: 'left',
      },
      expect.anything(),
    );
  });
});

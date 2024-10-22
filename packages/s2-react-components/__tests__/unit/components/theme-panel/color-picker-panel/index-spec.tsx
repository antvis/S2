import { ColorPickerPanel } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('Theme Panel Color Picker Panel Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render correctly', () => {
    const { asFragment } = render(<ColorPickerPanel />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render color box list', () => {
    const { container } = render(<ColorPickerPanel />);

    expect(screen.getByText('推荐主题色')).toBeDefined();
    expect(screen.getByText('最近使用')).toBeDefined();

    expect(container.querySelectorAll('.antv-s2-color-box')).toHaveLength(6);
  });

  test('should reset primary color', () => {
    const onChange = jest.fn();
    const { container } = render(<ColorPickerPanel onChange={onChange} />);

    fireEvent.click(container.querySelector('.antv-s2-reset-btn')!);

    expect(onChange).toHaveBeenCalledWith('#5B8FF9');
  });

  test('should selected primary color', () => {
    const onChange = jest.fn();

    const { container } = render(<ColorPickerPanel onChange={onChange} />);

    fireEvent.click(container.querySelectorAll('.antv-s2-color-box')[1]);

    expect(onChange).toHaveBeenCalledWith('#BDD2FD');
  });

  test('should render custom color picker', () => {
    const onChange = jest.fn();
    const { container } = render(<ColorPickerPanel onChange={onChange} />);

    expect(
      container.querySelector('.antv-s2-color-picker-panel-sketch-picker'),
    ).toBeFalsy();

    fireEvent.click(screen.getByText('自定义'));

    expect(
      container.querySelector('.antv-s2-color-picker-panel-sketch-picker'),
    ).toBeTruthy();
  });
});

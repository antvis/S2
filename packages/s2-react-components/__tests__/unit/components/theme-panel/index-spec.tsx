import { ThemePanel } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('Theme Panel Component Tests', () => {
  test('should render correctly panel', () => {
    const { asFragment } = render(<ThemePanel />);

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('主题风格')).toBeDefined();
  });

  test('should render custom panel title', () => {
    const title = '自定义标题';

    render(<ThemePanel title={title} />);

    expect(screen.getByText(title)).toBeDefined();
  });

  test('should default collapse panel', () => {
    const { asFragment } = render(<ThemePanel defaultCollapsed />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom content', () => {
    const { container } = render(
      <ThemePanel>
        <span className="custom-content">content</span>
      </ThemePanel>,
    );

    expect(container.querySelector('.custom-content')).toBeDefined();
  });

  test('should not render custom primary color picker', () => {
    const { container } = render(
      <ThemePanel disableCustomPrimaryColorPicker />,
    );

    expect(
      [
        ...container.querySelectorAll<HTMLLabelElement>(
          '.ant-radio-button-wrapper',
        ),
      ].some((ele) => ele.innerText === '自定义'),
    ).toBeFalsy();
  });

  test('should trigger onReset event', () => {
    const onRest = jest.fn();

    render(<ThemePanel onReset={onRest} />);

    fireEvent.click(screen.getByText('重置'));

    expect(onRest).toHaveReturnedTimes(1);
    expect(onRest).toHaveBeenCalledWith(
      {
        colorType: 'primary',
        hierarchyType: 'grid',
        themeType: 'default',
      },
      expect.anything(),
      expect.anything(),
    );
  });

  test('should trigger onReset event with prev options', () => {
    const onRest = jest.fn();

    render(<ThemePanel onReset={onRest} />);

    fireEvent.click(screen.getByText('浅色主题'));
    fireEvent.click(screen.getByText('灰色'));
    fireEvent.click(screen.getByText('重置'));

    expect(onRest).toHaveBeenCalledWith(
      {
        colorType: 'primary',
        hierarchyType: 'grid',
        themeType: 'default',
      },
      {
        colorType: 'gray',
        hierarchyType: 'grid',
        themeType: 'default',
      },
      expect.anything(),
    );
  });

  test.each([
    {
      colorType: 'primary',
      text: '深色主题',
    },
    {
      colorType: 'secondary',
      text: '浅色主题',
    },
    {
      colorType: 'gray',
      text: '灰色',
    },
    {
      colorType: 'custom',
      text: '自定义',
    },
  ])('should trigger onChange event by %o', ({ colorType, text }) => {
    const onChange = jest.fn();

    render(<ThemePanel onChange={onChange} />);

    fireEvent.click(screen.getByText(text));

    expect(onChange).toHaveBeenCalledWith(
      {
        colorType,
        hierarchyType: 'grid',
        themeType: 'default',
      },
      expect.anything(),
    );
  });

  test('should render custom primary color box when custom radio button clicked', () => {
    const { container } = render(<ThemePanel />);

    fireEvent.click(screen.getByText('自定义'));

    expect(screen.getByText('自定义颜色')).toBeDefined();
    expect(container.querySelector('.antv-s2-color-box')).toBeDefined();
  });

  test('should render custom primary color picker when custom color box clicked', () => {
    const onChange = jest.fn();
    const { container } = render(<ThemePanel onChange={onChange} />);

    fireEvent.click(screen.getByText('自定义'));
    fireEvent.click(container.querySelector('.antv-s2-color-box')!);

    expect(screen.getByText('颜色编辑')).toBeDefined();
    expect(
      container.querySelector('.antv-s2-color-picker-panel'),
    ).toBeDefined();
  });
});

import { ColorBox } from '@/components';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

describe('Theme Panel Color Box Component Tests', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<ColorBox />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom primary color picker when custom color box clicked', () => {
    const onClick = jest.fn();
    const { container } = render(<ColorBox onClick={onClick} />);

    fireEvent.click(container.querySelector('.antv-s2-color-box')!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

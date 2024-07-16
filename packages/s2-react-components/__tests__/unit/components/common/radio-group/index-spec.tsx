import { RadioGroup } from '@/components';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Radio Group Component Tests', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<RadioGroup />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom label', () => {
    render(<RadioGroup label="类型" />);

    expect(screen.getByText('类型')).toBeTruthy();
  });

  test('should render custom options', () => {
    const { asFragment } = render(
      <RadioGroup label="类型" disabled buttonStyle="solid" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render icon only', () => {
    const { asFragment } = render(<RadioGroup onlyIcon />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render extra content', () => {
    const { container } = render(
      <RadioGroup extra={<div className="extra">extra</div>} />,
    );

    expect(container.querySelector('.extra')).toBeTruthy();
    expect(screen.getByText('extra')).toBeTruthy();
  });
});

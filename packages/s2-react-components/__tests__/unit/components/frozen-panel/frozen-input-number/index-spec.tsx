import { FrozenInputNumber } from '@/components';
import { render } from '@testing-library/react';
import React from 'react';

describe('Frozen Input Number Component Tests', () => {
  test('should render correctly panel', () => {
    const { asFragment } = render(<FrozenInputNumber />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should set custom input number props', () => {
    const { asFragment } = render(
      <FrozenInputNumber
        size="large"
        step={2}
        className="test"
        style={{ color: 'red' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { AdvancedSort } from '@/components/advanced-sort';

describe('AdvancedSort Component Tests', () => {
  test('should render component', () => {
    const { asFragment, container } = render(<AdvancedSort className="test" />);

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
  });
});

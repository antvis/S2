import { render } from '@testing-library/react';
import React from 'react';
import { Export } from '@/components/export';

describe('Export Component Tests', () => {
  test('should render component', () => {
    const { asFragment, container } = render(<Export className="test" />);

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
  });
});

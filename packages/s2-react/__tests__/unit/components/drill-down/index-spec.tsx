import React from 'react';
import { render, screen } from '@testing-library/react';
import { DrillDown } from '@/components/drill-down';

describe('DrillDown Component Tests', () => {
  test('should render component', () => {
    const { asFragment, container } = render(
      <DrillDown className="test" extra="extra" dataSet={[]} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
    expect(screen.getByText('extra')).toBeDefined();
  });
});

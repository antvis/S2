import React from 'react';
import { render } from '@testing-library/react';
import { getMockSheetInstance } from '../../../util/helpers';
import { AdvancedSort } from '@/components/advanced-sort';

describe('AdvancedSort Component Tests', () => {
  test('should render component', () => {
    const sheet = getMockSheetInstance();
    const { asFragment, container } = render(
      <AdvancedSort className="test" sheet={sheet} open />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
  });
});

import { render } from '@testing-library/react';
import React from 'react';
import { getMockSheetInstance } from '../../../util/helpers';
import { Export } from '@/components/export';

describe('Export Component Tests', () => {
  test('should render component', () => {
    const sheet = getMockSheetInstance();
    const { asFragment, container } = render(
      <Export className="test" sheet={sheet} open />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
  });
});

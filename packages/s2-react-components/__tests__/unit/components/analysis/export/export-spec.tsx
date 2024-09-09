import { Export } from '@/components';
import { render } from '@testing-library/react';
import React from 'react';
import { getMockSheetInstance } from '../../../../../../s2-react/__tests__/util/helpers';

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

import { AdvancedSort } from '@/components';
import { render } from '@testing-library/react';
import React from 'react';
import { getMockSheetInstance } from '../../../../util/helpers';

describe('AdvancedSort Component Tests', () => {
  test('should render component', () => {
    const sheetInstance = getMockSheetInstance();
    const { asFragment, container } = render(
      <AdvancedSort className="test" sheetInstance={sheetInstance} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
  });
});

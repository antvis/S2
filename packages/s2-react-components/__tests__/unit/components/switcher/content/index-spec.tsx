import { SwitcherContent } from '@/components/switcher/content';
import { render } from '@testing-library/react';
import React from 'react';

describe('switcher component content test', () => {
  test('should render switcher content', () => {
    const { asFragment } = render(<SwitcherContent />);

    expect(asFragment()).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { Switcher } from '@/components/switcher';

describe('switcher component test', () => {
  test('should render component', () => {
    const result = render(<Switcher title="title" />);

    expect(result.asFragment()).toMatchSnapshot();
  });
});

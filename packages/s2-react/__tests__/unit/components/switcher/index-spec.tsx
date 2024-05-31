import { Switcher } from '@/components/switcher';
import { render } from '@testing-library/react';
import React from 'react';

describe('switcher component test', () => {
  test('should render component', () => {
    const result = render(<Switcher title="title" />);

    expect(result.asFragment()).toMatchSnapshot();
  });
});

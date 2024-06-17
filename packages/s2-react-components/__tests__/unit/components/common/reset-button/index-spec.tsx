import { ResetButton } from '@/components';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Reset Button Component Tests', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<ResetButton />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render custom title', () => {
    render(<ResetButton title="恢复" />);

    expect(screen.getByText('恢复')).toBeTruthy();
  });

  test('should render icon', () => {
    const { container } = render(<ResetButton />);

    expect(container.querySelector('.antv-s2-reset-btn-icon')).toBeTruthy();
  });
});

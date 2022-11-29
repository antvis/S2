import React from 'react';
import { render, screen } from '@testing-library/react';
import { S2Pagination } from '@/components/pagination';

describe('Pagination Component Tests', () => {
  test('should not render pagination if config is empty', () => {
    const { container } = render(<S2Pagination pagination={null} />);

    expect(container.querySelector('.antv-s2-pagination')).toBeNull();
  });

  test('should render component', () => {
    const result = render(
      <S2Pagination pagination={{ pageSize: 1, total: 20 }} />,
    );

    expect(result.asFragment()).toMatchSnapshot();
    expect(screen.getByText('共计20条')).toBeDefined();
    expect(screen.getByText('1 / page')).toBeDefined();
  });
});

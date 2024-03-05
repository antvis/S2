import { render } from '@testing-library/react';
import React from 'react';
import { S2Pagination } from '@/components/pagination';

describe('Pagination Component Tests', () => {
  test('should not render pagination if config is empty', () => {
    const { container } = render(<S2Pagination pagination={undefined} />);

    expect(container.querySelector('.antv-s2-pagination')).toBeNull();
  });

  test('should render component', () => {
    const result = render(
      <S2Pagination pagination={{ current: 1, pageSize: 1, total: 20 }} />,
    );

    expect(result.asFragment()).toMatchSnapshot();
  });
});

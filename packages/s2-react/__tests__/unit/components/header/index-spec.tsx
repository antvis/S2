import React from 'react';
import { render, screen } from '@testing-library/react';
import { getMockSheetInstance } from 'tests/util/helpers';
import { Header } from '@/components/header';

describe('Header Component Tests', () => {
  test('should render basic header without extra', () => {
    const sheet = getMockSheetInstance();
    const title = 'this is title';

    render(<Header sheet={sheet} title={title} />);
    expect(screen.getByText(title)).toBeDefined();
  });

  test('should render header with extra', () => {
    const sheet = getMockSheetInstance();
    const extra = 'this is extra';

    render(<Header sheet={sheet} extra={extra} />);
    expect(screen.getByText(extra)).toBeDefined();
  });

  test('should render header with internal component', () => {
    const sheet = getMockSheetInstance();
    const { container } = render(
      <Header
        sheet={sheet}
        export={{ open: true }}
        advancedSort={{ open: true }}
        switcher={{ open: true }}
      />,
    );

    // export 组件
    expect(container.querySelector('.antv-s2-export')).toBeDefined();
    // switcher 组件
    expect(
      container.querySelector('.antv-s2-switcher-entry-button'),
    ).toBeDefined();

    // 高级排序组件
    expect(container.querySelector('.antv-s2-advanced-sort-btn')).toBeDefined();
  });

  test('should render component', () => {
    const className = 'test';
    const sheet = getMockSheetInstance();

    const result = render(
      <Header
        sheet={sheet}
        title={'title'}
        extra="extra"
        className={className}
        export={{ open: true }}
        advancedSort={{ open: true }}
        switcher={{ open: true }}
      />,
    );

    expect(result.asFragment()).toMatchSnapshot();
    expect(result.container.querySelector(className)).toBeDefined();
    expect(screen.getAllByText('高级排序')).toBeDefined();
    expect(screen.getAllByText('行列切换')).toBeDefined();
  });
});

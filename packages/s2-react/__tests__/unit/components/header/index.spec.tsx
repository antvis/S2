import React from 'react';
import { render, screen } from '@testing-library/react';
import { getMockSheetInstance } from 'tests/util/helpers';
import { Header } from '@/components/header';
describe('header component test', () => {
  test('should render basic header without extra', () => {
    const sheet = getMockSheetInstance();
    const title = 'this is title';
    render(<Header sheet={sheet} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('should render header with extra', () => {
    const sheet = getMockSheetInstance();
    const extra = 'this is extra';
    render(<Header sheet={sheet} extra={extra} />);
    expect(screen.getByText(extra)).toBeInTheDocument();
  });

  test('should render header with internal component', () => {
    const sheet = getMockSheetInstance();
    const { container } = render(
      <Header
        sheet={sheet}
        exportCfg={{ open: true }}
        advancedSortCfg={{ open: true }}
        switcherCfg={{ open: true }}
      />,
    );
    // export组件没有文字显示，只能通过className查找
    expect(container.querySelector('.antv-s2-export')).toBeInTheDocument();
    expect(screen.getByText('高级排序')).toBeInTheDocument();
    expect(screen.getByText('行列切换')).toBeInTheDocument();
  });
});

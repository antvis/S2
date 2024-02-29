import { DownCircleOutlined } from '@ant-design/icons';
import {
  getTooltipOperatorSortMenus,
  type S2CellType,
  type TooltipDetailListItem,
  type TooltipOperatorMenuItem,
  type TooltipSummaryOptions,
} from '@antv/s2';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TooltipComponent } from '../../../../src';
import { TooltipDetail } from '../../../../src/components/tooltip/components/detail';
import { TooltipHead } from '../../../../src/components/tooltip/components/head-info';
import { TooltipOperator } from '../../../../src/components/tooltip/components/operator';
import { TooltipSummary } from '../../../../src/components/tooltip/components/summary';
import type { TooltipOperatorMenuItems } from '../../../../src/components/tooltip/interface';

describe('Tooltip Component Tests', () => {
  // https://github.com/antvis/S2/issues/1716
  test.each(getTooltipOperatorSortMenus())(
    'should render sort menu and select %o menu',
    ({ key, label }) => {
      const { asFragment } = render(
        <TooltipComponent
          options={{
            onlyShowOperator: true,
            operator: {
              menu: {
                items:
                  getTooltipOperatorSortMenus() as TooltipOperatorMenuItems,
                defaultSelectedKeys: [key],
              },
            },
          }}
          cell={null as unknown as S2CellType}
          position={{ x: 0, y: 0 }}
        />,
      );

      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByText('组内升序')).toBeDefined();
      expect(screen.getByText('组内降序')).toBeDefined();
      expect(screen.getByText('不排序')).toBeDefined();

      const selectedMenu = Array.from(
        document.querySelectorAll('.ant-menu-submenu-selected'),
      );

      expect(selectedMenu).toHaveLength(1);
      expect(selectedMenu[0]?.textContent).toContain(label);
    },
  );
});

describe('Tooltip Common Components Tests', () => {
  test('render sort tooltip: TooltipOperator', () => {
    const mockCell = jest.fn();
    const mockMenuClick = jest.fn();
    const menus: TooltipOperatorMenuItems = [
      { key: 'asc', icon: 'groupAsc', label: '组内升序' },
      { key: 'desc', icon: 'groupDesc', label: '组内降序' },
      { key: 'none', label: '不排序' },
    ];

    const { asFragment, getByText } = render(
      <TooltipOperator
        menu={{
          items: menus,
          onClick: mockMenuClick,
          defaultSelectedKeys: [menus[0].key],
        }}
        key={'tooltipOperator'}
        cell={mockCell as unknown as S2CellType}
        onlyShowOperator={true}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('组内升序')).toBeTruthy();
    expect(getByText('不排序').className).toContain('ant-menu-title-content');
  });

  test('render hide icon: TooltipOperator', () => {
    const hiddenMenus: TooltipOperatorMenuItem<
      React.ReactNode,
      React.ReactNode
    >[] = [
      {
        key: 'hiddenColumns',
        label: '隐藏',
        icon: 'EyeOutlined',
        onClick: jest.fn(),
      },
    ];

    const { asFragment, getByText, container } = render(
      <TooltipOperator
        onlyShowOperator={false}
        menu={{
          items: hiddenMenus,
        }}
        cell={jest.fn() as unknown as S2CellType}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('隐藏').className).toContain('ant-menu-title-content');
    expect(container.querySelector('svg')!.getAttribute('data-icon')).toBe(
      'eye',
    );
  });

  test('render custom react component icon', () => {
    const hiddenMenus: TooltipOperatorMenuItems = [
      {
        key: 'react component icon',
        label: 'react component icon',
        icon: <DownCircleOutlined />,
        onClick: jest.fn(),
      },
    ];

    const { asFragment, container } = render(
      <TooltipOperator
        onlyShowOperator={false}
        menu={{
          items: hiddenMenus,
        }}
        cell={jest.fn() as unknown as S2CellType}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.anticon-down-circle')).toBeTruthy();
  });

  test('render TooltipDetail', () => {
    const list: TooltipDetailListItem[] = [
      {
        name: '20岁以下',
        value: '20.5%',
      },
    ];

    const { asFragment, getByText } = render(<TooltipDetail list={list} />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('20岁以下')).toBeTruthy();
    expect(getByText('20.5%').className).toContain('antv-s2-tooltip-highlight');
  });

  test('render TooltipHead', () => {
    const cols: TooltipDetailListItem[] = [
      { name: '所在城市', value: '一二线城市' },
    ];

    const rows: TooltipDetailListItem[] = [
      { name: '类别', value: '有信用卡' },
      { name: '职业', value: '学生' },
      { name: '年龄分布', value: '20岁以下' },
    ];

    const { asFragment, getByText } = render(
      <TooltipHead cols={cols} rows={rows} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('一二线城市，有信用卡/学生/20岁以下')).toBeTruthy();
  });

  test('render TooltipSummary', () => {
    const summaries: TooltipSummaryOptions[] = [
      { name: 'A人群', selectedData: Array(30), value: '495.48 %' },
      { name: 'B人群', selectedData: Array(30), value: '494.52%' },
      { name: '差值', selectedData: Array(30), value: '+381%' },
    ];

    const { asFragment, getByText } = render(
      <TooltipSummary summaries={summaries} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('90 项')).toBeTruthy();
    expect(getByText('495.48 %').className).toContain(
      'antv-s2-tooltip-summary-val antv-s2-tooltip-bold',
    );
  });
});

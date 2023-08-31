import * as mockDataConfig from 'tests/data/simple-data.json';
import {
  BaseTooltip,
  getTooltipOperatorSortMenus,
  SpreadSheet,
  type S2CellType,
  type TooltipOperatorMenu,
} from '@antv/s2';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { CustomTooltip, TooltipComponent } from '../../../../src';
import { MobileSheet } from '../../../../src/components/sheets/mobile-sheet';
import { TooltipOperator } from '../../../../src/components/tooltip/components/operator';
import { TooltipDetail } from '../../../../src/components/tooltip/components/detail';
import { TooltipHead } from '../../../../src/components/tooltip/components/head-info';
import { TooltipSummary } from '../../../../src/components/tooltip/components/summary';

describe('Tooltip Component Tests', () => {
  // https://github.com/antvis/S2/issues/1716
  test.each(getTooltipOperatorSortMenus())(
    'should render sort menu and select %o menu',
    ({ key, text }) => {
      const { asFragment } = render(
        <TooltipComponent
          options={{
            onlyShowOperator: true,
            operator: {
              menus: getTooltipOperatorSortMenus(),
              defaultSelectedKeys: [key],
            },
          }}
          cell={null as unknown as S2CellType}
          position={{ x: 0, y: 0 }}
        />,
      );

      expect(asFragment).toMatchSnapshot();

      expect(screen.getByText('组内升序')).toBeDefined();
      expect(screen.getByText('组内降序')).toBeDefined();
      expect(screen.getByText('不排序')).toBeDefined();

      const selectedMenu = Array.from(
        document.querySelectorAll('.ant-menu-item-selected'),
      );

      expect(selectedMenu).toHaveLength(1);
      expect(selectedMenu[0]?.textContent).toContain(text);
    },
  );
});

describe('Tooltip Common Components Tests', () => {
  test('custom tooltip instance of CustomTooltip', async () => {
    let s2: SpreadSheet;

    render(
      <MobileSheet
        dataCfg={mockDataConfig}
        options={{ height: 300 }}
        onMounted={(s) => {
          s2 = s;
        }}
      />,
    );

    await waitFor(() => {
      s2!.showTooltip({ position: { x: 0, y: 0 }, content: '111' });
      expect(s2!.tooltip).toBeInstanceOf(CustomTooltip);
      expect(s2!.tooltip).toBeInstanceOf(BaseTooltip);
    });
  });

  test('render sort tooltip: TooltipOperator', () => {
    const mockCell = jest.fn();
    const mockMenuClick = jest.fn();
    const menus = [
      { key: 'asc', icon: 'groupAsc', text: '组内升序' },
      { key: 'desc', icon: 'groupDesc', text: '组内降序' },
      { key: 'none', text: '不排序' },
    ];

    const { asFragment, getByText } = render(
      <TooltipOperator
        menus={menus}
        key={'tooltipOperator'}
        cell={mockCell as unknown as S2CellType}
        onlyShowOperator={true}
        onClick={mockMenuClick}
        defaultSelectedKeys={[menus[0].key]}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('组内升序')).toBeTruthy();
    expect(getByText('不排序').className).toContain(
      'antv-s2-tooltip-operator-text',
    );
  });

  test('render hide icon: TooltipOperator', () => {
    const hiddenMenus = [
      {
        key: 'hiddenColumns',
        text: '隐藏',
        icon: 'EyeOutlined',
        onClick: 'ƒ onClick() {}',
      },
    ] as unknown as TooltipOperatorMenu[];

    const { asFragment, getByText, container } = render(
      <TooltipOperator
        onlyShowOperator={false}
        menus={hiddenMenus}
        cell={jest.fn() as unknown as S2CellType}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('隐藏').className).toContain(
      'antv-s2-tooltip-operator-text',
    );
    expect(container.querySelector('svg')!.getAttribute('data-icon')).toBe(
      'eye',
    );
  });

  test('render TooltipDetail', () => {
    const list = [
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
    const cols = [{ name: '所在城市', value: '一二线城市' }];
    const rows = [
      { name: '类别', value: '有信用卡' },
      { name: '职业', value: '学生' },
      { name: '年龄分布', value: '20岁以下' },
    ];

    const { asFragment, getByText } = render(
      <TooltipHead cols={cols} rows={rows} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('一二线城市，有信用卡 / 学生 / 20岁以下')).toBeTruthy();
  });

  test('render TooltipSummary', () => {
    const summaries = [
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

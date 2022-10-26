import { render } from '@testing-library/react';
import React from 'react';
import { BaseTooltip } from '@antv/s2/src';
import { MobileSheetComponent } from '../../../../../src/components/sheets/mobile-sheet';
import { CustomTooltip } from '../../../../../src';
import { TooltipOperator } from '../../../../../src/components/tooltip/components/operator';
import * as mockDataConfig from '../../../../data/simple-data.json';
import { TooltipDetail } from '../../../../../src/components/tooltip/components/detail';
import { TooltipHead } from '../../../../../src/components/tooltip/components/head-info';
import { TooltipSummary } from '../../../../../src/components/tooltip/components/summary';

describe('Tooltip Common Tests', () => {
  test('custom tooltip instance of CustomTooltip', () => {
    let s2;
    render(
      <MobileSheetComponent
        dataCfg={mockDataConfig}
        options={{ height: 300 }}
        onMounted={(s) => {
          s2 = s;
        }}
      />,
    );

    s2.showTooltip({ position: { x: 0, y: 0 }, content: '111' });
    expect(s2.tooltip).toBeInstanceOf(CustomTooltip);
    expect(s2.tooltip).toBeInstanceOf(BaseTooltip);
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
        cell={mockCell}
        onlyMenu={true}
        onClick={mockMenuClick}
        defaultSelectedKeys={menus[0].key}
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
    ];

    const { asFragment, getByText, container } = render(
      <TooltipOperator onlyMenu={false} menus={hiddenMenus} cell={jest.fn()} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('隐藏').className).toContain(
      'antv-s2-tooltip-operator-text',
    );
    expect(container.querySelector('svg').getAttribute('data-icon')).toBe(
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

// describe('Mobile Tooltip Tests', function () {
//
// });

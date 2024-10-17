import { AdvancedSort } from '@/components';
import { StepForwardOutlined } from '@ant-design/icons';
import type { BaseDataSet } from '@antv/s2';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { getMockSheetInstance } from '../../../../../s2-react/__tests__/util/helpers';

describe('AdvancedSort Component Tests', () => {
  const sheetInstance = getMockSheetInstance();

  sheetInstance.dataCfg = {
    data: [],
    fields: {
      rows: ['a', 'b'],
      columns: ['c', 'd'],
      values: ['e', 'f'],
    },
  };
  sheetInstance.dataSet = {
    ...sheetInstance.dataCfg,
    getFieldName: jest.fn(),
    getDimensionValues: jest.fn(),
  } as unknown as BaseDataSet;

  test('should render component', () => {
    const { asFragment, container } = render(
      <AdvancedSort sheetInstance={sheetInstance} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('高级排序')).toBeDefined();
    expect(container.querySelector('.antv-s2-advanced-sort-btn')).toBeDefined();
  });

  test('should render custom icon and text', () => {
    const { asFragment, container } = render(
      <AdvancedSort
        icon={<StepForwardOutlined />}
        text="自定义"
        className="test"
        sheetInstance={sheetInstance}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.test')).toBeDefined();
    expect(container.querySelector('.anticon-step-forward')).toBeDefined();
    expect(screen.getByText('自定义')).toBeDefined();
  });

  test('should open sort panel', () => {
    const onSortOpen = jest.fn();
    const onSortConfirm = jest.fn();

    render(
      <AdvancedSort
        sheetInstance={sheetInstance}
        onSortOpen={onSortOpen}
        onSortConfirm={onSortConfirm}
      />,
    );

    fireEvent.click(screen.getByText('高级排序'));

    expect(screen.getByText('可选字段')).toBeDefined();
    expect(onSortOpen).toHaveBeenCalledTimes(1);
  });
});

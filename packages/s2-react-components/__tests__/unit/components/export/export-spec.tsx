import { Export, StrategyExport } from '@/components';
import type { BaseFacet } from '@antv/s2';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { getMockSheetInstance } from '../../../../../s2-react/__tests__/util/helpers';

describe('Export Component Tests', () => {
  const sheetInstance = getMockSheetInstance();

  sheetInstance.options = {
    interaction: {
      copy: {
        enable: true,
      },
    },
  };

  sheetInstance.facet = {
    getRowLeafNodes: jest.fn(() => []),
    getColLeafNodes: jest.fn(() => []),
    getLayoutResult: jest.fn(() => ({})),
  } as unknown as BaseFacet;

  sheetInstance.dataCfg = {
    data: [],
    fields: {
      rows: [],
      columns: [],
      values: [],
    },
  };

  test('should render default component', () => {
    const { asFragment, container } = render(
      <Export className="test" sheetInstance={sheetInstance} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.anticon-more')).toBeDefined();
    expect(container.querySelector('.test')).toBeDefined();
  });

  test('should render component for strategy export', () => {
    const { asFragment, container } = render(
      <StrategyExport sheetInstance={sheetInstance} />,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(container.querySelector('.anticon-more')).toBeDefined();
  });

  test('should render custom children', () => {
    const { asFragment } = render(
      <Export sheetInstance={sheetInstance} dropdown={{ open: true }}>
        <div>入口</div>
      </Export>,
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('入口')).toBeDefined();
  });

  test('should trigger copy handler', async () => {
    const onCopySuccess = jest.fn();

    render(
      <Export
        sheetInstance={sheetInstance}
        onCopySuccess={onCopySuccess}
        dropdown={{ open: true }}
      />,
    );

    fireEvent.click(screen.getByText('复制原始数据'));
    fireEvent.click(screen.getByText('复制格式化数据'));

    await waitFor(() => {
      expect(onCopySuccess).toHaveBeenCalledTimes(2);
    });
  });

  test('should trigger export handler', async () => {
    const onDownloadSuccess = jest.fn();

    render(
      <Export
        sheetInstance={sheetInstance}
        onDownloadSuccess={onDownloadSuccess}
        dropdown={{ open: true }}
      />,
    );

    fireEvent.click(screen.getByText('下载原始数据'));
    fireEvent.click(screen.getByText('下载格式化数据'));

    await waitFor(() => {
      expect(onDownloadSuccess).toHaveBeenCalledTimes(2);
    });
  });
});

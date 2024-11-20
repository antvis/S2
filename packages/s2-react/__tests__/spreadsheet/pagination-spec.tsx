import { type S2DataConfig, type SpreadSheet } from '@antv/s2';
import { render, waitFor } from '@testing-library/react';
import { Pagination } from 'antd';
import React from 'react';
import type { Root } from 'react-dom/client';
import { pivotSheetDataCfg } from '../../playground/config';
import { SheetComponent, type SheetComponentProps } from '../../src';
import * as mockDataConfig from '../data/simple-data.json';
import { renderComponent } from '../util/helpers';

const s2Options: SheetComponentProps['options'] = {
  width: 600,
  height: 200,
  pagination: {
    current: 1,
    pageSize: 1,
  },
  hierarchyType: 'grid',
};

let s2: SpreadSheet;

describe('Pagination Tests', () => {
  let unmount: Root['unmount'];

  afterEach(() => {
    unmount?.();
  });

  test('should render with antd <Pagination/> component', async () => {
    const { container, asFragment } = render(
      <SheetComponent
        options={s2Options}
        dataCfg={mockDataConfig as S2DataConfig}
      >
        {({ pagination }) => (
          <Pagination
            size="small"
            showTotal={(total) => `共计 ${total} 条`}
            showSizeChanger={false}
            showQuickJumper
            {...pagination}
          />
        )}
      </SheetComponent>,
    );

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
      expect(
        container.querySelector('.ant-pagination-options-quick-jumper'),
      ).toBeTruthy();
      expect(
        container.querySelector('.ant-pagination-options-size-changer'),
      ).toBeFalsy();
    });
  });

  test('should row header cell render text position based on the actual cell height when pagination is show', async () => {
    renderComponent(
      <SheetComponent
        options={{
          ...s2Options,
          height: 400,
        }}
        dataCfg={pivotSheetDataCfg}
        onMounted={(instance) => {
          s2 = instance;
        }}
      >
        {({ pagination }) => <Pagination size="small" {...pagination} />}
      </SheetComponent>,
    );

    await waitFor(() => {
      const rowCell = s2.facet.getRowCells()[0];

      expect(rowCell.getTextShape().parsedStyle.y).toBe(15);
    });
  });
});

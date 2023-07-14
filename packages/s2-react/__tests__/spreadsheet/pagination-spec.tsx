import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { LangType, S2Options, setLang, SpreadSheet } from '@antv/s2';
import { getContainer, sleep } from 'tests/util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import { pivotSheetDataCfg } from '../../playground/config';
import { SheetComponent } from '../../src';
import 'antd/dist/antd.min.css';

const s2Options: S2Options = {
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
  let container: HTMLDivElement;
  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    container?.remove();
  });

  // https://github.com/antvis/S2/issues/1697
  test.each([
    {
      locale: 'zh_CN',
      page: '1 条/页',
      count: '共计2条',
    },
    {
      locale: 'en_US',
      page: '1 / page',
      count: 'Total2',
    },
  ] as Array<{ locale: LangType; page: string; count: string }>)(
    'should render locale text for %o',
    ({ locale, page, count }) => {
      setLang(locale);

      act(() => {
        ReactDOM.render(
          <SheetComponent
            options={s2Options}
            dataCfg={mockDataConfig as any}
            showPagination
          />,
          container,
        );
      });

      expect(document.querySelector('.antv-s2-pagination')).toMatchSnapshot();
      expect(
        document.querySelector('.ant-select-selection-item')?.innerHTML,
      ).toEqual(page);
      expect(
        document.querySelector('.antv-s2-pagination-count')?.innerHTML,
      ).toEqual(count);
    },
  );

  test('should receive antd <Pagination/> component extra props', () => {
    act(() => {
      ReactDOM.render(
        <SheetComponent
          options={{
            ...s2Options,
            pagination: {
              ...s2Options.pagination,
              current: 2,
              showSizeChanger: false,
              showQuickJumper: true,
              size: 'large',
            },
          }}
          dataCfg={mockDataConfig as any}
          showPagination
        />,
        container,
      );
    });

    expect(document.querySelector('.antv-s2-pagination')).toMatchSnapshot();
    expect(
      document.querySelector('.ant-pagination-options-quick-jumper'),
    ).toBeTruthy();
    expect(
      document.querySelector('.ant-pagination-options-size-changer'),
    ).toBeFalsy();
  });

  test('should row header cell render text position based on the actual cell height when pagination is show', async () => {
    act(() => {
      ReactDOM.render(
        <SheetComponent
          options={{
            ...s2Options,
            pagination: {
              ...s2Options.pagination,
              current: 1,
              pageSize: 1,
            },
            height: 400,
          }}
          dataCfg={pivotSheetDataCfg as any}
          onMounted={(instance) => {
            s2 = instance;
          }}
          showPagination
        />,
        container,
      );
    });

    await sleep(1000);

    expect(
      s2.foregroundGroup.cfg.children[0].headerConfig.data[0].belongsCell
        .textShapes[0].attrs.y,
    ).toBe(9);
  });
});

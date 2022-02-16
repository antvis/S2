import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Options, SpreadSheet } from '@antv/s2';
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { omit } from 'lodash';
import { usePagination } from '@/hooks';
import { BaseSheetComponentProps } from '@/components/sheets/interface';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
  pagination: {
    current: 1,
    pageSize: 5,
  },
};

describe('usePagination tests', () => {
  let s2: SpreadSheet;

  const props: BaseSheetComponentProps = {
    options: s2Options,
    dataCfg: mockDataConfig,
  };

  const propsWithoutPagination: BaseSheetComponentProps = {
    options: omit(s2Options, 'pagination'),
    dataCfg: mockDataConfig,
  };

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.render();
  });

  test('should be defined', () => {
    const { result } = renderHook(() => usePagination(s2, props));

    expect(result.current).toBeDefined();
  });

  test('should get default pagination', () => {
    const { result } = renderHook(() =>
      usePagination(null, propsWithoutPagination),
    );

    expect(result.current.total).toEqual(0);
    expect(result.current.current).toEqual(1);
    expect(result.current.pageSize).toEqual(10);
  });

  test('should update pagination', () => {
    const { result } = renderHook(() => usePagination(s2, props));
    expect(result.current.current).toEqual(1);
    expect(result.current.pageSize).toEqual(5);

    act(() => {
      result.current.setCurrent(2);
      result.current.setPageSize(15);
      result.current.setTotal(10); // won't change total
    });
    expect(result.current.current).toEqual(2);
    expect(result.current.pageSize).toEqual(15);
    expect(result.current.total).toEqual(2); // 浙江-杭州、浙江-义乌

    act(() => {
      result.current.setTotal(10);
    });
    expect(result.current.total).toEqual(10);
  });

  test('should update total after render with new data', () => {
    const { result } = renderHook(() => usePagination(s2, props));

    expect(result.current.total).toBe(2); // 浙江-杭州、浙江-义乌

    act(() => {
      const newData = [
        ...mockDataConfig.data,
        {
          province: '浙江',
          city: '台州',
          type: '笔',
          price: '18',
        },
      ];
      s2.setDataCfg({
        ...mockDataConfig,
        data: newData,
      });
      s2.render();
    });
    expect(result.current.total).toBe(3);
  });
});

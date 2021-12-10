import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Options, SpreadSheet } from '@antv/s2';
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { usePagination } from '@/hooks';
import { BaseSheetComponentProps } from '@/components/sheets/interface';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

describe('usePagination tests', () => {
  let s2: SpreadSheet;

  const props: BaseSheetComponentProps = {
    options: s2Options,
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
    const { result } = renderHook(() => usePagination(s2, props));

    expect(result.current.total).toEqual(0);
    expect(result.current.current).toEqual(1);
    expect(result.current.pageSize).toEqual(10);
  });

  test('should update pagination', () => {
    const { result } = renderHook(() => usePagination(s2, props));

    act(() => {
      result.current.setCurrent(2);
      result.current.setPageSize(5);
      result.current.setTotal(10);
    });

    expect(result.current.total).toEqual(10);
    expect(result.current.current).toEqual(2);
    expect(result.current.pageSize).toEqual(5);
  });
});

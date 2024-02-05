import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, type S2Options, SpreadSheet } from '@antv/s2';
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { omit } from 'lodash';
import { usePagination } from '@/hooks';
import type { SheetComponentsProps } from '@/components/sheets/interface';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hd: false,
  pagination: {
    current: 1,
    pageSize: 5,
  },
};

describe('usePagination tests', () => {
  let s2: SpreadSheet;

  const props: SheetComponentsProps = {
    options: s2Options as SheetComponentsProps['options'],
    dataCfg: mockDataConfig,
  };

  const propsWithoutPagination: SheetComponentsProps = {
    options: omit(s2Options as SheetComponentsProps['options'], 'pagination'),
    dataCfg: mockDataConfig,
  };

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options as S2Options);
    await s2.render();
  });

  test('should be defined', () => {
    const { result } = renderHook(() => usePagination(s2, props));

    expect(result.current).toBeDefined();
  });

  test('should get default pagination', () => {
    const { result } = renderHook(() =>
      usePagination(null as unknown as SpreadSheet, propsWithoutPagination),
    );

    expect(result.current.pagination).toEqual({
      total: 0,
      current: 1,
      pageSize: 10,
    });
  });

  test('should update pagination', () => {
    const { result } = renderHook(() => usePagination(s2, props));

    expect(result.current.pagination.current).toEqual(1);
    expect(result.current.pagination.pageSize).toEqual(5);

    act(() => {
      result.current.onChange(2, 15);
    });
    expect(result.current.pagination.current).toEqual(2);
    expect(result.current.pagination.pageSize).toEqual(15);
  });

  test('should update total after render with new data', async () => {
    let s2Instance = s2;
    const { result, rerender } = renderHook(() =>
      usePagination(s2Instance, props),
    );

    expect(result.current.pagination.total).toBe(0);

    await act(async () => {
      // 触发内部更新
      s2Instance = new PivotSheet(getContainer(), mockDataConfig, s2Options);
      await s2Instance.render();

      rerender();
    });
    expect(result.current.pagination.total).toBe(2);

    await act(async () => {
      const newData = [
        ...mockDataConfig.data,
        {
          province: '浙江',
          city: '台州',
          type: '笔',
          price: '18',
        },
      ];

      s2Instance.setDataCfg({
        ...mockDataConfig,
        data: newData,
      });
      await s2Instance.render();
    });
    expect(result.current.pagination.total).toBe(3);
  });
});

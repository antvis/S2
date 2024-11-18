import type { SheetComponentProps } from '@/components/sheets/interface';
import { usePagination } from '@/hooks';
import { PivotSheet, SpreadSheet, type S2Options } from '@antv/s2';
import { act, renderHook } from '@testing-library/react-hooks';
import { omit } from 'lodash';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';

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

  const props: SheetComponentProps = {
    options: s2Options as SheetComponentProps['options'],
    dataCfg: mockDataConfig,
  };

  const propsWithoutPagination: SheetComponentProps = {
    options: omit(s2Options as SheetComponentProps['options'], 'pagination'),
    dataCfg: mockDataConfig,
  };

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options as S2Options);
    await s2.render();
  });

  test('should be defined', () => {
    const { result } = renderHook(() => usePagination(s2, props.options));

    expect(result.current).toBeDefined();
  });

  test('should get default pagination', () => {
    const { result } = renderHook(() =>
      usePagination(
        null as unknown as SpreadSheet,
        propsWithoutPagination.options,
      ),
    );

    expect(result.current).toEqual({
      total: 0,
      current: 1,
      pageSize: 10,
      onChange: expect.any(Function),
      onShowSizeChange: expect.any(Function),
    });
  });

  test('should update pagination for page size change', () => {
    const { result } = renderHook(() => usePagination(s2, props.options));

    expect(result.current.current).toEqual(1);
    expect(result.current.pageSize).toEqual(5);

    act(() => {
      result.current.onChange(2, 15);
    });
    expect(result.current.current).toEqual(2);
    expect(result.current.pageSize).toEqual(15);
  });

  test('should update pagination for show size change', () => {
    const { result } = renderHook(() => usePagination(s2, props.options));

    expect(result.current.current).toEqual(1);
    expect(result.current.pageSize).toEqual(5);

    act(() => {
      result.current.onShowSizeChange(2, 15);
    });

    expect(result.current.current).toEqual(2);
    expect(result.current.pageSize).toEqual(15);
  });

  test('should update total after render with new data', async () => {
    let s2Instance = s2;
    const { result, rerender } = renderHook(() =>
      usePagination(s2Instance, props.options),
    );

    expect(result.current.total).toBe(2);

    await act(async () => {
      // 触发内部更新
      s2Instance = new PivotSheet(getContainer(), mockDataConfig, s2Options);
      await s2Instance.render();

      rerender();
    });

    expect(result.current.total).toBe(2);

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

    expect(result.current.total).toBe(3);
  });
});

import { usePivotSheetUpdate } from '@/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

const getPartDrillDownConfig = () => {
  return {
    drillConfig: {
      dataSet: [
        {
          name: '城市',
          value: 'city',
        },
      ],
    },
    fetchData: () =>
      Promise.resolve({
        drillData: [],
        drillField: 'city',
      }),
    drillItemsNum: 1,
  };
};

describe('usePivotSheetUpdate tests', () => {
  test('should update callback when only attr change', () => {
    let config = getPartDrillDownConfig();
    const { result, rerender } = renderHook(() => usePivotSheetUpdate(config));

    const firstCallback = result.current;

    act(() => {
      config = { ...config };
      rerender();
    });
    // 改变外层引用不更新 callback
    expect(result.current).toEqual(firstCallback);

    act(() => {
      config = { ...config, drillItemsNum: 3 };
      rerender();
    });
    // 改变属性，更新 callback
    expect(result.current).not.toEqual(firstCallback);
  });

  test('should callback return correct reload mode', () => {
    let config = getPartDrillDownConfig();
    const { result, rerender } = renderHook(() => usePivotSheetUpdate(config));

    act(() => {
      // 改变属性，更新 callback
      config = { ...config, drillItemsNum: 3 };
      rerender();
    });

    // 执行第一次，reload 为 true
    let callbackResult = result.current({
      reloadData: false,
      rebuildDataSet: false,
    });

    expect(callbackResult).toEqual({ reloadData: true, rebuildDataSet: false });

    // 执行第二次，reload 为 false
    callbackResult = result.current({
      reloadData: false,
      rebuildDataSet: false,
    });
    expect(callbackResult).toEqual({
      reloadData: false,
      rebuildDataSet: false,
    });
  });
});

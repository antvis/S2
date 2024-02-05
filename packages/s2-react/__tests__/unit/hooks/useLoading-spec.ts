import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Event, type S2Options, SpreadSheet } from '@antv/s2';
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { useLoading } from '@/hooks';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hd: false,
};

describe('useLoading tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
  });

  test('should be defined', () => {
    const { result } = renderHook(() => useLoading(s2));

    expect(result.current).toBeDefined();
  });

  test('should update loading state', () => {
    const { result } = renderHook(() => useLoading(s2));

    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBeTruthy();
  });

  test('should use config loading state with true', () => {
    const { result } = renderHook(() => useLoading(s2, true));

    expect(result.current.loading).toBeTruthy();

    act(() => {
      result.current.setLoading(false);
    });

    // use props loading first
    expect(result.current.loading).toBeTruthy();
  });

  test('should use config loading state with false', () => {
    const { result } = renderHook(() => useLoading(s2, false));

    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.setLoading(true);
    });

    // use props loading first
    expect(result.current.loading).toBeFalsy();
  });

  test('should update loading state when render', () => {
    const { result } = renderHook(() => useLoading(s2));

    act(() => {
      s2.emit(S2Event.LAYOUT_BEFORE_RENDER);
    });

    expect(result.current.loading).toBeTruthy();

    act(() => {
      s2.emit(S2Event.LAYOUT_AFTER_RENDER);
    });

    expect(result.current.loading).toBeFalsy();
  });
});

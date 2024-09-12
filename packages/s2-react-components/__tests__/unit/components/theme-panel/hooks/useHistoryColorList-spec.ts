import { useHistoryColorList } from '@/components/theme-panel/hooks/useHistoryColorList';
import { act, renderHook } from '@testing-library/react-hooks';

describe('useHistoryColorList test', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should set history color', () => {
    const { result } = renderHook(() => useHistoryColorList('red'));

    expect(result.current).toEqual(['red']);
  });

  test('should set history color by default max limit', () => {
    const { result, rerender } = renderHook(
      (color) => useHistoryColorList(color),
      { initialProps: 'red' },
    );

    act(() => {
      ['#000', '#123', '#777'].forEach((color) => {
        rerender(color);
      });
    });

    expect(result.current).toEqual(['#777', 'red']);
  });
});

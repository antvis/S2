import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Event, S2Options, SpreadSheet } from '@antv/s2';
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { Event as GEvent } from '@antv/g-canvas';
import { BaseSheetComponentProps } from '../../../src/components';
import { useResize } from '@/hooks';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

describe('useResize tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
  });

  test('should be defined', () => {
    const { result } = renderHook(() =>
      useResize({
        container: null,
        s2,
        adaptive: false,
      }),
    );

    expect(result.current).toBeDefined();
  });

  test('should rerender when option width or height changed and adaptive disable', () => {
    const { rerender } = renderHook(() =>
      useResize({
        container: null,
        s2,
        adaptive: false,
      }),
    );

    expect(s2.options.width).toEqual(s2Options.width);
    expect(s2.options.height).toEqual(s2Options.height);

    act(() => {
      s2.setOptions({ width: 300, height: 400 });
    });

    rerender();

    const canvas = s2.container.get('el') as HTMLCanvasElement;
    expect(s2.options.width).toEqual(300);
    expect(s2.options.height).toEqual(400);

    expect(canvas.style.width).toEqual(`1000px`);
    expect(canvas.style.height).toEqual(`500px`);
  });
});

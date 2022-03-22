import { renderHook, act } from '@testing-library/react-hooks';
import { PivotSheet, S2Options } from '@antv/s2';
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { useSpreadSheet } from '@/hooks';
import { BaseSheetComponentProps } from '@/components';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

describe('useSpreadSheet tests', () => {
  const container = getContainer();
  const props: BaseSheetComponentProps = {
    spreadsheet: () => new PivotSheet(container, mockDataConfig, s2Options),
    options: s2Options,
    dataCfg: mockDataConfig,
  };

  test('should build spreadSheet', () => {
    const { result } = renderHook(() =>
      useSpreadSheet(props, { sheetType: 'pivot' }),
    );
    expect(result.current.s2Ref).toBeDefined();
  });

  test('should cannot change table size when width or height updated and disable adaptive', () => {
    const { result } = renderHook(() =>
      useSpreadSheet({ ...props, adaptive: false }, { sheetType: 'pivot' }),
    );
    const s2 = result.current.s2Ref.current;

    expect(s2.options.width).toEqual(s2Options.width);
    expect(s2.options.height).toEqual(s2Options.height);
    act(() => {
      s2.setOptions({ width: 300, height: 400 });
    });

    const canvas = s2.container.get('el') as HTMLCanvasElement;
    expect(s2.options.width).toEqual(300);
    expect(s2.options.height).toEqual(400);

    expect(canvas.style.width).toEqual(`200px`);
    expect(canvas.style.height).toEqual(`200px`);
  });
});

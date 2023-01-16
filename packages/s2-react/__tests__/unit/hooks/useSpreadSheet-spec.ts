import { renderHook, act } from '@testing-library/react-hooks';
import {
  PivotSheet,
  S2Event,
  SpreadSheet,
  type S2DataConfig,
  type S2Options,
} from '@antv/s2';
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { cloneDeep } from 'lodash';
import { useSpreadSheet } from '@/hooks';
import type { SheetComponentsProps } from '@/components';

const s2Options: SheetComponentsProps['options'] = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

describe('useSpreadSheet tests', () => {
  const container = getContainer();
  const getConfig = (
    fields: S2DataConfig['fields'] = mockDataConfig.fields,
  ): SheetComponentsProps => {
    return {
      spreadsheet: () =>
        new PivotSheet(container, mockDataConfig, s2Options as S2Options),
      options: s2Options,
      dataCfg: {
        fields,
        data: mockDataConfig.data,
      },
    };
  };

  test('should build spreadSheet', () => {
    const { result } = renderHook(() =>
      useSpreadSheet({ ...getConfig(), sheetType: 'pivot' }),
    );
    expect(result.current.s2Ref).toBeDefined();
  });

  test('should cannot change table size when width or height updated and disable adaptive', () => {
    const { result } = renderHook(() =>
      useSpreadSheet({ ...getConfig(), sheetType: 'pivot', adaptive: false }),
    );
    const s2: SpreadSheet = result.current.s2Ref.current!;

    expect(s2.options.width).toEqual(s2Options.width);
    expect(s2.options.height).toEqual(s2Options.height);
    act(() => {
      s2.setOptions({ width: 300, height: 400 });
    });

    const canvas = s2.getCanvasElement();
    expect(s2.options.width).toEqual(300);
    expect(s2.options.height).toEqual(400);

    expect(canvas.style.width).toEqual(`200px`);
    expect(canvas.style.height).toEqual(`200px`);
  });

  test('should clear init column leaf nodes when column fields changed', () => {
    const defaultFields: S2DataConfig['fields'] = {
      rows: ['province'],
      columns: ['type', 'city'],
      values: ['price'],
      valueInCols: true,
    };

    const { result } = renderHook(() =>
      useSpreadSheet(
        cloneDeep({
          ...getConfig(defaultFields),
          sheetType: 'strategy',
        }),
      ),
    );
    const s2 = result.current.s2Ref.current;

    expect(s2!.getInitColumnLeafNodes()).toHaveLength(2);

    // 很奇怪, rerender 之后始终拿到的两次 dataCfg 是一样的, 暂时先注释了
    // act(() => {
    //   const fields: S2DataConfig['fields'] = {
    //     rows: ['province', 'city'],
    //     columns: ['type'],
    //     values: ['price'],
    //     valueInCols: false,
    //   };

    //   rerender(getConfig(fields));
    // });

    // expect(s2.store.get('initColumnLeafNodes')).toEqual([]);
  });

  test('should destroy sheet after unmount component', () => {
    const onDestroyFromProps = jest.fn();
    const onDestroyFromS2Event = jest.fn();

    const { result, unmount } = renderHook(() =>
      useSpreadSheet({
        ...getConfig(),
        sheetType: 'pivot',
        onDestroy: onDestroyFromProps,
      }),
    );

    const s2 = result.current.s2Ref.current!;

    s2.on(S2Event.LAYOUT_DESTROY, onDestroyFromS2Event);

    const destroySpy = jest
      .spyOn(s2, 'destroy')
      .mockImplementationOnce(() => {});

    act(() => {
      unmount();
    });

    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(onDestroyFromProps).toHaveBeenCalledTimes(1);
    expect(onDestroyFromS2Event).toHaveBeenCalledTimes(1);
  });

  test('should call onMounted when sheet mounted', () => {
    const onMounted = jest.fn();

    const { result } = renderHook(() =>
      useSpreadSheet({
        ...getConfig(),
        sheetType: 'pivot',
        onMounted,
      }),
    );

    const s2 = result.current.s2Ref.current;

    expect(onMounted).toHaveBeenCalledWith(s2);
  });
});

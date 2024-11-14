import type { SheetComponentProps } from '@/components';
import { useSpreadSheet } from '@/hooks';
import {
  PivotSheet,
  S2Event,
  SpreadSheet,
  type S2DataConfig,
  type S2Options,
} from '@antv/s2';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';

const s2Options: SheetComponentProps['options'] = {
  width: 200,
  height: 200,
  hd: false,
};

describe('useSpreadSheet tests', () => {
  const getConfig = (
    fields: S2DataConfig['fields'] = mockDataConfig.fields,
  ): SheetComponentProps => {
    return {
      sheetType: 'pivot' as const,
      spreadsheet: () =>
        new PivotSheet(getContainer(), mockDataConfig, s2Options as S2Options),
      options: s2Options,
      dataCfg: {
        fields,
        data: mockDataConfig.data,
      },
    };
  };

  test('should build spreadSheet', async () => {
    const props = getConfig();
    const { result } = renderHook(() => useSpreadSheet({ ...props }));

    await waitFor(() => {
      expect(result.current.s2Ref).toBeDefined();
    });
  });

  test('should cannot change table size when width or height updated and disable adaptive', async () => {
    const props = {
      ...getConfig(),
      adaptive: false,
    };
    const { result } = renderHook(() => useSpreadSheet(props));

    let s2: SpreadSheet;

    await waitFor(() => {
      s2 = result.current.s2Ref.current!;

      expect(s2.options.width).toEqual(s2Options.width);
      expect(s2.options.height).toEqual(s2Options.height);
    });

    act(() => {
      s2.setOptions({ width: 300, height: 400 });
    });

    await waitFor(() => {
      const canvas = s2.getCanvasElement();

      expect(s2.options.width).toEqual(300);
      expect(s2.options.height).toEqual(400);

      expect(canvas.style.width).toEqual(`200px`);
      expect(canvas.style.height).toEqual(`200px`);
    });
  });

  test('should clear init column leaf nodes when column fields changed', async () => {
    const defaultFields: S2DataConfig['fields'] = {
      rows: ['province'],
      columns: ['type', 'city'],
      values: ['price'],
      valueInCols: true,
    };

    const props = {
      ...getConfig(defaultFields),
      sheetType: 'strategy' as const,
    };

    const { result, rerender } = renderHook(
      (innerProps) => useSpreadSheet(innerProps),
      { initialProps: props },
    );

    await waitFor(() => {
      const s2 = result.current.s2Ref.current;

      expect(s2).not.toEqual(null);
      expect(s2!.facet.getInitColLeafNodes()).toHaveLength(2);
    });

    act(() => {
      const fields: S2DataConfig['fields'] = {
        ...defaultFields,
        columns: ['type'],
      };

      rerender({
        ...props,
        ...getConfig(fields),
      });
    });

    await waitFor(() => {
      const s2 = result.current.s2Ref.current;

      expect(s2!.facet.getInitColLeafNodes()).toHaveLength(0);
    });
  });

  test('should destroy sheet after unmount component', async () => {
    const onDestroyFromProps = jest.fn();
    const onDestroyFromS2Event = jest.fn();

    const props = {
      ...getConfig(),
      onDestroy: onDestroyFromProps,
    };
    const { result, unmount } = renderHook(() => useSpreadSheet(props));

    let s2: SpreadSheet;

    await waitFor(() => {
      s2 = result.current.s2Ref.current!;
      expect(s2).not.toEqual(null);
    });

    s2!.on(S2Event.LAYOUT_DESTROY, onDestroyFromS2Event);

    const destroySpy = jest
      .spyOn(s2!, 'destroy')
      .mockImplementationOnce(() => {});

    act(() => {
      unmount();
    });

    await waitFor(() => {
      expect(destroySpy).toHaveBeenCalledTimes(1);
      expect(onDestroyFromProps).toHaveBeenCalledTimes(1);
      expect(onDestroyFromS2Event).toHaveBeenCalledTimes(1);
    });
  });

  test('should call onMounted when sheet mounted', async () => {
    const onMounted = jest.fn();

    const props = {
      ...getConfig(),
      onMounted,
    };
    const { result } = renderHook(() => useSpreadSheet(props));

    await waitFor(() => {
      const s2 = result.current.s2Ref.current;

      expect(s2).not.toEqual(null);
      expect(onMounted).toHaveBeenCalledWith(s2);
    });
  });

  test.each([
    {
      updatedProps: {
        options: { width: 200 },
      },
      updateOptions: {
        rebuildDataSet: false,
        reloadData: false,
      },
    },
    {
      updatedProps: {
        themeCfg: { name: 'dark' },
      },
      updateOptions: {
        rebuildDataSet: false,
        reloadData: false,
      },
    },
    {
      updatedProps: {
        dataCfg: { fields: ['test'] },
      },
      updateOptions: {
        rebuildDataSet: false,
        reloadData: true,
      },
    },
  ])(
    'should call onUpdate and onUpdateAfterRender when sheet %o updated',
    async ({ updatedProps, updateOptions }) => {
      const onUpdate = jest.fn();
      const onUpdateAfterRender = jest.fn();

      const props = {
        ...getConfig(),
        onUpdate,
        onUpdateAfterRender,
      };
      const { rerender } = renderHook(
        (innerProps) => useSpreadSheet(innerProps),
        {
          initialProps: props,
        },
      );

      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledTimes(0);
        expect(onUpdateAfterRender).toHaveBeenCalledTimes(0);
      });

      act(() => {
        rerender({ ...props, ...updatedProps });
      });

      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledWith(updateOptions);
        expect(onUpdateAfterRender).toHaveBeenCalledTimes(1);
      });
    },
  );

  test('should use custom render mode by onUpdate', async () => {
    const onUpdate = jest.fn((options) => ({ ...options, reloadData: true }));
    const onUpdateAfterRender = jest.fn();

    const props = {
      ...getConfig(),
      onUpdate,
      onUpdateAfterRender,
    };
    const { rerender } = renderHook(
      (innerProps) => useSpreadSheet(innerProps),
      {
        initialProps: props,
      },
    );

    act(() => {
      rerender({ ...props, options: { width: 300 } });
    });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith({
        rebuildDataSet: false,
        reloadData: false,
      });
      expect(onUpdateAfterRender).toHaveBeenCalledWith({
        rebuildDataSet: false,
        // 由于使用了自定义的 onUpdate，所以这里应该为 true
        reloadData: true,
      });
    });
  });

  test('should trigger onLoading', async () => {
    const onLoading = jest.fn();
    const props = {
      ...getConfig(),
      onLoading,
    };

    renderHook(() => useSpreadSheet({ ...props, sheetType: 'pivot' }));

    expect(onLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(onLoading).toHaveBeenCalledWith(false);
    });
  });
});

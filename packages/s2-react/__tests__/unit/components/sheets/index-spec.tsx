import {
  PivotSheet,
  TableSheet,
  type S2DataConfig,
  type SpreadSheet,
} from '@antv/s2';
import type { SheetType } from '@antv/s2-shared';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { SheetComponent, type SheetComponentsProps } from '../../../../src';
import { getContainer, renderComponent } from '../../../util/helpers';

describe('<SheetComponent/> Tests', () => {
  describe('Render Tests', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = getContainer();
    });

    afterEach(() => {
      container.remove();
    });

    const sheetTypes: SheetType[] = [
      'pivot',
      'table',
      'strategy',
      'gridAnalysis',
      'editable',
    ];

    const commonSheetProps: SheetComponentsProps = {
      // CI 环境和 本地 DPR 不一致
      options: {
        width: 200,
        height: 200,
        transformCanvasConfig() {
          return {
            devicePixelRatio: 2,
          };
        },
      },
      dataCfg: null as unknown as S2DataConfig,
      showPagination: true,
      header: {
        switcher: { open: true },
        export: { open: true },
        advancedSort: { open: true },
      },
    };

    test.each(sheetTypes)(
      'should render successfully for %s sheet',
      async (sheetType) => {
        function init() {
          renderComponent(
            <SheetComponent sheetType={sheetType} {...commonSheetProps} />,
            container,
          );
        }

        await waitFor(() => {
          expect(init).not.toThrow();
        });
      },
    );

    test.each(sheetTypes)(
      'should render %s sheet by snapshot',
      async (sheetType) => {
        const { asFragment } = render(
          <SheetComponent sheetType={sheetType} {...commonSheetProps} />,
        );

        await waitFor(() => {
          expect(asFragment()).toMatchSnapshot();
        });
      },
    );

    test.each(sheetTypes)(
      'should render and destroy for %s sheet',
      async (sheetType) => {
        let onMountedRef: SpreadSheet;

        const onMounted = jest.fn((instance) => {
          onMountedRef = instance;
        });
        const onDestroy = jest.fn();

        const unmount = renderComponent(
          <SheetComponent
            sheetType={sheetType}
            options={{ width: 200, height: 200 }}
            dataCfg={null as unknown as S2DataConfig}
            onMounted={onMounted}
            onDestroy={onDestroy}
          />,
          container,
        );

        await waitFor(() => {
          expect(onMounted).toHaveBeenCalledWith(onMountedRef!);
          expect(onDestroy).not.toHaveBeenCalled();
        });

        unmount?.();

        await waitFor(() => {
          expect(onDestroy).toHaveBeenCalledTimes(1);
        });
      },
    );

    test('should get latest instance after sheet type changed', async () => {
      let spreadSheet: SpreadSheet;

      function Component({
        sheetType,
      }: Pick<SheetComponentsProps, 'sheetType'>) {
        const onMounted = jest.fn((instance) => {
          spreadSheet = instance;
        });

        return (
          <SheetComponent
            sheetType={sheetType}
            options={{ width: 200, height: 200 }}
            dataCfg={null as unknown as S2DataConfig}
            onMounted={onMounted}
          />
        );
      }

      renderComponent(<Component sheetType={'pivot'} />, container);

      await waitFor(() => {
        expect(spreadSheet!).toBeInstanceOf(PivotSheet);
      });

      renderComponent(<Component sheetType={'table'} />, container);

      await waitFor(() => {
        expect(spreadSheet!).toBeInstanceOf(TableSheet);
      });
    });
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  type SpreadSheet,
  type S2DataConfig,
  PivotSheet,
  TableSheet,
} from '@antv/s2';
import { SheetType } from '@antv/s2-shared';
import { render } from '@testing-library/react';
import { SheetComponent, SheetComponentsProps } from '../../../../src';
import { getContainer } from '../../../util/helpers';

describe('<SheetComponent/> Tests', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  describe('Render Tests', () => {
    const sheetTypes: SheetType[] = [
      'pivot',
      'table',
      'strategy',
      'gridAnalysis',
      'editable',
    ];

    const commonSheetProps: SheetComponentsProps = {
      // CI 环境和 本地 DPR 不一致
      options: { width: 200, height: 200, devicePixelRatio: 2 },
      dataCfg: null as unknown as S2DataConfig,
      showPagination: true,
      header: {
        switcherCfg: { open: true },
        exportCfg: { open: true },
        advancedSortCfg: { open: true },
      },
    };

    test.each(sheetTypes)(
      'should render successfully for %s sheet',
      (sheetType) => {
        function init() {
          ReactDOM.render(
            <SheetComponent sheetType={sheetType} {...commonSheetProps} />,
            container,
          );
        }

        expect(init).not.toThrowError();
      },
    );

    test.each(sheetTypes)('should render %s sheet by snapshot', (sheetType) => {
      const { asFragment } = render(
        <SheetComponent sheetType={sheetType} {...commonSheetProps} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    test.each(sheetTypes)(
      'should not throw getSpreadSheet deprecated warning for %s sheet',
      (sheetType) => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementationOnce(() => {});

        act(() => {
          ReactDOM.render(
            <SheetComponent
              sheetType={sheetType}
              options={{ width: 200, height: 200 }}
              dataCfg={null as unknown as S2DataConfig}
            />,
            container,
          );
        });

        expect(warnSpy).not.toHaveBeenCalledWith(
          '[SheetComponent] `getSpreadSheet` is deprecated. Please use `onMounted` instead.',
        );
      },
    );

    test.each(sheetTypes)(
      'should render and destroy for %s sheet',
      (sheetType) => {
        let getSpreadSheetRef: SpreadSheet;
        let onMountedRef: SpreadSheet;

        const getSpreadSheet = jest.fn((instance) => {
          getSpreadSheetRef = instance;
        });
        const onMounted = jest.fn((instance) => {
          onMountedRef = instance;
        });
        const onDestroy = jest.fn();
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementationOnce(() => {});

        act(() => {
          ReactDOM.render(
            <SheetComponent
              sheetType={sheetType}
              options={{ width: 200, height: 200 }}
              dataCfg={null as unknown as S2DataConfig}
              getSpreadSheet={getSpreadSheet}
              onMounted={onMounted}
              onDestroy={onDestroy}
            />,
            container,
          );
        });

        expect(getSpreadSheet).toHaveBeenCalledWith(getSpreadSheetRef);
        expect(onMounted).toHaveBeenCalledWith(onMountedRef);
        expect(onMountedRef).toEqual(getSpreadSheetRef);
        expect(onDestroy).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledWith(
          '[SheetComponent] `getSpreadSheet` is deprecated. Please use `onMounted` instead.',
        );

        act(() => {
          ReactDOM.unmountComponentAtNode(container);
        });

        expect(onDestroy).toHaveBeenCalledTimes(1);
      },
    );

    test('should get latest instance after sheet type changed', () => {
      let s2: SpreadSheet;

      function Component({
        sheetType,
      }: Pick<SheetComponentsProps, 'sheetType'>) {
        const onMounted = jest.fn((instance) => {
          s2 = instance;
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

      act(() => {
        ReactDOM.render(<Component sheetType={'pivot'} />, container);
      });

      expect(s2).toBeInstanceOf(PivotSheet);

      act(() => {
        ReactDOM.render(<Component sheetType={'table'} />, container);
      });

      expect(s2).toBeInstanceOf(TableSheet);
    });
  });
});

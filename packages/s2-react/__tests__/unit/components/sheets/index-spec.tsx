import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  type SpreadSheet,
  type S2DataConfig,
  customMerge,
  CellTypes,
  PivotSheet,
  TableSheet,
} from '@antv/s2';
import { SheetType } from '@antv/s2-shared';
import type { Event as GEvent } from '@antv/g-canvas';
import { SheetComponent, SheetComponentsProps } from '../../../../src';
import { getContainer } from '../../../util/helpers';
import { StrategySheetDataConfig } from '../../../data/strategy-data';

describe('<SheetComponent/> Tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  describe('Render Tests', () => {
    const sheets: SheetType[] = [
      'pivot',
      'table',
      'strategy',
      'gridAnalysis',
      'editable',
    ];

    test.each(sheets)(
      'should render successfully for %s sheet',
      (sheetType) => {
        function render() {
          ReactDOM.render(
            <SheetComponent
              sheetType={sheetType}
              options={{ width: 200, height: 200 }}
              dataCfg={null as unknown as S2DataConfig}
            />,
            container,
          );
        }

        expect(render).not.toThrowError();
      },
    );

    test.each(sheets)('should render and destroy for %s sheet', (sheetType) => {
      let getSpreadSheetRef: SpreadSheet;
      let onMountedRef: SpreadSheet;

      const getSpreadSheet = jest.fn((instance) => {
        getSpreadSheetRef = instance;
      });
      const onMounted = jest.fn((instance) => {
        onMountedRef = instance;
      });
      const onDestroy = jest.fn();

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

      act(() => {
        ReactDOM.unmountComponentAtNode(container);
      });

      expect(onDestroy).toHaveBeenCalledTimes(1);
    });

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

  describe('<StrategySheet/> Tests', () => {
    const renderStrategySheet = (
      options: SheetComponentsProps['options'] | null,
      dataCfg?: S2DataConfig,
    ) => {
      act(() => {
        ReactDOM.render(
          <SheetComponent
            sheetType="strategy"
            options={customMerge(
              {
                width: 200,
                height: 200,
              },
              options,
            )}
            dataCfg={dataCfg as S2DataConfig}
            onMounted={(instance) => {
              s2 = instance;
            }}
          />,
          container,
        );
      });
    };

    test('should overwrite strategy sheet tooltip data cell content', () => {
      const content = 'custom';

      const s2Options: SheetComponentsProps['options'] = {
        tooltip: {
          data: {
            content,
          },
        },
      };

      renderStrategySheet(s2Options);

      expect(s2.options.tooltip.data.content).toEqual(content);
    });

    test('should replace hierarchyType with "customTree" when rows is empty and contains custom tree items', () => {
      const s2Options: SheetComponentsProps['options'] = {
        hierarchyType: 'grid',
      };

      const s2DataConfig: S2DataConfig = {
        data: [],
        fields: {
          rows: [],
          customTreeItems: [
            {
              key: '1',
              title: '1',
            },
          ],
        },
      };

      renderStrategySheet(s2Options, s2DataConfig);

      expect(s2.options.hierarchyType).toEqual('customTree');
    });

    test('should hideMeasureColumn if only one value field', () => {
      const s2Options: SheetComponentsProps['options'] = {
        hierarchyType: 'grid',
      };

      const s2DataConfig: S2DataConfig = {
        data: [],
        fields: {
          values: ['a'],
        },
      };

      renderStrategySheet(s2Options, s2DataConfig);

      expect(s2.options.style.colCfg.hideMeasureColumn).toBeTruthy();
    });

    test('should enable hidden columns operation', () => {
      renderStrategySheet(null);

      expect(s2.options.tooltip.operation.hiddenColumns).toBeTruthy();
    });

    test.each([CellTypes.ROW_CELL, CellTypes.COL_CELL, CellTypes.DATA_CELL])(
      'should overwrite strategy sheet default custom tooltip and render custom %s tooltip',
      (cellType) => {
        const content = `${cellType} test content`;
        const cell = {
          [CellTypes.ROW_CELL]: 'row',
          [CellTypes.COL_CELL]: 'col',
          [CellTypes.DATA_CELL]: 'data',
        }[cellType];

        renderStrategySheet({
          tooltip: {
            showTooltip: true,
            [cell]: {
              content: () => <div>{content}</div>,
            },
          },
        });

        jest.spyOn(s2, 'getCellType').mockReturnValueOnce(cellType);

        s2.showTooltipWithInfo({} as GEvent, []);

        expect(s2.tooltip.container.innerText).toEqual(content);
      },
    );

    test('should render correctly KPI bullet column measure text', () => {
      renderStrategySheet(
        {
          width: 6000,
          height: 600,
        },
        StrategySheetDataConfig,
      );

      // 当前测试数据, 第 4 列是子弹图
      const dataCell = s2.interaction
        .getPanelGroupAllDataCells()
        .filter((cell) => {
          const meta = cell.getMeta();
          return meta.colIndex === 3 && meta.fieldValue;
        });

      const bulletMeasureTextList = dataCell.map((cell) => {
        const textShape = cell
          .getChildren()
          .find((child) => child.cfg.type === 'text');
        return textShape?.attr('text');
      });

      expect(bulletMeasureTextList).toStrictEqual([
        '0.25%',
        '-82.61%',
        '1073.92%',
        '50.00%',
        '9.78%',
      ]);
    });

    test('should format corner date field', () => {
      renderStrategySheet(
        {
          width: 600,
          height: 600,
        },
        {
          ...StrategySheetDataConfig,
          meta: [
            {
              field: 'date',
              name: '日期',
            },
          ],
        },
      );

      const textList = s2.facet.cornerHeader
        .getChildren()
        .map((element) => (element as any).actualText);

      expect(textList).toEqual(['数值', '日期']);
    });
  });
});

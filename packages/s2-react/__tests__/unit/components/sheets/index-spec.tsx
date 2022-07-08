import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { type SpreadSheet, type S2DataConfig, customMerge } from '@antv/s2';
import { SheetType } from '@antv/s2-shared';
import { SheetComponent, SheetComponentsProps } from '../../../../src';
import { getContainer } from '../../../util/helpers';

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
    test.each(['pivot', 'table', 'strategy', 'gridAnalysis'] as SheetType[])(
      'should render successfully for %s sheet',
      (sheetType) => {
        function render() {
          ReactDOM.render(
            <SheetComponent
              sheetType={sheetType}
              options={{ width: 200, height: 200 }}
              dataCfg={null}
            />,
            container,
          );
        }

        expect(render).not.toThrowError();
      },
    );
  });

  describe('<StrategySheet/> Tests', () => {
    const renderStrategySheet = (
      options: SheetComponentsProps['options'],
      dataCfg: S2DataConfig = null,
    ) => {
      act(() => {
        ReactDOM.render(
          <SheetComponent
            sheetType="strategy"
            options={customMerge(options, {
              width: 200,
              height: 200,
            })}
            dataCfg={dataCfg}
            getSpreadSheet={(instance) => {
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
  });
});

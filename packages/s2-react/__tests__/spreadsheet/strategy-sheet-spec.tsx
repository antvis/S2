import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { copyData, type PivotSheet } from '@antv/s2';
import {
  StrategySheetDataConfig,
  StrategyOptions,
} from '../data/strategy-data';
import { SheetComponent } from '../../src';
import { getContainer } from '../util/helpers';

describe('Spread Sheet Tests', () => {
  describe('Mount Sheet tests', () => {
    let container: HTMLDivElement;
    beforeEach(() => {
      container = getContainer();
    });

    afterEach(() => {
      container?.remove();
    });

    test('should export correct data of strategy sheet', () => {
      let s2Instance: PivotSheet;
      act(() => {
        ReactDOM.render(
          <SheetComponent
            getSpreadSheet={(s2) => {
              s2Instance = s2;
            }}
            sheetType="strategy"
            options={StrategyOptions}
            dataCfg={StrategySheetDataConfig}
          />,
          container,
        );
      });

      // 角头部分展示如下：
      // ["", "","时间"]
      // ["", "","数值"]
      const result = copyData(s2Instance, '\t');

      const rows = result.split('\n');
      const corner1 = rows[0].split('\t').slice(0, 3);
      const corner2 = rows[1].split('\t').slice(0, 3);
      expect(corner1).toEqual(['', '', `"时间"`]);
      expect(corner2).toEqual(['', '', `"数值"`]);
    });
  });
});

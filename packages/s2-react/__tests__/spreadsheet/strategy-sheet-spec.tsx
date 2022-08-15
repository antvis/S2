import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { copyData, SpreadSheet } from '@antv/s2';
import {
  StrategySheetDataConfig,
  StrategyOptions,
} from '../data/strategy-data';
import { SheetComponent } from '../../src';
import { getContainer } from '../util/helpers';

describe('Strategy Sheet Export Tests', () => {
  let container: HTMLDivElement;
  let s2Instance: SpreadSheet;

  beforeEach(() => {
    container = getContainer();
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
  });

  afterEach(() => {
    container?.remove();
  });

  test('should export correct data', () => {
    // 角头部分展示如下：
    // ["", "","日期"]
    // ["", "","数值"]
    const result = copyData(s2Instance, '\t');

    const rows = result.split('\n');
    const corner1 = rows[0].split('\t').slice(0, 3);
    const corner2 = rows[1].split('\t').slice(0, 3);
    expect(corner1).toEqual(['', '', `"日期"`]);
    expect(corner2).toEqual(['', '', `"数值"`]);
  });

  test('should export correct data for multi different cycle compare data', () => {
    // 列头部分不同粒度的列头包含不同的同环比个数
    // 2022 包含 [数值，环比]
    // 2022-10 包含 [数值，环比，同比]
    // 它们都应和各自的列头数值一栏对齐
    const result = copyData(s2Instance, '\t');

    const rows = result.split('\n');
    const col1: string[] = rows[0].split('\t').slice(3);
    const col2: string[] = rows[1].split('\t').slice(3);

    expect(col1.length).toEqual(col2.length);
    // 2022 对齐其数值
    const idx1 = col1.findIndex((col) => col === `"2022"`);
    expect(col2[idx1]).toEqual(`"数值"`);
    // 2022-10 对齐其数值
    const idx2 = col1.findIndex((col) => col === `"2022-10"`);
    expect(col2[idx2]).toEqual(`"数值"`);
  });
});

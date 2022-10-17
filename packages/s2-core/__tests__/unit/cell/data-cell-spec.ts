/* eslint-disable @typescript-eslint/ban-ts-comment */
import { get } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant/basic';
import type { Formatter, ViewMeta } from '@/common';
import { PivotDataSet } from '@/data-set';
import { SpreadSheet, PivotSheet } from '@/sheet-type';
import { DataCell } from '@/cell';
import type { PivotFacet } from '@/facet';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('data cell formatter test', () => {
  const meta = {
    fieldValue: 'fieldValue',
    label: 'label',
    value: 'value',
    data: {
      city: 'chengdu',
      value: 12,
      [VALUE_FIELD]: 'value',
      [EXTRA_FIELD]: 12,
    },
  } as unknown as ViewMeta;

  let s2: SpreadSheet;

  beforeEach(() => {
    const container = document.createElement('div');

    s2 = new MockPivotSheet(container);
    const dataSet: PivotDataSet = new MockPivotDataSet(s2);

    s2.dataSet = dataSet;

    s2.facet = {
      layoutResult: {
        rowLeafNodes: [],
      },
    } as PivotFacet;
  });

  describe('Condition Tests', () => {
    const s2 = createPivotSheet({
      conditions: {
        text: [
          {
            field: 'price',
            mapping() {
              return {
                fill: '#5083F5',
              };
            },
          },
        ],
      },
    });
    test('should draw right condition text shape', () => {
      s2.render();
      const dataCell = s2.facet.panelGroup
        .getChildByIndex(0)
        // @ts-ignore
        .getChildByIndex(0);
      expect(get(dataCell, 'textShape.attrs.fill')).toEqual('#5083F5');
    });

    test('should draw right condition icon shape', () => {
      s2.setOptions({
        conditions: {
          icon: [
            {
              field: 'cost',
              mapping() {
                return {
                  icon: 'CellUp',
                  fill: 'red',
                };
              },
            },
          ],
        },
      });
      s2.render();
      const dataCell = s2.facet.panelGroup
        .getChildByIndex(0)
        // @ts-ignore
        .getChildByIndex(2);
      expect(get(dataCell, 'conditionIconShape.cfg.name')).toEqual('CellUp');
      expect(get(dataCell, 'conditionIconShape.cfg.fill')).toEqual('red');
    });

    test('should draw right condition background shape', () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: 'cost',
              mapping() {
                return {
                  fill: '#F7B46F',
                };
              },
            },
          ],
        },
      });
      s2.render();
      const dataCell = s2.facet.panelGroup
        .getChildByIndex(0)
        // @ts-ignore
        .getChildByIndex(2);
      expect(get(dataCell, 'backgroundShape.attrs.fill')).toEqual('#F7B46F');
    });

    test('should draw condition interval shape', () => {
      const cellWidth = 120;
      const fieldValue = 27.334666666666667;
      const anotherMeta = {
        width: cellWidth,
        valueField: 'value',
        fieldValue,
        data: {
          city: 'chengdu',
          value: fieldValue,
          [VALUE_FIELD]: 'value',
          [EXTRA_FIELD]: fieldValue,
        },
      } as unknown as ViewMeta;

      jest.spyOn(s2.dataSet, 'getValueRangeByField').mockReturnValue({
        minValue: 0,
        maxValue: fieldValue,
      });

      s2.setOptions({
        conditions: {
          interval: [
            {
              field: 'value',
              mapping: () => ({ fill: 'red' }),
            },
          ],
        },
      });

      const dataCell = new DataCell(anotherMeta, s2);
      expect(get(dataCell, 'conditionIntervalShape.attrs.width')).toEqual(
        cellWidth,
      );
    });
  });
});

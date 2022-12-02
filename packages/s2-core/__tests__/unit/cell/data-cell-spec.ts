/* eslint-disable @typescript-eslint/ban-ts-comment */
import { find, get } from 'lodash';
import { createPivotSheet, createTableSheet } from 'tests/util/helpers';
import { renderText } from '@/utils/g-renders';
import { DataCell } from '@/cell';
import { GuiIcon, type Formatter, type ViewMeta } from '@/common';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant/basic';
import {
  DEFAULT_FONT_COLOR,
  REVERSE_FONT_COLOR,
} from '@/common/constant/condition';
import { PivotDataSet } from '@/data-set';
import type { PivotFacet } from '@/facet';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('Data Cell Tests', () => {
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

  describe('Data Cell Formatter Tests', () => {
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

    test('should pass complete data into formatter', () => {
      const formatter = jest.fn();
      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dataCell = new DataCell(meta, s2);
      expect(formatter).toHaveBeenCalledWith(meta.fieldValue, meta.data, meta);
    });

    test('should return correct formatted value', () => {
      const formatter: Formatter = (_, data) => `${get(data, 'value') * 10}`;
      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);
      const dataCell = new DataCell(meta, s2);

      expect(dataCell.getTextShape().attr('text')).toEqual('120');
    });

    test('should get correct text fill color', () => {
      const dataCell = new DataCell(meta, s2);
      expect(dataCell.getTextShape().attr('fill')).toEqual(DEFAULT_FONT_COLOR);
    });
  });

  describe('Data Cell Shape Tests', () => {
    const icon = new GuiIcon({
      name: 'CellUp',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      fill: 'red',
    });

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

    test('should get text shape', () => {
      const dataCell = new DataCell(meta, s2);
      expect(dataCell.getTextShapes()).toEqual([dataCell.getTextShape()]);
    });

    test('should add icon shape', () => {
      const dataCell = new DataCell(meta, s2);
      dataCell.addConditionIconShape(icon);

      expect(dataCell.getConditionIconShapes()).toEqual([icon]);
    });

    test('should add text shape', () => {
      const dataCell = new DataCell(meta, s2);
      const textShape = renderText(dataCell, [], 0, 0, 'test', null);
      dataCell.addTextShape(textShape);

      expect(dataCell.getTextShapes()).toHaveLength(2);
    });

    test('should reset shape after cell init', () => {
      const dataCell = new DataCell(meta, s2);
      dataCell.addConditionIconShape(icon);

      expect(dataCell.getConditionIconShapes()).toHaveLength(1);

      // @ts-ignore
      dataCell.initCell();

      expect(dataCell.getConditionIconShapes()).toBeEmpty();
    });
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
                  fill: '#fffae6',
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
      expect(get(dataCell, 'backgroundShape.attrs.fill')).toEqual('#fffae6');
      expect(get(dataCell, 'textShape.attrs.fill')).toEqual(DEFAULT_FONT_COLOR);
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

    test('should draw REVERSE_FONT_COLOR on text when background low brightness and intelligentReverseTextColor is true', () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: 'cost',
              mapping() {
                return {
                  fill: '#000000',
                  intelligentReverseTextColor: true,
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
      expect(get(dataCell, 'textShape.attrs.fill')).toEqual(REVERSE_FONT_COLOR);
      expect(get(dataCell, 'backgroundShape.attrs.fill')).toEqual('#000000');
    });

    test('should draw DEFAULT_FONT_COLOR on text when background low brightness and intelligentReverseTextColor is false', () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: 'cost',
              mapping() {
                return {
                  fill: '#000000',
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
      expect(get(dataCell, 'textShape.attrs.fill')).toEqual(DEFAULT_FONT_COLOR);
      expect(get(dataCell, 'backgroundShape.attrs.fill')).toEqual('#000000');
    });

    test('should draw DEFAULT_FONT_COLOR on text when background high brightness is and intelligentReverseTextColor is true', () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: 'cost',
              mapping() {
                return {
                  fill: '#ffffff',
                  intelligentReverseTextColor: true,
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
      expect(get(dataCell, 'textShape.attrs.fill')).toEqual(DEFAULT_FONT_COLOR);
      expect(get(dataCell, 'backgroundShape.attrs.fill')).toEqual('#ffffff');
    });

    test('should test condition mapping params when the sheet is pivot', () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: 'cost',
              mapping(value, dataInfo) {
                const originData = s2.dataSet.originData;
                const resultData = find(originData, dataInfo);
                expect(resultData).toEqual(dataInfo);
                expect(value).toEqual(resultData.cost);
                return {
                  fill: '#fffae6',
                };
              },
            },
          ],
        },
      });
      s2.render();
    });
    test('should test condition mapping params when the sheet is table', () => {
      const table = createTableSheet({});
      table.setOptions({
        conditions: {
          background: [
            {
              field: 'type',
              mapping(value, dataInfo) {
                const originData = table.dataSet.originData;
                const resultData = find(originData, dataInfo);
                expect(resultData).toEqual(dataInfo);
                expect(value).toEqual(resultData.type);
                return {
                  fill: '#fffae6',
                };
              },
            },
          ],
        },
      });
      table.render();
    });
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Rect } from '@antv/g';
import { find, get, keys } from 'lodash';
import { createPivotSheet, createTableSheet } from 'tests/util/helpers';
import { DataCell } from '@/cell';
import type { TextAlign } from '@/common';
import {
  CellType,
  GuiIcon,
  S2Event,
  type Formatter,
  type OriginalEvent,
  type S2CellType,
  type ViewMeta,
} from '@/common';
import {
  DEFAULT_FONT_COLOR,
  REVERSE_FONT_COLOR,
} from '@/common/constant/condition';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant/field';
import { PivotDataSet } from '@/data-set';
import type { PivotFacet } from '@/facet';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

const findDataCell = (
  s2: SpreadSheet,
  valueField: 'price' | 'cost' | 'number',
) => {
  return s2.facet
    .getDataCells()
    .find((item) => item.getMeta().valueField === valueField);
};

describe('Data Cell Tests', () => {
  const meta = {
    fieldValue: 'fieldValue',
    value: 'value',
    data: {
      city: 'chengdu',
      value: 12,
      [VALUE_FIELD]: 'value',
      [EXTRA_FIELD]: 12,
    },
    width: 100,
    height: 100,
  } as unknown as ViewMeta;

  let s2: SpreadSheet;

  describe('Link Shape Tests', () => {
    beforeEach(async () => {
      s2 = createPivotSheet({});
      await s2.render();
    });

    test.each([
      ['left', 312],
      ['center', 375],
      ['right', 438],
    ] as const)(
      'should align link shape with text',
      async (textAlign: TextAlign, textCenterX: number) => {
        s2.setOptions({
          interaction: {
            linkFields: ['price'],
          },
        });
        s2.setTheme({
          dataCell: {
            text: {
              textAlign,
            },
          },
        });

        await s2.render();

        const dataCell = s2.facet.getDataCells()[0];
        const { left: minX, right: maxX } = dataCell
          .getLinkFieldShape()
          .getBBox();

        // 宽度相当
        const linkLength = maxX - minX;

        expect(
          Math.abs(linkLength - dataCell.getActualTextWidth()),
        ).toBeLessThanOrEqual(2);

        // link shape 的中点坐标与 text 中点对齐
        const linkCenterX = minX + linkLength / 2;

        expect(Math.round(linkCenterX)).toEqual(textCenterX);
      },
    );
  });

  describe('Data Cell Formatter & Method Tests', () => {
    beforeEach(async () => {
      const container = document.createElement('div');

      s2 = new MockPivotSheet(container);
      const dataSet: PivotDataSet = new MockPivotDataSet(s2);

      s2.dataSet = dataSet;

      s2.facet = {
        getRowLeafNodes: () => [],
        getRowLeafNodeByIndex: jest.fn(),
        getCells: () => [],
        destroy: jest.fn(),
      } as unknown as PivotFacet;

      await s2.render();
    });

    test('should pass complete data into formatter', () => {
      const formatter = jest.fn();

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      // eslint-disable-next-line no-new
      new DataCell(meta, s2);
      expect(formatter).toHaveBeenCalledWith(meta.fieldValue, meta.data, meta);
    });

    test('should return correct formatted value', () => {
      const formatter: Formatter = (_, data) => `${get(data, 'value')! * 10}`;

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);
      const dataCell = new DataCell(meta, s2);

      expect(dataCell.getTextShape().attr('text')).toEqual('120');
    });

    test('should get correct text fill color', () => {
      const dataCell = new DataCell(meta, s2);

      expect(dataCell.getTextShape().attr('fill')).toEqual(DEFAULT_FONT_COLOR);
    });

    test('should get empty chart data and default options', () => {
      const dataCell = new DataCell(meta, s2);

      expect(dataCell.isMultiData()).toBeFalsy();
      expect(dataCell.isChartData()).toBeFalsy();
      expect(dataCell.getRenderChartData()).toBeUndefined();
      expect(dataCell.getRenderChartOptions()).toMatchSnapshot();
    });

    test('should get correctly cell data status', () => {
      const multipleMeta = {
        fieldValue: {
          values: [1, 2, 3],
        },
      } as unknown as ViewMeta;

      const dataCell = new DataCell(multipleMeta, s2);

      expect(dataCell.isMultiData()).toBeTruthy();
      expect(dataCell.isChartData()).toBeFalsy();
    });

    test('should get multiple chart data and all options', () => {
      s2.setThemeCfg({ name: 'dark' });

      const multipleMeta = {
        fieldValue: {
          values: {
            type: 'interval',
            autoFit: true,
            data: [
              {
                genre: 'Sports',
                sold: 275,
              },
            ],
            encode: {
              x: 'genre',
              y: 'sold',
              color: 'genre',
            },
          },
        },
        value: 'value',
        width: 100,
        height: 100,
        x: 0,
        y: 200,
      } as unknown as ViewMeta;

      const dataCell = new DataCell(multipleMeta, s2);

      expect(dataCell.isMultiData()).toBeTruthy();
      expect(dataCell.isChartData()).toBeTruthy();
      expect(dataCell.getRenderChartData()).toMatchSnapshot();
      expect(dataCell.getRenderChartOptions()).toMatchSnapshot();
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

    beforeEach(async () => {
      const container = document.createElement('div');

      s2 = new MockPivotSheet(container);
      const dataSet: PivotDataSet = new MockPivotDataSet(s2);

      s2.dataSet = dataSet;

      s2.facet = {
        getRowLeafNodes: () => [],
        getRowLeafNodeByIndex: jest.fn(),
        getCells: () => [],
        destroy: jest.fn(),
      } as unknown as PivotFacet;

      await s2.render();
    });

    test("shouldn't init when width or height is not positive", () => {
      const dataCell = new DataCell({ ...meta, width: 0, height: 0 }, s2);

      expect(dataCell.getTextShape()).toBeUndefined();
      // @ts-ignore
      expect(dataCell.backgroundShape).toBeUndefined();
      // @ts-ignore
      expect([...dataCell.stateShapes.keys()]).toBeEmpty();
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

      dataCell.renderTextShape({ x: 0, y: 0, text: 'test' });

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

  describe('Condition by formattedValue Tests', () => {
    const s2 = createPivotSheet(
      {
        conditions: {
          text: [
            {
              field: 'number',
              mapping(_, __, cell) {
                const formattedValue = cell?.getFieldValue();

                if (formattedValue === 'formatted') {
                  return {
                    fill: '#D03050',
                  };
                }

                return {
                  fill: '#fff',
                };
              },
            },
          ],
        },
      },
      { useSimpleData: false },
    );

    test('should test condition mapping formattedValue params when the sheet is pivot', async () => {
      s2.setDataCfg({
        ...s2.dataCfg,
        meta: [
          {
            field: 'number',
            formatter: () => {
              return 'formatted';
            },
          },
        ],
      });
      await s2.render();

      const dataCell = findDataCell(s2, 'number');

      expect(dataCell?.getTextShape().parsedStyle.fill).toBeColor('#D03050');
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

    test('should draw right condition text shape', async () => {
      await s2.render();
      const dataCell = findDataCell(s2, 'price');

      expect(dataCell?.getTextShape().parsedStyle.fill).toBeColor('#5083F5');
    });

    test('should render text by text theme', async () => {
      s2.setOptions({
        conditions: {
          text: [
            {
              field: 'price',
              mapping() {
                return {
                  fill: 'red',
                  fontSize: 20,
                  fontWeight: 800,
                };
              },
            },
          ],
        },
      });
      await s2.render();

      const dataCell = findDataCell(s2, 'price')!;
      const { fill, fontSize, fontWeight } = dataCell.getTextShape().attributes;

      expect(fill).toEqual('red');
      expect(fontSize).toEqual(20);
      expect(fontWeight).toEqual(800);
    });

    test('should draw right condition icon shape', async () => {
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
      await s2.render();
      const dataCell = findDataCell(s2, 'cost');

      expect(get(dataCell, 'conditionIconShape.cfg.name')).toEqual('CellUp');
      expect(get(dataCell, 'conditionIconShape.cfg.fill')).toEqual('red');
    });

    test('should draw right condition background shape', async () => {
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
      await s2.render();

      const dataCell = findDataCell(s2, 'cost');

      expect(
        (get(dataCell, 'backgroundShape') as unknown as Rect).parsedStyle.fill,
      ).toBeColor('#fffae6');
      expect(dataCell?.getTextShape().parsedStyle.fill).toBeColor(
        DEFAULT_FONT_COLOR,
      );
    });

    test('should draw condition interval shape', () => {
      const cellWidth = 120;
      const fieldValue = 27.334666666666667;
      const anotherMeta = {
        width: cellWidth,
        height: 100,
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
              mapping: () => {
                return { fill: 'red' };
              },
            },
          ],
        },
      });

      const dataCell = new DataCell(anotherMeta, s2);

      expect(
        get(dataCell, 'conditionIntervalShape.parsedStyle.width')! +
          s2.theme.dataCell!.cell!.horizontalBorderWidth,
      ).toEqual(cellWidth);
    });

    test('should draw REVERSE_FONT_COLOR on text when background low brightness and intelligentReverseTextColor is true', async () => {
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
      await s2.render();
      const dataCell = findDataCell(s2, 'cost');

      expect(dataCell?.getTextShape().parsedStyle.fill).toBeColor(
        REVERSE_FONT_COLOR,
      );
      expect(get(dataCell, 'backgroundShape.parsedStyle.fill')).toBeColor(
        '#000000',
      );
    });

    test('should draw DEFAULT_FONT_COLOR on text when background low brightness and intelligentReverseTextColor is false', async () => {
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
      await s2.render();
      const dataCell = findDataCell(s2, 'cost');

      expect(dataCell?.getTextShape().parsedStyle.fill).toBeColor(
        DEFAULT_FONT_COLOR,
      );
      expect(get(dataCell, 'backgroundShape.parsedStyle.fill')).toBeColor(
        '#000000',
      );
    });

    test('should draw DEFAULT_FONT_COLOR on text when background high brightness is and intelligentReverseTextColor is true', async () => {
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
      await s2.render();
      const dataCell = findDataCell(s2, 'cost');

      expect(dataCell?.getTextShape().parsedStyle.fill).toBeColor(
        DEFAULT_FONT_COLOR,
      );
      expect(get(dataCell, 'backgroundShape.parsedStyle.fill')).toBeColor(
        '#ffffff',
      );
    });

    test('should test condition mapping params when the sheet is pivot', async () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: 'cost',
              mapping(value, dataInfo) {
                const originData = s2.dataSet.originData;
                const resultData = find(originData, (item) =>
                  keys(item).every((key) => item[key] === dataInfo[key]),
                );

                expect(value).toEqual(resultData?.['cost']);
                expect(value).toEqual(dataInfo['cost']);

                return {
                  fill: '#fffae6',
                };
              },
            },
          ],
        },
      });
      await s2.render();
    });

    test('should test condition mapping params when the sheet is table', async () => {
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
                // @ts-ignore
                expect(value).toEqual(resultData?.type);

                return {
                  fill: '#fffae6',
                };
              },
            },
          ],
        },
      });
      await table.render();
    });
  });

  describe('Data Cell Interaction', () => {
    beforeEach(async () => {
      s2 = createPivotSheet({
        seriesNumber: {
          enable: true,
        },
        interaction: {
          copy: { enable: true },
        },
      });
      await s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    const emitEvent = (type: S2Event, event: Partial<OriginalEvent>) => {
      s2.emit(type, {
        originalEvent: event,
        preventDefault() {},
        stopPropagation() {},
        ...event,
      } as any);
    };

    test('should be highlight entire row data cells when the row header is clicked', () => {
      const allRowCells = s2.facet.getRowCells();
      const mockCell = allRowCells[0];

      s2.getCell = jest.fn().mockReturnValue(mockCell);

      emitEvent(S2Event.ROW_CELL_CLICK, {
        x: 2,
        y: 2,
      });

      const interactedCells = s2.interaction.getInteractedCells();
      const firstRowCell = find(
        interactedCells,
        (cell: S2CellType) => cell.cellType === CellType.ROW_CELL,
      );

      expect(interactedCells.length).toBe(7);
      expect(firstRowCell!.getMeta().id).toBe(mockCell.getMeta().id);
    });

    test('should be highlight entire column data cells when the column header is clicked', () => {
      const allColumnCells = s2.facet.getColCells();
      const mockCell = allColumnCells[0];

      s2.getCell = jest.fn().mockReturnValue(mockCell);

      emitEvent(S2Event.COL_CELL_CLICK, {
        x: mockCell.getMeta().x + 5,
        y: mockCell.getMeta().y + 5,
      });

      const interactedCells = s2.interaction.getInteractedCells();
      const firstColCell = find(
        interactedCells,
        (cell: S2CellType) => cell.cellType === CellType.COL_CELL,
      );

      expect(interactedCells.length).toBe(8);
      expect(firstColCell!.getMeta().id).toBe(mockCell.getMeta().id);
    });

    test('should be highlight data cell when the data cell is clicked', () => {
      const allDataCells = s2.facet.getDataCells();
      const mockCell = allDataCells[0];

      s2.getCell = jest.fn().mockReturnValue(mockCell);

      emitEvent(S2Event.DATA_CELL_CLICK, {
        x: mockCell.getMeta().x + 5,
        y: mockCell.getMeta().y + 5,
      });

      const activeCells = s2.interaction.getInteractedCells();

      expect(activeCells.length).toBe(1);
      expect(activeCells[0].getActualText()).toBe('1');
      expect(activeCells[0].getMeta().id).toBe(mockCell.getMeta().id);
    });
  });
});

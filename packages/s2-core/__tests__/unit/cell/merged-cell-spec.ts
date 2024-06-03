/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MergedCell } from '@/cell';
import { GuiIcon, type ViewMeta } from '@/common';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant/field';
import { PivotDataSet } from '@/data-set';
import type { PivotFacet } from '@/facet';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { renderText } from '@/utils/g-renders';
import { CellType } from '../../../src/common/constant';
import { createMockCellInfo } from '../../util/helpers';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('Merged Cell Tests', () => {
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
    width: 100,
    height: 100,
  } as unknown as ViewMeta;

  let s2: SpreadSheet;
  let mergedCell: MergedCell;

  describe('Merged Cell Shape Tests', () => {
    const icon = new GuiIcon({
      name: 'CellUp',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      fill: 'red',
    });

    const cells = [
      createMockCellInfo('test-a').mockCell,
      createMockCellInfo('test-b').mockCell,
    ];

    beforeEach(() => {
      const container = document.createElement('div');

      s2 = new MockPivotSheet(container);
      const dataSet: PivotDataSet = new MockPivotDataSet(s2);

      s2.dataSet = dataSet;

      s2.facet = {
        layoutResult: {
          rowLeafNodes: [],
        },
        getRowLeafNodeByIndex: () => {},
      } as unknown as PivotFacet;

      mergedCell = new MergedCell(s2, cells, meta);
    });

    test("shouldn't init when width or height is not positive", () => {
      mergedCell = new MergedCell(s2, cells, {
        ...meta,
        width: 0,
        height: 0,
      });
      expect(mergedCell.getTextShape()).toBeUndefined();
      // @ts-ignore
      expect(mergedCell.backgroundShape).toBeUndefined();
      // @ts-ignore
      expect([...mergedCell.stateShapes.keys()]).toBeEmpty();
    });

    test('should get correctly cell type', () => {
      expect(mergedCell.cellType).toEqual(CellType.MERGED_CELL);
    });

    test('should get text shape', () => {
      expect(mergedCell.getTextShapes()).toEqual([mergedCell.getTextShape()]);
    });

    test('should add icon shape', () => {
      mergedCell.addConditionIconShape(icon);

      expect(mergedCell.getConditionIconShapes()).toEqual([icon]);
    });

    test('should add text shape', () => {
      const textShape = renderText(mergedCell, [], 0, 0, 'test', null);

      mergedCell.addTextShape(textShape);

      expect(mergedCell.getTextShapes()).toHaveLength(1);
    });

    test('should reset shape after cell init', () => {
      mergedCell.addConditionIconShape(icon);

      expect(mergedCell.getConditionIconShapes()).toHaveLength(1);

      // @ts-ignore
      mergedCell.initCell();

      expect(mergedCell.getConditionIconShapes()).toBeEmpty();
    });

    test('should render merged cell background shape', () => {
      // @ts-ignore
      expect(mergedCell.backgroundShape.get('type')).toEqual('polygon');
    });
  });
});

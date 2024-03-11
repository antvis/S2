import {
  createMockCellInfo,
  createPivotSheet,
  getContainer,
} from 'tests/util/helpers';
import {
  customColGridSimpleFields,
  customRowGridSimpleFields,
} from '../data/custom-grid-simple-fields';
import { CustomGridData } from '../data/data-custom-grid';
import { S2Event, SERIES_NUMBER_FIELD } from '@/common/constant';
import { CornerNodeType, type S2Options } from '@/common/interface';
import type { GEvent, HierarchyType, S2DataConfig } from '@/index';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 600,
  height: 400,
};

describe('Interaction Corner Cell Click Tests', () => {
  let s2: SpreadSheet;

  afterEach(() => {
    s2.destroy();
  });

  test.each(['grid', 'tree'] as HierarchyType[])(
    'should selected row cell when row corner cell clicked for %s mode',
    async (hierarchyType) => {
      jest.spyOn(SpreadSheet.prototype, 'getCell').mockImplementationOnce(
        () =>
          createMockCellInfo('city', {
            cornerType: CornerNodeType.Row,
          }).mockCell,
      );

      s2 = createPivotSheet({
        ...s2Options,
        hierarchyType,
      });
      await s2.render();

      const reset = jest
        .spyOn(s2.interaction, 'reset')
        .mockImplementationOnce(() => {});

      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      expect(reset).not.toHaveBeenCalled();
      expect(s2.interaction.getActiveCells()).toHaveLength(
        s2.isHierarchyTreeType() ? 3 : 2,
      );
      expect(s2.interaction.isSelectedState()).toBeTruthy();
    },
  );

  test.each(['grid', 'tree'] as HierarchyType[])(
    'should selected custom row cell when row corner cell clicked for %s mode',
    async (hierarchyType) => {
      jest.spyOn(SpreadSheet.prototype, 'getCell').mockImplementationOnce(
        () =>
          createMockCellInfo('a-1-1', {
            cornerType: CornerNodeType.Row,
          }).mockCell,
      );

      const customRowDataCfg: S2DataConfig = {
        data: CustomGridData,
        fields: customRowGridSimpleFields,
      };

      s2 = new PivotSheet(getContainer(), customRowDataCfg, {
        ...s2Options,
        hierarchyType,
      });
      await s2.render();

      const reset = jest
        .spyOn(s2.interaction, 'reset')
        .mockImplementationOnce(() => {});

      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      const gridFields = ['a-1-1', 'a-1-2'];
      const treeFields = [
        'a-1',
        'a-1-1',
        'measure-1',
        'measure-2',
        'a-1-2',
        'a-2',
      ];

      expect(reset).not.toHaveBeenCalled();
      expect(
        s2.interaction.getActiveCells().map((cell) => cell.getMeta().field),
      ).toEqual(s2.isHierarchyTreeType() ? treeFields : gridFields);
      expect(s2.interaction.isSelectedState()).toBeTruthy();
    },
  );

  test.each(['grid', 'tree'] as HierarchyType[])(
    'should selected col cell when col corner cell clicked for %s mode',
    async (hierarchyType) => {
      jest.spyOn(SpreadSheet.prototype, 'getCell').mockImplementationOnce(
        () =>
          createMockCellInfo('type', {
            cornerType: CornerNodeType.Col,
          }).mockCell,
      );

      s2 = createPivotSheet({
        ...s2Options,
        hierarchyType,
      });
      await s2.render();

      const reset = jest
        .spyOn(s2.interaction, 'reset')
        .mockImplementationOnce(() => {});

      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      expect(reset).not.toHaveBeenCalled();
      expect(s2.interaction.getActiveCells()).toHaveLength(1);
      expect(s2.interaction.isSelectedState()).toBeTruthy();
    },
  );

  test.each(['grid', 'tree'] as HierarchyType[])(
    'should selected custom col cell when row corner cell clicked for %s mode',
    async (hierarchyType) => {
      jest.spyOn(SpreadSheet.prototype, 'getCell').mockImplementationOnce(
        () =>
          createMockCellInfo('a-1', {
            cornerType: CornerNodeType.Col,
          }).mockCell,
      );

      const customRowDataCfg: S2DataConfig = {
        data: CustomGridData,
        fields: customColGridSimpleFields,
      };

      s2 = new PivotSheet(getContainer(), customRowDataCfg, {
        ...s2Options,
        hierarchyType,
      });
      await s2.render();

      const reset = jest
        .spyOn(s2.interaction, 'reset')
        .mockImplementationOnce(() => {});

      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      expect(reset).not.toHaveBeenCalled();
      expect(
        s2.interaction.getActiveCells().map((cell) => cell.getMeta().field),
      ).toEqual(['a-1', 'a-2']);
      expect(s2.interaction.isSelectedState()).toBeTruthy();
    },
  );

  test.each(['grid', 'tree'] as HierarchyType[])(
    'should selected series cell when series corner cell clicked for %s mode',
    async (hierarchyType) => {
      jest.spyOn(SpreadSheet.prototype, 'getCell').mockImplementationOnce(
        () =>
          createMockCellInfo(SERIES_NUMBER_FIELD, {
            cornerType: CornerNodeType.Series,
          }).mockCell,
      );

      s2 = createPivotSheet({
        ...s2Options,
        seriesNumber: { enable: true },
        hierarchyType,
      });
      await s2.render();

      const reset = jest
        .spyOn(s2.interaction, 'reset')
        .mockImplementationOnce(() => {});

      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      expect(reset).not.toHaveBeenCalled();
      expect(s2.interaction.getActiveCells()).toHaveLength(1);
      expect(s2.interaction.isSelectedState()).toBeTruthy();
    },
  );
});

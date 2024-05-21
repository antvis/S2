import * as mockDataConfig from 'tests/data/mock-dataset.json';
import { getContainer } from 'tests/util/helpers';
import { map } from 'lodash';
import { CustomGridData } from 'tests/data/data-custom-grid';
import { customRowGridFields } from 'tests/data/custom-grid-fields';
import { type FrozenFacet, PivotSheet, type S2DataConfig } from '../../src';
import { pickMap } from '../util/fp';

function expectFrozenGroup(s2: PivotSheet) {
  const pickCoordinate = pickMap(['id', 'x', 'y', 'width', 'height']);

  const actualHead = pickCoordinate(
    map(s2.facet.rowHeader?.frozenGroup.children, 'meta'),
  );

  expect(actualHead).toMatchSnapshot();

  const actualTrailing = pickCoordinate(
    map(s2.facet.rowHeader?.frozenTrailingGroup.children, 'meta'),
  );

  expect(actualTrailing).toMatchSnapshot();
}

describe('Spread Sheet Frozen Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    container?.remove();
  });

  describe('grid mode', () => {
    test('should render correct frozen areas when has vertical scroll area', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 300,
        hierarchyType: 'grid',
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 0,
          range: [0, 1],
        },
        frozenTrailingRow: {
          height: 30,
          y: 210,
          range: [7, 7],
        },
      });

      expectFrozenGroup(s2);
      s2.destroy();
    });

    test('should render correct frozen areas when has no vertical scroll area', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 800,
        hierarchyType: 'grid',
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 0,
          range: [0, 1],
        },
        frozenTrailingRow: {
          height: 30,
          y: 210,
          range: [7, 7],
        },
      });

      expectFrozenGroup(s2);
      s2.destroy();
    });

    test('should render correct frozen areas with pagination', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 300,
        hierarchyType: 'grid',
        pagination: {
          current: 2,
          pageSize: 4,
        },
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 120,
          range: [4, 5],
        },
        frozenTrailingRow: {
          height: 30,
          y: 210,
          range: [7, 7],
        },
      });
      expectFrozenGroup(s2);
      s2.destroy();
    });
  });

  describe('tree mode', () => {
    test('should render correct frozen areas when has vertical scroll area', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 300,
        hierarchyType: 'tree',
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 0,
          range: [0, 1],
        },
        frozenTrailingRow: {
          height: 30,
          y: 270,
          range: [9, 9],
        },
      });

      expectFrozenGroup(s2);
      s2.destroy();
    });

    test('should render correct frozen areas when has no vertical scroll area', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 800,
        hierarchyType: 'tree',
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 0,
          range: [0, 1],
        },
        frozenTrailingRow: {
          height: 30,
          y: 270,
          range: [9, 9],
        },
      });

      expectFrozenGroup(s2);
      s2.destroy();
    });

    test('should render correct frozen areas with pagination', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 300,
        hierarchyType: 'tree',
        pagination: {
          current: 2,
          pageSize: 4,
        },
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 120,
          range: [4, 5],
        },
        frozenTrailingRow: {
          height: 30,
          y: 210,
          range: [7, 7],
        },
      });
      expectFrozenGroup(s2);
      s2.destroy();
    });
  });

  describe('custom tree mode', () => {
    const pivotSheetCustomRowGridDataCfg: S2DataConfig = {
      data: CustomGridData,
      meta: [
        ...mockDataConfig.meta,
        {
          field: 'a-1',
          name: '层级1',
        },
        {
          field: 'a-1-1',
          name: '层级2',
        },
        {
          field: 'measure-1',
          name: '层级3',
        },
        {
          field: 'measure-1',
          formatter: (value) => `#-${value}`,
        },
      ],
      fields: customRowGridFields,
    };

    test('should render correct frozen areas for custom grid mode', async () => {
      const s2 = new PivotSheet(container, pivotSheetCustomRowGridDataCfg, {
        width: 600,
        height: 400,
        hierarchyType: 'grid',
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 0,
          range: [0, 1],
        },
        frozenTrailingRow: {
          height: 30,
          y: 240,
          range: [8, 8],
        },
      });

      expectFrozenGroup(s2);
      s2.destroy();
    });

    test('should render correct frozen areas for custom tree mode', async () => {
      const s2 = new PivotSheet(container, pivotSheetCustomRowGridDataCfg, {
        width: 600,
        height: 400,
        hierarchyType: 'tree',
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 0,
          range: [0, 1],
        },
        frozenTrailingRow: {
          height: 30,
          y: 420,
          range: [14, 14],
        },
      });

      expectFrozenGroup(s2);
      s2.destroy();
    });

    test('should render correct frozen areas for custom grid mode with pagination', async () => {
      const s2 = new PivotSheet(container, pivotSheetCustomRowGridDataCfg, {
        width: 600,
        height: 400,
        hierarchyType: 'grid',
        pagination: {
          current: 2,
          pageSize: 4,
        },
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenRow: {
          height: 60,
          y: 120,
          range: [4, 5],
        },
        frozenTrailingRow: {
          height: 30,
          y: 210,
          range: [7, 7],
        },
      });

      expectFrozenGroup(s2);
      s2.destroy();
    });
  });
});

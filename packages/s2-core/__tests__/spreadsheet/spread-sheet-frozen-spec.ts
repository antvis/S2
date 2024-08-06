import { map, merge } from 'lodash';
import { customRowGridFields } from 'tests/data/custom-grid-fields';
import { CustomGridData } from 'tests/data/data-custom-grid';
import * as mockDataConfig from 'tests/data/mock-dataset.json';
import { getContainer } from 'tests/util/helpers';
import {
  PivotSheet,
  type FrozenFacet,
  type S2DataConfig,
  type S2Options,
  type SpreadSheet,
} from '../../src';
import { pickMap } from '../util/fp';

function expectFrozenGroup(
  s2: PivotSheet,
  headerName: 'rowHeader' | 'columnHeader' | 'seriesNumberHeader' = 'rowHeader',
) {
  const pickCoordinate = pickMap(['id', 'x', 'y', 'width', 'height']);

  const actualHead = pickCoordinate(
    map(s2.facet[headerName]?.frozenGroup.children, 'meta'),
  );

  expect(actualHead).toMatchSnapshot();

  const actualTrailing = pickCoordinate(
    map(s2.facet[headerName]?.frozenTrailingGroup.children, 'meta'),
  );

  expect(actualTrailing).toMatchSnapshot();
}

function getFrozenGroupPosition(
  s2: PivotSheet,
  headerName: 'rowHeader' | 'columnHeader' = 'rowHeader',
) {
  return [
    s2.facet[headerName]?.frozenGroup.getPosition().map(Math.floor),
    s2.facet[headerName]?.frozenTrailingGroup.getPosition().map(Math.floor),
  ];
}

describe('Spread Sheet Frozen Tests', () => {
  let container: HTMLElement;

  const scrollX = (s2: SpreadSheet, value: number) => {
    s2.interaction.scrollTo({
      offsetX: { value, animate: false },
      offsetY: { value, animate: false },
      rowHeaderOffsetX: { value, animate: false },
    });
  };

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

    test('should render correct series frozen areas', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 300,
        hierarchyType: 'grid',
        seriesNumber: {
          enable: true,
        },
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expectFrozenGroup(s2, 'seriesNumberHeader');

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

    test('should render correct series frozen areas', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, {
        width: 300,
        height: 300,
        hierarchyType: 'tree',
        seriesNumber: {
          enable: true,
        },
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expectFrozenGroup(s2, 'seriesNumberHeader');

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

    test('should render correct series frozen areas', async () => {
      const s2 = new PivotSheet(container, pivotSheetCustomRowGridDataCfg, {
        width: 300,
        height: 300,
        hierarchyType: 'tree',
        seriesNumber: {
          enable: true,
        },
        frozen: {
          rowCount: 2,
          trailingRowCount: 1,
        },
      });

      await s2.render();

      expectFrozenGroup(s2, 'seriesNumberHeader');

      s2.destroy();
    });
  });

  describe('pivot col header frozen', () => {
    const baseOptions: S2Options = {
      width: 600,
      height: 400,
      frozen: {
        colCount: 1,
        trailingColCount: 1,
      },
      style: {
        colCell: {
          width: 100,
          widthByField: {
            'root[&]家具[&]沙发[&]number': 400,
            'root[&]办公用品[&]笔[&]number': 400,
          },
        },
      },
    };

    test('should render correct frozen areas for row header frozen', async () => {
      const s2 = new PivotSheet(container, mockDataConfig, baseOptions);

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenCol: {
          width: 100,
          x: 0,
          range: [0, 0],
        },
        frozenTrailingCol: {
          width: 100,
          x: 900,
          range: [3, 3],
        },
      });

      expectFrozenGroup(s2, 'columnHeader');

      const prev = getFrozenGroupPosition(s2, 'columnHeader');

      scrollX(s2, 100);

      // 移动后，frozen col 和 trailing col 的位置都不变
      expect(getFrozenGroupPosition(s2, 'columnHeader')).toEqual(prev);

      s2.destroy();
    });

    test('should render correct frozen areas for row header is not frozen', async () => {
      const s2 = new PivotSheet(
        container,
        mockDataConfig,
        merge({}, baseOptions, {
          frozen: {
            rowHeader: false,
          },
        }),
      );

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenCol: {
          width: 100,
          x: 0,
          range: [0, 0],
        },
        frozenTrailingCol: {
          width: 100,
          x: 900,
          range: [3, 3],
        },
      });

      expectFrozenGroup(s2, 'columnHeader');
      let prev = getFrozenGroupPosition(s2, 'columnHeader');

      scrollX(s2, 100);

      // 移动后，frozen col 会改变 而 trailing col 的位置不变
      let current = getFrozenGroupPosition(s2, 'columnHeader');

      expect(current[0]?.[0]).toEqual(prev[0]?.[0]! - 100);
      expect(current[1]).toEqual(prev[1]);

      // 移动超过角头宽度
      // 移动后，frozen col 和 trailing col 的位置都不变
      scrollX(s2, 300);

      prev = getFrozenGroupPosition(s2, 'columnHeader');

      scrollX(s2, 300);

      current = getFrozenGroupPosition(s2, 'columnHeader');

      expect(current).toEqual(prev);
      expect(current).toEqual([
        [2, 0, 0],
        [-400, 0, 0],
      ]);

      s2.destroy();
    });
  });
});

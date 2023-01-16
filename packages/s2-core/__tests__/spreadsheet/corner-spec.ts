import * as simpleDataConfig from 'tests/data/simple-data.json';
import { DEFAULT_STYLE, type S2Options, type SpreadSheet } from '../../src';
import { createPivotSheet } from '../util/helpers';

describe('PivotSheet Corner Tests', () => {
  let s2: SpreadSheet;

  const cornerTypes: Array<{
    hierarchyType: S2Options['hierarchyType'];
    showSeriesNumber: S2Options['showSeriesNumber'];
    cornerNodeCount: number;
  }> = [
    { hierarchyType: 'tree', cornerNodeCount: 1, showSeriesNumber: false },
    { hierarchyType: 'grid', cornerNodeCount: 2, showSeriesNumber: false },
    { hierarchyType: 'tree', cornerNodeCount: 2, showSeriesNumber: true },
    { hierarchyType: 'grid', cornerNodeCount: 3, showSeriesNumber: true },
  ];

  beforeEach(() => {
    s2 = createPivotSheet({
      width: 300,
      height: 300,
    });
    s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  // https://github.com/antvis/S2/issues/1929
  test.each(cornerTypes)(
    'should render row corner when columns is empty and measure hidden for %o',
    ({ hierarchyType, cornerNodeCount, showSeriesNumber }) => {
      s2.setDataCfg({
        ...simpleDataConfig,
        fields: {
          ...simpleDataConfig.fields,
          columns: [],
        },
      });
      s2.setOptions({
        hierarchyType,
        showSeriesNumber,
        style: {
          colCfg: {
            hideMeasureColumn: true,
          },
        },
      });
      s2.render();

      const cornerNodes = s2.facet.getCornerNodes();
      const { colsHierarchy } = s2.facet.layoutResult;

      expect(colsHierarchy.width).toEqual(0);
      expect(colsHierarchy.height).toEqual(DEFAULT_STYLE.colCfg.height);
      expect(colsHierarchy.sampleNodeForLastLevel.y).toEqual(0);
      expect(colsHierarchy.sampleNodeForLastLevel.height).toEqual(
        DEFAULT_STYLE.colCfg.height,
      );
      expect(cornerNodes).toHaveLength(cornerNodeCount);
      expect(s2.facet.getCornerNodes()).toMatchSnapshot();
    },
  );

  test.each(cornerTypes)(
    'should render row corner when measure hidden for %o',
    ({ hierarchyType, cornerNodeCount, showSeriesNumber }) => {
      s2.setOptions({
        hierarchyType,
        showSeriesNumber,
        style: {
          colCfg: {
            hideMeasureColumn: true,
          },
        },
      });
      s2.render();

      const cornerNodes = s2.facet.getCornerNodes();
      const { colsHierarchy } = s2.facet.layoutResult;

      expect(colsHierarchy.width).not.toBeLessThan(DEFAULT_STYLE.cellCfg.width);
      expect(colsHierarchy.height).toEqual(DEFAULT_STYLE.colCfg.height);
      expect(colsHierarchy.sampleNodeForLastLevel.y).toEqual(0);
      expect(colsHierarchy.sampleNodeForLastLevel.height).toEqual(
        DEFAULT_STYLE.colCfg.height,
      );
      expect(cornerNodes).toHaveLength(cornerNodeCount);
      expect(s2.facet.getCornerNodes()).toMatchSnapshot();
    },
  );

  test.each(cornerTypes)(
    'should render row corner when columns and values is empty for %o',
    ({ hierarchyType, cornerNodeCount, showSeriesNumber }) => {
      s2.setDataCfg({
        ...simpleDataConfig,
        fields: {
          ...simpleDataConfig.fields,
          columns: [],
          values: [],
        },
      });
      s2.setOptions({
        hierarchyType,
        showSeriesNumber,
      });
      s2.render();

      const cornerNodes = s2.facet.getCornerNodes();
      const { colsHierarchy } = s2.facet.layoutResult;

      expect(colsHierarchy.width).toEqual(0);
      expect(colsHierarchy.height).toEqual(0);
      expect(colsHierarchy.sampleNodeForLastLevel).toBeNull();
      expect(cornerNodes).toHaveLength(cornerNodeCount);
      expect(cornerNodes).toMatchSnapshot();
    },
  );

  test('should not render row corner when fields is empty', () => {
    s2.setDataCfg({
      ...simpleDataConfig,
      fields: {
        rows: [],
        columns: [],
        values: [],
      },
    });
    s2.render();

    const cornerNodes = s2.facet.getCornerNodes();
    const { colsHierarchy } = s2.facet.layoutResult;

    expect(colsHierarchy.width).toEqual(0);
    expect(colsHierarchy.height).toEqual(0);
    expect(colsHierarchy.sampleNodeForLastLevel).toBeNull();
    expect(cornerNodes).toHaveLength(0);
  });
});

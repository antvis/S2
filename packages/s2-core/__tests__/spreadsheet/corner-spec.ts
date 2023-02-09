import * as simpleDataConfig from 'tests/data/simple-data.json';
import { DEFAULT_STYLE, type SpreadSheet } from '../../src';
import { createPivotSheet } from '../util/helpers';

describe('PivotSheet Corner Tests', () => {
  let s2: SpreadSheet;

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
  test('should render row corner when columns is empty and measure hidden', () => {
    s2.setDataCfg({
      ...simpleDataConfig,
      fields: {
        ...simpleDataConfig.fields,
        columns: [],
      },
    });
    s2.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
    });
    s2.render();

    const cornerNodes = s2.facet.getCornerNodes();
    const { colsHierarchy } = s2.facet.layoutResult;

    expect(colsHierarchy.width).toEqual(0);
    expect(colsHierarchy.height).toEqual(DEFAULT_STYLE.colCell!.height);
    expect(colsHierarchy.sampleNodeForLastLevel!.y).toEqual(0);
    expect(colsHierarchy.sampleNodeForLastLevel!.height).toEqual(
      DEFAULT_STYLE.colCell!.height,
    );
    expect(cornerNodes).toHaveLength(2);
  });

  test('should render row corner when measure hidden', () => {
    s2.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
    });
    s2.render();

    const cornerNodes = s2.facet.getCornerNodes();
    const { colsHierarchy } = s2.facet.layoutResult;

    expect(colsHierarchy.width).toEqual(100);
    expect(colsHierarchy.height).toEqual(DEFAULT_STYLE.colCell!.height);
    expect(colsHierarchy.sampleNodeForLastLevel!.y).toEqual(0);
    expect(colsHierarchy.sampleNodeForLastLevel!.height).toEqual(
      DEFAULT_STYLE.colCell!.height,
    );
    expect(cornerNodes).toHaveLength(2);
  });

  test('should render row corner when columns and values is empty', () => {
    s2.setDataCfg({
      ...simpleDataConfig,
      fields: {
        ...simpleDataConfig.fields,
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
    expect(cornerNodes).toHaveLength(2);
  });

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

  test('should customize cornerBbox width and max width when freeze row header', () => {
    // 默认占据一半宽度
    let cornerBBox = s2.facet.cornerBBox;

    expect(cornerBBox.originalWidth).toEqual(192);
    expect(cornerBBox.width).toEqual(150);

    // 自定义冻结宽度
    s2.setOptions({
      frozen: {
        rowHeader: 0.4,
      },
    });
    s2.render();

    cornerBBox = s2.facet.cornerBBox;
    expect(cornerBBox.originalWidth).toEqual(192);
    expect(cornerBBox.width).toEqual(120);
  });
});

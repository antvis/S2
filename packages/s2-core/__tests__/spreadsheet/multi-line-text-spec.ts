import { getContainer } from 'tests/util/helpers';
import { PivotSheet, type SpreadSheet } from '../../src';
import type { DefaultCellTheme, S2CellType, S2Options } from '../../src/common';
import { MultiLineTextDataCfg } from '../data/data-multi-line-text';

const s2Options: S2Options = {
  width: 300,
  height: 400,
  showSeriesNumber: true,
};

describe('SpreadSheet Multi Line Text Tests', () => {
  let s2: SpreadSheet;

  const mapCells = (cells: S2CellType[]) => {
    return cells.map((cell) => {
      const meta = cell.getMeta();

      return {
        actualText: cell.getActualText(),
        originalText: cell.getOriginalText(),
        actualTextWidth: Math.floor(cell.getMultiLineActualTextWidth()),
        actualTextHeight: Math.floor(cell.getMultiLineActualTextHeight()),
        multiLineActualTexts: cell.getMultiLineActualTexts(),
        width: meta.width,
        height: meta.height,
      };
    });
  };

  const updateTheme = (maxLines: number) => {
    const cellTheme: DefaultCellTheme = {
      text: {
        maxLines,
      },
      bolderText: {
        maxLines,
      },
      measureText: {
        maxLines,
      },
    };

    s2.setTheme({
      seriesNumberCell: cellTheme,
      colCell: cellTheme,
      cornerCell: cellTheme,
      rowCell: cellTheme,
      dataCell: cellTheme,
    });
  };

  const getCells = () => [
    s2.facet.getCornerCells(),
    s2.facet.getSeriesNumberCells(),
    s2.facet.getColCells(),
    s2.facet.getRowCells(),
    s2.facet.getDataCells(),
  ];

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), MultiLineTextDataCfg, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should default render two line text', () => {
    getCells().forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();
    });
  });

  test('should custom two max text lines', async () => {
    updateTheme(2);
    await s2.render(false);

    getCells().forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();
    });
  });

  test('should custom three max text lines', async () => {
    updateTheme(3);
    await s2.render(false);

    getCells().forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();
    });
  });

  test('should custom text overflow text', async () => {
    const cellTheme: DefaultCellTheme = {
      text: {
        textOverflow: '@@@',
        maxLines: 1,
      },
      bolderText: {
        textOverflow: '我是省略号',
        maxLines: 1,
      },
      measureText: {
        textOverflow: '😸',
        maxLines: 1,
      },
    };

    s2.setTheme({
      seriesNumberCell: cellTheme,
      colCell: cellTheme,
      cornerCell: cellTheme,
      rowCell: cellTheme,
      dataCell: cellTheme,
    });
    await s2.render(false);

    getCells().forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();
    });
  });

  test('should not render word wrap text', async () => {
    const cellTheme: DefaultCellTheme = {
      text: {
        wordWrap: false,
      },
      bolderText: {
        wordWrap: false,
      },
      measureText: {
        wordWrap: false,
      },
    };

    s2.setTheme({
      seriesNumberCell: cellTheme,
      colCell: cellTheme,
      cornerCell: cellTheme,
      rowCell: cellTheme,
      dataCell: cellTheme,
    });
    await s2.render(false);

    getCells().forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();

      // wordWrap 关闭时, 不会渲染省略号
      cells.forEach((cell) => {
        expect(cell.getActualText()).not.toContain('...');
      });
    });
  });

  test('should force adaptive adjust cell height if custom cell style less than actual text height', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          height: 20,
          heightByField: {
            city: 10,
          },
        },
        colCell: {
          height: 20,
        },
        dataCell: {
          height: 20,
        },
      },
    });

    updateTheme(2);
    await s2.render(false);

    getCells().forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();
    });
  });

  test('should not adaptive adjust cell height if custom cell style more than actual text height', async () => {
    const CUSTOM_CELL_HEIGHT = 70;

    s2.setOptions({
      style: {
        rowCell: {
          height: CUSTOM_CELL_HEIGHT,
        },
        colCell: {
          height: CUSTOM_CELL_HEIGHT,
        },
        dataCell: {
          height: CUSTOM_CELL_HEIGHT,
        },
      },
    });

    updateTheme(2);
    await s2.render(false);

    [
      s2.facet.getCornerCells(),
      s2.facet.getColLeafCells(),
      s2.facet.getRowLeafCells(),
      s2.facet.getDataCells(),
    ].forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();

      cells.forEach((cell) => {
        expect(cell.getMeta().height).toEqual(CUSTOM_CELL_HEIGHT);
      });
    });
  });
});

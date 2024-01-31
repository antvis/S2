/* eslint-disable jest/expect-expect */
import { createPivotSheet, createTableSheet } from 'tests/util/helpers';
import {
  CellType,
  EXTRA_COLUMN_FIELD,
  EXTRA_FIELD,
  type S2DataConfig,
  type TextAlign,
} from '@/common';
import type {
  TextBaseline,
  TextTheme,
  ThemeCfg,
  ThemeName,
} from '@/common/interface/theme';
import type { Node } from '@/facet/layout/node';
import type { PivotSheet } from '@/sheet-type';

describe('SpreadSheet Theme Tests', () => {
  let s2: PivotSheet;

  beforeEach(async () => {
    s2 = createPivotSheet(
      {
        headerActionIcons: [
          {
            icons: ['DrillDownIcon'],
            belongsCell: 'rowCell',
            displayCondition: () => true,
            onClick: () => {},
          },
        ],
      },
      { useSimpleData: false },
    );

    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  describe('Theme Default Value Tests', () => {
    const CELL_TYPES: CellType[] = [
      CellType.DATA_CELL,
      CellType.ROW_CELL,
      CellType.COL_CELL,
      CellType.CORNER_CELL,
      CellType.MERGED_CELL,
    ];

    test('should get theme name', () => {
      expect(s2.getThemeName()).toEqual('default');

      s2.setThemeCfg({
        name: 'dark',
      });

      expect(s2.getThemeName()).toEqual('dark');
    });

    test('should get pivot sheet default theme', () => {
      expect(s2.theme).toMatchSnapshot();
      expect(s2.theme).toEqual(s2.getTheme());
    });

    test('should get table sheet theme', () => {
      const tableSheet = createTableSheet(null);

      expect(tableSheet.theme).toMatchSnapshot();
    });

    test.each(['dark', 'gray', 'colorful', 'default'] as ThemeName[])(
      'should get %s theme',
      (name) => {
        s2.setThemeCfg({
          name,
        });

        expect(s2.theme).toMatchSnapshot();
      },
    );

    test.each(CELL_TYPES)(
      "should assign the same color for %s's text and icon",
      async (cellType: CellType) => {
        s2.setThemeCfg({
          name: 'colorful',
        });
        await s2.render();
        const cellTheme = s2.theme[cellType];

        expect(cellTheme!.bolderText!.fill).toEqual(cellTheme!.icon!.fill);
        expect(cellTheme!.text!.fill).toEqual(cellTheme!.icon!.fill);
        expect(cellTheme!.cell).toBeTruthy();
      },
    );

    test.each(CELL_TYPES)(
      'should set cell for %s',
      async (cellType: CellType) => {
        s2.setThemeCfg({
          name: 'colorful',
        });
        await s2.render();
        const cellTheme = s2.theme[cellType];

        expect(cellTheme!.cell).toBeTruthy();
      },
    );

    test('should set theme correctly', () => {
      s2.setTheme({
        rowCell: {
          seriesNumberWidth: 200,
        },
      });

      expect(s2.theme.rowCell!.seriesNumberWidth).toStrictEqual(200);
    });

    // https://github.com/antvis/S2/issues/1538
    test('should not reset theme palette after updated theme', () => {
      const palette: ThemeCfg['palette'] = {
        basicColors: Array.from({ length: 10 }).fill('red') as string[],
        semanticColors: {
          red: 'red',
          green: 'green',
          yellow: 'yellow',
        },
      };

      s2.setThemeCfg({
        palette,
        theme: {
          rowCell: {
            text: {
              textAlign: 'left',
            },
          },
        },
      });

      s2.setTheme({
        rowCell: {
          seriesNumberWidth: 200,
        },
      });

      expect(s2.theme.background!.color).toStrictEqual('red');
    });
  });

  describe('Custom SVG Icons Tests', () => {
    test('should set custom SVG icon size and color', async () => {
      const iconInfo = {
        name: 'filter',
        size: 30,
        fill: 'red',
      };

      s2.setOptions({
        customSVGIcons: [
          {
            name: iconInfo.name,
            svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
          },
        ],
        headerActionIcons: [
          {
            icons: [iconInfo.name],
            belongsCell: 'rowCell',
          },
        ],
      });
      s2.setTheme({
        rowCell: {
          icon: {
            size: iconInfo.size,
            fill: iconInfo.fill,
          },
          text: {
            fill: 'green',
          },
        },
      });

      await s2.render();

      const rowCell = s2.facet.getRowCells()[0];
      const actionIcon = rowCell.getActionIcons()[0];
      const cfg = actionIcon.getCfg();

      expect(actionIcon.name).toEqual(iconInfo.name);
      expect(cfg.fill).toEqual(iconInfo.fill);
      expect(cfg.width).toEqual(iconInfo.size);
      expect(cfg.height).toEqual(iconInfo.size);
    });
  });

  describe('Row Header Icon Tests', () => {
    const getRowCellThemeCfg = (textAlign: TextAlign) => {
      return {
        theme: {
          rowCell: {
            text: {
              textAlign,
            },
            bolderText: {
              textAlign,
            },
          },
        },
      };
    };

    const TEXT_ALIGNS: TextAlign[] = ['left', 'center', 'right'];

    test.each(TEXT_ALIGNS)(
      'should render correctly icon position when text %s aligned',
      async (align: TextAlign) => {
        s2.setThemeCfg(getRowCellThemeCfg(align));
        await s2.render();

        const rowCell = s2.facet.getRowCells()[0];

        const rowCellWidth = rowCell.getMeta().width;
        const actionIcon = rowCell.getActionIcons()[0];
        const actionIconCfg = actionIcon.getCfg();

        expect(actionIconCfg.x).toBeGreaterThanOrEqual(0);
        expect(
          (actionIconCfg.x as number) + (actionIconCfg.width as number),
        ).toBeLessThanOrEqual(rowCellWidth);
      },
    );
  });

  describe('Measure Fields Theme Tests', () => {
    const expectTextAlign = (options: {
      textAlign: TextAlign;
      fontWight: TextTheme['fontWeight'];
      containsDataCells?: boolean;
      customNodes?: Node[];
    }) => {
      const {
        textAlign,
        fontWight,
        containsDataCells = false,
        customNodes,
      } = options;
      const targetNodes = customNodes || s2.facet.getColLeafNodes();
      const dataCells = s2.facet.getDataCells();

      expect(targetNodes).not.toHaveLength(0);

      if (!containsDataCells) {
        expect(
          targetNodes.every((node) => {
            const nodeTextShape = node.belongsCell!.getTextShape();

            return (
              nodeTextShape.attr('textAlign') === textAlign &&
              nodeTextShape.attr('fontWeight') === fontWight
            );
          }),
        ).toBeTruthy();

        return;
      }

      targetNodes.forEach((node) => {
        const nodeTextShape = node.belongsCell!.getTextShape();
        const isEqualTextAlign = dataCells.every(
          (cell) =>
            cell.getTextShape().attr('textAlign') ===
            nodeTextShape.attr('textAlign'),
        );

        expect(isEqualTextAlign).toBeTruthy();
        expect(nodeTextShape.attr('fontWeight')).toStrictEqual(fontWight);
      });
      expect(dataCells[0].getTextShape().attr('textAlign')).toEqual(textAlign);
    };

    it('should default align column headers with data cells', () => {
      expectTextAlign({
        textAlign: 'right',
        fontWight: 'normal',
        containsDataCells: true,
      });
    });

    it('should render normal font wight and left text align text with row cells', async () => {
      s2.setDataCfg({
        fields: {
          valueInCols: false,
        },
      } as S2DataConfig);

      await s2.render();

      const rowMeasureFields = s2.facet
        .getRowNodes()
        .filter((node) => node.field === EXTRA_FIELD);

      expectTextAlign({
        textAlign: 'left',
        fontWight: 'normal',
        containsDataCells: false,
        customNodes: rowMeasureFields,
      });
    });

    it('should render normal font wight and left text align text with col cell', async () => {
      s2.setDataCfg({
        fields: {
          valueInCols: true,
        },
      } as S2DataConfig);

      await s2.render();

      const colMeasureFields = s2.facet
        .getColNodes()
        .filter((node) => node.field === EXTRA_FIELD);

      expectTextAlign({
        textAlign: 'right',
        fontWight: 'normal',
        containsDataCells: false,
        customNodes: colMeasureFields,
      });
    });

    it.each(['left', 'center', 'right'] as TextAlign[])(
      'should render %s text align for column nodes',
      async (textAlign) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              measureText: {
                textAlign,
              },
            },
          },
        });

        await s2.render(true);

        expectTextAlign({ textAlign, fontWight: 'normal' });
      },
    );

    it.each([
      { isRowCell: true, textAlign: 'left' },
      { isRowCell: true, textAlign: 'center' },
      { isRowCell: true, textAlign: 'right' },
      { isRowCell: false, textAlign: 'left' },
      { isRowCell: false, textAlign: 'center' },
      { isRowCell: false, textAlign: 'right' },
    ] as Array<{ isRowCell: boolean; textAlign: TextAlign }>)(
      'should render %s text align for totals nodes',
      async ({ isRowCell, textAlign }) => {
        s2.setOptions({
          totals: {
            col: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: false,
            },
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: false,
            },
          },
        });

        s2.setThemeCfg({
          theme: {
            colCell: {
              // 小计/总计是加粗字体
              bolderText: {
                textAlign,
              },
            },
            rowCell: {
              bolderText: {
                textAlign,
              },
            },
          },
        });

        await s2.render();

        const rowTotalNodes = s2.facet
          .getRowNodes()
          .filter((node) => node.isTotals);

        const colTotalNodes = s2.facet
          .getColNodes()
          .filter((node) => node.isTotals);

        expectTextAlign({
          textAlign,
          fontWight: 700,
          customNodes: isRowCell ? rowTotalNodes : colTotalNodes,
        });
      },
    );

    it('should not align column headers with data cells and render normal font wight leaf node text if hideValue', async () => {
      s2.setOptions({
        style: {
          colCell: {
            hideValue: true,
          },
        },
        totals: null,
      });
      await s2.render();

      expectTextAlign({
        textAlign: 'center',
        fontWight: 'normal',
      });
    });

    // https://github.com/antvis/S2/pull/1371
    it.each(['left', 'center', 'right'] as TextAlign[])(
      'should render %s text align for column nodes',
      async (textAlign) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              measureText: {
                textAlign,
              },
            },
          },
        });

        s2.setDataCfg({
          fields: {
            columns: [...(s2.dataCfg.fields.columns || []), EXTRA_COLUMN_FIELD],
          },
        } as S2DataConfig);

        s2.setOptions({
          style: {
            colCell: {
              hideValue: true,
            },
          },
        });

        await s2.render(true);

        expectTextAlign({ textAlign, fontWight: 'normal' });
      },
    );
  });

  describe('Series Cell Tests', () => {
    test.each(['top', 'middle', 'bottom'] as TextBaseline[])(
      'should render %s text align for column nodes',
      async (textBaseline) => {
        s2.setThemeCfg({
          theme: {
            rowCell: {
              seriesText: {
                textBaseline,
              },
              bolderText: {
                textBaseline,
              },
            },
          },
        });

        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });

        await s2.render();

        // 浙江省
        const rowCell = s2.facet.getRowCells()[0];
        const rowCellTextShape = rowCell.getTextShape();

        // 序号1
        const seriesCell = s2.facet.getSeriesNumberCells()[0];
        const seriesCellTextShape = seriesCell.getTextShape();

        expect(rowCellTextShape?.attr('textBaseline')).toEqual(textBaseline);
        expect(seriesCellTextShape?.attr('textBaseline')).toEqual(textBaseline);
        expect(rowCellTextShape.attr('y')).toEqual(
          seriesCellTextShape.attr('y'),
        );
      },
    );
  });

  // https://github.com/antvis/S2/issues/1892
  describe('ScrollBar Tests', () => {
    beforeEach(async () => {
      // 保证滚动条很小
      s2.setOptions({
        style: {
          rowCell: {
            width: 5000,
          },
          dataCell: {
            width: 5000,
            height: 5000,
          },
        },
      });
      await s2.render();
    });

    test('should render default min scrollbar size', () => {
      // 行头有分割线, 会减去分割线的宽度 (2px)
      expect(s2.facet.hRowScrollBar.thumbLen).toEqual(30);
      expect(s2.facet.hScrollBar.thumbLen).toEqual(32);
      expect(s2.facet.vScrollBar.thumbLen).toEqual(32);
    });

    test('should render min scrollbar size', async () => {
      s2.setTheme({
        scrollBar: {
          thumbHorizontalMinSize: 20,
          thumbVerticalMinSize: 10,
        },
      });

      await s2.render();

      // 行头有分割线, 会减去分割线的宽度 (2px)
      expect(s2.facet.hRowScrollBar.thumbLen).toEqual(18);
      expect(s2.facet.hScrollBar.thumbLen).toEqual(20);
      expect(s2.facet.vScrollBar.thumbLen).toEqual(10);
    });

    test('should render real scrollbar size', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            width: 400,
          },
          dataCell: {
            width: 200,
            height: 50,
          },
        },
      });
      await s2.render();

      // 行头有分割线, 会减去分割线的宽度 (2px)
      expect(s2.facet.hRowScrollBar.thumbLen).not.toBeLessThanOrEqual(30);
      expect(s2.facet.hScrollBar.thumbLen).not.toBeLessThanOrEqual(32);
      expect(s2.facet.vScrollBar.thumbLen).not.toBeLessThanOrEqual(32);
    });
  });
});

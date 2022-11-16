/* eslint-disable jest/expect-expect */
import { createPivotSheet } from 'tests/util/helpers';
import type { IGroup, ShapeAttrs } from '@antv/g-canvas';
import { get } from 'lodash';
import type {
  TextBaseline,
  TextTheme,
  ThemeCfg,
} from '@/common/interface/theme';
import type { PivotSheet } from '@/sheet-type';
import {
  CellTypes,
  EXTRA_COLUMN_FIELD,
  EXTRA_FIELD,
  type S2DataConfig,
  type TextAlign,
} from '@/common';
import type { RowCell } from '@/cell';
import type { Node } from '@/facet/layout/node';

describe('SpreadSheet Theme Tests', () => {
  let s2: PivotSheet;

  beforeAll(() => {
    s2 = createPivotSheet(
      {
        headerActionIcons: [
          {
            iconNames: ['DrillDownIcon'],
            belongsCell: 'rowCell',
            displayCondition: () => true,
            action: () => {},
          },
        ],
      },
      { useSimpleData: false },
    );

    s2.render();
  });

  afterAll(() => {
    s2.destroy();
  });

  describe('Theme Default Value Tests', () => {
    const CELL_TYPES: CellTypes[] = [
      CellTypes.DATA_CELL,
      CellTypes.ROW_CELL,
      CellTypes.COL_CELL,
      CellTypes.CORNER_CELL,
      CellTypes.MERGED_CELL,
    ];

    test.each(CELL_TYPES)(
      "should assign the same color for %s's text and icon",
      (cellType: CellTypes) => {
        s2.setThemeCfg({
          name: 'colorful',
        });
        s2.render();
        const cellTheme = s2.theme[cellType];

        expect(cellTheme.bolderText.fill).toEqual(cellTheme.icon.fill);
        expect(cellTheme.text.fill).toEqual(cellTheme.icon.fill);
        expect(cellTheme.cell).toBeTruthy();
      },
    );

    test.each(CELL_TYPES)('should set cell for %s', (cellType: CellTypes) => {
      s2.setThemeCfg({
        name: 'colorful',
      });
      s2.render();
      const cellTheme = s2.theme[cellType];

      expect(cellTheme.cell).toBeTruthy();
    });

    test('should set theme correctly', () => {
      s2.setTheme({
        rowCell: {
          seriesNumberWidth: 200,
        },
      });

      expect(s2.theme.rowCell.seriesNumberWidth).toStrictEqual(200);
    });

    // https://github.com/antvis/S2/issues/1538
    test('should not reset theme palette after updated theme', () => {
      const palette: ThemeCfg['palette'] = {
        basicColors: Array.from({ length: 10 }).fill('red') as string[],
        semanticColors: {
          red: 'red',
          green: 'green',
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

      expect(s2.theme.background.color).toStrictEqual('red');
    });
  });

  describe('Custom SVG Icon Tests', () => {
    test('should set custom SVG icon size and color', () => {
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
            iconNames: [iconInfo.name],
            belongsCell: 'rowCell',
          },
        ],
      });
      s2.setThemeCfg({
        theme: {
          rowCell: {
            icon: {
              size: iconInfo.size,
              fill: iconInfo.fill,
            },
            text: {
              fill: 'green',
            },
          },
        },
      });
      s2.render();
      const rowCell = s2.facet.rowHeader.getFirst() as RowCell;
      const actionIconCfg: ShapeAttrs = get(rowCell, 'actionIcons.[0].cfg');

      expect(actionIconCfg.fill).toEqual(iconInfo.fill);
      expect(actionIconCfg.name).toEqual(iconInfo.name);
      expect(actionIconCfg.width).toEqual(iconInfo.size);
      expect(actionIconCfg.height).toEqual(iconInfo.size);
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
      (align: TextAlign) => {
        s2.setThemeCfg(getRowCellThemeCfg(align));
        s2.render();

        const rowCell = s2.facet.rowHeader.getFirst() as RowCell;

        const rowCellWidth = get(rowCell, 'meta.width');
        const actionIconCfg: ShapeAttrs = get(rowCell, 'actionIcons.[0].cfg');

        expect(actionIconCfg.x).toBeGreaterThanOrEqual(0);
        expect(actionIconCfg.x + actionIconCfg.width).toBeLessThanOrEqual(
          rowCellWidth,
        );
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
      const targetNodes = customNodes || s2.getColumnLeafNodes();
      const dataCells = s2.interaction.getPanelGroupAllDataCells();

      expect(targetNodes).not.toHaveLength(0);

      if (!containsDataCells) {
        expect(
          targetNodes.every((node) => {
            const nodeTextShape = node.belongsCell.getTextShape();
            return (
              nodeTextShape.attr('textAlign') === textAlign &&
              nodeTextShape.attr('fontWeight') === fontWight
            );
          }),
        ).toBeTruthy();
        return;
      }

      targetNodes.forEach((node) => {
        const nodeTextShape = node.belongsCell.getTextShape();
        const isEqualTextAlign = dataCells.every((cell) => {
          return (
            cell.getTextShape().attr('textAlign') ===
            nodeTextShape.attr('textAlign')
          );
        });
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

    it('should render normal font wight and left text align text with row cells', () => {
      s2.setDataCfg({
        fields: {
          valueInCols: false,
        },
      } as S2DataConfig);

      s2.render();

      const rowMeasureFields = s2
        .getRowNodes()
        .filter((node) => node.field === EXTRA_FIELD);

      expectTextAlign({
        textAlign: 'left',
        fontWight: 'normal',
        containsDataCells: false,
        customNodes: rowMeasureFields,
      });
    });

    it('should render normal font wight and left text align text with col cell', () => {
      s2.setDataCfg({
        fields: {
          valueInCols: true,
        },
      } as S2DataConfig);

      s2.render();

      const colMeasureFields = s2
        .getColumnNodes()
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
      (textAlign) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              measureText: {
                textAlign,
              },
            },
          },
        });

        s2.render(true);

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
      ({ isRowCell, textAlign }) => {
        s2.setOptions({
          totals: {
            col: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseLayout: true,
              reverseSubLayout: false,
            },
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseLayout: true,
              reverseSubLayout: false,
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

        s2.render();

        const rowTotalNodes = s2.getRowNodes().filter((node) => node.isTotals);

        const colTotalNodes = s2
          .getColumnNodes()
          .filter((node) => node.isTotals);

        expectTextAlign({
          textAlign,
          fontWight: 700,
          customNodes: isRowCell ? rowTotalNodes : colTotalNodes,
        });
      },
    );

    it('should not align column headers with data cells and render normal font wight leaf node text if hideMeasureColumn', () => {
      s2.setOptions({
        style: {
          colCfg: {
            hideMeasureColumn: true,
          },
        },
        totals: null,
      });
      s2.render();

      expectTextAlign({
        textAlign: 'center',
        fontWight: 'normal',
      });
    });

    // https://github.com/antvis/S2/pull/1371
    it.each(['left', 'center', 'right'] as TextAlign[])(
      'should render %s text align for column nodes',
      (textAlign) => {
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
            columns: [...s2.dataCfg.fields.columns, EXTRA_COLUMN_FIELD],
          },
        } as S2DataConfig);

        s2.setOptions({
          style: {
            colCfg: {
              hideMeasureColumn: true,
            },
          },
        });

        s2.render(true);

        expectTextAlign({ textAlign, fontWight: 'normal' });
      },
    );
  });

  describe('Series Cell Tests', () => {
    const getTextShape = (group: IGroup) => {
      return group
        .getChildren()
        .find((child) => child instanceof child.getShapeBase().Text);
    };

    test.each(['top', 'middle', 'bottom'] as TextBaseline[])(
      'should render %s text align for column nodes',
      (textBaseline) => {
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
          showSeriesNumber: true,
        });

        s2.render();

        const rowCell = s2.facet.rowHeader.getChildByIndex(0) as IGroup; // 浙江省
        const textOfRowCell = getTextShape(rowCell);

        const seriesCell = s2.facet.rowIndexHeader.getChildByIndex(3) as IGroup; // 序号1
        const textOfSeriesCell = getTextShape(seriesCell);
        expect(textOfRowCell.attr('textBaseline')).toEqual(textBaseline);
        expect(textOfSeriesCell.attr('textBaseline')).toEqual('top');
        expect(textOfRowCell.attr('y')).toEqual(textOfSeriesCell.attr('y'));
      },
    );
  });
});

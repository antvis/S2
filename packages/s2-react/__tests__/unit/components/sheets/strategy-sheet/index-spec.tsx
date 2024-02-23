/* eslint-disable max-classes-per-file */
import {
  CellType,
  CornerNodeType,
  InteractionStateName,
  RowCell,
  SpreadSheet,
  customMerge,
  getCellMeta,
  type GEvent,
  type S2DataConfig,
} from '@antv/s2';
import { waitFor } from '@testing-library/react';
import React from 'react';
import {
  StrategyOptions,
  StrategySheetDataConfig,
} from '../../../../data/strategy-data';
import { getContainer, renderComponent } from '../../../../util/helpers';
import { strategyCopy } from '@/components/export/strategy-copy';
import {
  SheetComponent,
  StrategySheetColCell,
  StrategySheetDataCell,
  type SheetComponentOptions,
} from '@/components';

describe('<StrategySheet/> Tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    container.remove();
  });

  const renderStrategySheet = (
    options: SheetComponentOptions | null,
    dataCfg?: S2DataConfig,
  ) => {
    renderComponent(
      <SheetComponent
        sheetType="strategy"
        options={customMerge(
          {
            width: 200,
            height: 200,
          },
          options,
        )}
        dataCfg={dataCfg as S2DataConfig}
        onMounted={(instance) => {
          s2 = instance;
        }}
      />,
      container,
    );
  };

  test('should overwrite strategy sheet tooltip data cell content', async () => {
    const content = 'custom';

    const s2Options: SheetComponentOptions = {
      tooltip: {
        dataCell: {
          content,
        },
      },
    };

    renderStrategySheet(s2Options);

    await waitFor(() => {
      expect(s2!.options.tooltip!.dataCell!.content).toEqual(content);
    });
  });

  test('should hide value if only one value field', async () => {
    const s2Options: SheetComponentOptions = {
      hierarchyType: 'grid',
    };

    const s2DataConfig: S2DataConfig = {
      data: [],
      fields: {
        values: ['a'],
      },
    };

    renderStrategySheet(s2Options, s2DataConfig);

    await waitFor(() => {
      expect(s2.options!.style!.colCell!.hideValue).toBeTruthy();
    });
  });

  test('should enable hidden columns operation', async () => {
    renderStrategySheet(null);

    await waitFor(() => {
      expect(s2.options!.tooltip!.operation!.hiddenColumns).toBeTruthy();
    });
  });

  test.each([
    CellType.ROW_CELL,
    CellType.COL_CELL,
    CellType.DATA_CELL,
  ] as const)(
    'should overwrite strategy sheet default custom tooltip and render custom %s tooltip',
    async (cellType) => {
      const content = `${cellType} test content`;

      renderStrategySheet({
        tooltip: {
          enable: true,
          [cellType]: {
            content: () => <div>{content}</div>,
          },
        },
      });

      await waitFor(() => {
        jest.spyOn(s2, 'getCellType').mockReturnValueOnce(cellType);
        s2.showTooltipWithInfo({} as GEvent, []);

        expect(s2!.tooltip.container!.innerText).toEqual(content);
      });
    },
  );

  test('should get current cell custom tooltip content', () => {
    renderStrategySheet({
      tooltip: {
        enable: true,
        rowCell: {
          content: () => <div>{CellType.ROW_CELL}</div>,
        },
        dataCell: {
          content: () => <div>{CellType.DATA_CELL}</div>,
        },
      },
    });

    jest.spyOn(s2, 'getCellType').mockReturnValueOnce(CellType.COL_CELL);

    s2.showTooltipWithInfo({} as GEvent, []);

    [CellType.ROW_CELL, CellType.DATA_CELL].forEach((content) => {
      expect(s2.tooltip.container!.innerText).not.toEqual(content);
    });
  });

  test('should render correctly KPI bullet column measure text', async () => {
    renderStrategySheet(
      {
        width: 6000,
        height: 600,
      },
      StrategySheetDataConfig,
    );

    await waitFor(() => {
      // 当前测试数据, 第 4 列是子弹图
      const dataCell = s2.facet.getDataCells().filter((cell) => {
        const meta = cell.getMeta();

        return meta.colIndex === 3 && meta.fieldValue;
      });

      const bulletMeasureTextList = dataCell.map((cell) => {
        const textShape = cell.children.find(
          (child) => child.nodeName === 'text',
        );

        return textShape?.textContent;
      });

      expect(bulletMeasureTextList).toStrictEqual([
        '0.25%',
        '-82.61%',
        '1073.92%',
        '50.00%',
        '9.78%',
      ]);
    });
  });

  test('should get custom corner extra field text', async () => {
    const cornerExtraFieldText = '自定义';
    const s2DataCfg: Partial<S2DataConfig> = {
      fields: {
        ...StrategySheetDataConfig.fields,
        valueInCols: false,
      },
    };

    const s2Options: SheetComponentOptions = {
      cornerExtraFieldText,
    };

    renderStrategySheet(s2Options, {
      ...StrategySheetDataConfig,
      ...s2DataCfg,
    });

    await waitFor(() => {
      const cornerNode = s2.facet
        .getCornerNodes()
        .find((node) => node.cornerType === CornerNodeType.Row);

      const textList = s2.facet.getCornerNodes().map((node) => node.value);
      const cornerText = `自定义节点A/指标E/${cornerExtraFieldText}`;

      expect(textList).toEqual([cornerText, '日期']);
      expect(cornerNode!.value).toEqual(cornerText);
    });
  });

  test('should format corner date field', async () => {
    renderStrategySheet(
      {
        width: 600,
        height: 600,
      },
      {
        ...StrategySheetDataConfig,
        meta: [
          {
            field: 'date',
            name: '日期',
          },
        ],
      },
    );

    await waitFor(() => {
      const cornerTextList = s2.facet
        .getCornerCells()
        .map((cell) => cell.getActualText());

      expect(cornerTextList).toEqual(['自定义节点A/指标E/数值', '日期']);
    });
  });

  test('should format corner date field for custom corner text', async () => {
    renderStrategySheet(
      {
        width: 600,
        height: 600,
        cornerText: '测试',
      },
      {
        ...StrategySheetDataConfig,
        meta: [
          {
            field: 'date',
            name: '日期',
          },
        ],
      },
    );

    await waitFor(() => {
      const cornerTextList = s2.facet
        .getCornerCells()
        .map((cell) => cell.getActualText());

      expect(cornerTextList).toEqual(['测试', '日期']);
    });
  });

  test('should render correctly row nodes', async () => {
    renderStrategySheet(
      {
        width: 6000,
        height: 600,
      },
      StrategySheetDataConfig,
    );

    await waitFor(() => {
      const rowNodes = s2.facet.getRowNodes().map((node) => {
        return {
          field: node.field,
          value: node.value,
        };
      });

      expect(rowNodes).toMatchSnapshot();
    });
  });

  describe('StrategySheet Export Tests', () => {
    beforeEach(() => {
      renderStrategySheet(StrategyOptions, StrategySheetDataConfig);
    });

    test('should export correct data', async () => {
      await waitFor(() => {
        const result = strategyCopy({
          sheetInstance: s2,
          split: '\t',
          formatOptions: true,
        });

        /*
         * 角头部分展示如下：
         * ["", "","日期"]
         * ["", "","指标"]
         */
        const rows = result.split('\n');
        const corner1 = rows[0].split('\t').slice(0, 3);
        const corner2 = rows[1].split('\t').slice(0, 3);

        expect(result).toMatchSnapshot();
        expect(corner1).toEqual(['', '', '日期']);
        expect(corner2).toEqual(['', '', '指标']);
      });
    });

    test('should export correct data for default corner text', async () => {
      await waitFor(() => {
        s2.setOptions({
          cornerText: undefined,
        });

        const result = strategyCopy({
          sheetInstance: s2,
          split: '\t',
          formatOptions: true,
        });

        expect(result).toMatchSnapshot();
      });
    });

    test('should export correct data for custom corner text', async () => {
      await waitFor(() => {
        s2.setOptions({
          cornerText: '自定义',
        });

        const result = strategyCopy({
          sheetInstance: s2,
          split: '\t',
          formatOptions: true,
        });

        expect(result).toMatchSnapshot();
      });
    });

    test('should export correct data for multi different cycle compare data', async () => {
      await waitFor(() => {
        /*
         * 列头部分不同粒度的列头包含不同的同环比个数
         * 2022-09 包含 [数值，环比，同比]
         * 2022-10 包含 [数值，环比]
         * 它们都应和各自的列头数值一栏对齐
         */
        const result = strategyCopy({
          sheetInstance: s2,
          split: '\t',
          formatOptions: true,
        });

        const rows = result.split('\n');
        const col1: string[] = rows[0].split('\t').slice(3);
        const col2: string[] = rows[1].split('\t').slice(3);

        expect(result).toMatchSnapshot();
        expect(col1.length).toEqual(col2.length);
        // 2022-09 对齐其数值
        const idx1 = col1.findIndex((col) => col === '2022-09');

        expect(col2[idx1]).toEqual('数值');
        // 2022-10 对齐其数值
        const idx2 = col1.findIndex((col) => col === '2022-10');

        expect(col2[idx2]).toEqual('数值');
      });
    });

    test('should export correct data for empty cell', async () => {
      await waitFor(() => {
        /*
         * 2022-09 包含 [数值，环比，同比], 但是数值均为空
         * 对应数据应该空三格
         */
        const result = strategyCopy({
          sheetInstance: s2,
          split: '\t',
          formatOptions: true,
        });

        const rows = result.split('\n');
        // 自定义节点A - 指标A
        const detailRow: string[] = rows[3].split('\t').slice(0, 5);

        expect(result).toMatchSnapshot();
        expect(detailRow).toEqual(['自定义节点A', '指标A', '', '', '']);
      });
    });

    test('should export correct headers when label have array and string', async () => {
      await waitFor(() => {
        const result = strategyCopy({
          sheetInstance: s2,
          split: '\t',
          formatOptions: true,
        });
        const rows = result.split('\n');

        expect(rows[0].split('\t')[8]).toEqual('2022-11');
        expect(rows[0].split('\t')[11]).toEqual('2021年净增完成度');
        expect(rows[0].split('\t')[12]).toEqual('趋势');
        expect(rows[0].split('\t')[13]).toEqual('2022');
        expect(rows[1].split('\t')[8]).toEqual('数值');
        expect(rows[1].split('\t')[9]).toEqual('环比');
        expect(rows[1].split('\t')[10]).toEqual('同比');
        expect(rows[1].split('\t')[11]).toEqual('净增完成度');
        expect(rows[1].split('\t')[12]).toEqual('趋势');
        expect(rows[1].split('\t')[13]).toEqual('数值');
      });
    });
  });

  describe('StrategySheet Interaction Tests', () => {
    beforeEach(() => {
      renderStrategySheet(
        {
          ...StrategyOptions,
          width: 800,
          height: 800,
          interaction: {
            selectedCellsSpotlight: true,
          },
        },
        StrategySheetDataConfig,
      );
    });

    // https://github.com/antvis/S2/issues/1960
    it('should selected cell and update spotlight style', async () => {
      await waitFor(() => {
        const dataCellId =
          'root[&]custom-node-1[&]measure-a-root[&]2022-11[&]["数值","环比","同比"]';

        const selectedDataCell = s2.facet.getCellById(dataCellId)!;

        s2.interaction.changeState({
          cells: [getCellMeta(selectedDataCell)],
          stateName: InteractionStateName.SELECTED,
        });

        const allDataCells = s2.facet.getDataCells();
        const unSelectedDataCells = s2.interaction.getUnSelectedDataCells();

        expect(allDataCells).toHaveLength(30);
        // 选中一个
        expect(unSelectedDataCells).toHaveLength(29);
        // 其余置灰
        unSelectedDataCells
          .filter((cell) => cell.getTextShape())
          .forEach((cell) => {
            const textShape = cell.getTextShape();

            expect(textShape.attr('fillOpacity')).toEqual(0.3);
          });
      });
    });
  });

  test('should overwrite strategy sheet row cell', async () => {
    const fn = jest.fn();

    class CustomRowCell extends RowCell {
      public drawTextShape() {
        fn();

        return super.drawTextShape();
      }
    }

    const s2Options: SheetComponentOptions = {
      rowCell: (...args) => new CustomRowCell(...args),
    };

    renderStrategySheet(s2Options, StrategySheetDataConfig);

    await waitFor(() => {
      expect(fn).toHaveBeenCalled();
    });
  });

  test('should overwrite strategy sheet col cell', async () => {
    const fn = jest.fn();

    class CustomColCell extends StrategySheetColCell {
      public drawTextShape() {
        fn();

        return super.drawTextShape();
      }
    }

    const s2Options: SheetComponentOptions = {
      colCell: (...args) => new CustomColCell(...args),
    };

    renderStrategySheet(s2Options, StrategySheetDataConfig);

    await waitFor(() => {
      expect(fn).toHaveBeenCalled();
    });
  });

  test('should overwrite strategy sheet data cell', async () => {
    const fn = jest.fn();

    class CustomDataCell extends StrategySheetDataCell {
      public drawTextShape() {
        fn();

        return super.drawTextShape();
      }
    }

    const s2Options: SheetComponentOptions = {
      dataCell: (viewMeta) =>
        new CustomDataCell(viewMeta, viewMeta.spreadsheet),
    };

    renderStrategySheet(s2Options, StrategySheetDataConfig);

    await waitFor(() => {
      expect(fn).toHaveBeenCalled();
    });
  });

  test('should render custom text style by conditions', async () => {
    const s2Options: SheetComponentOptions = {
      width: 800,
      height: 600,
      conditions: {
        text: [
          {
            mapping: () => {
              return {
                fill: 'red',
                fontWeight: 800,
                fontSize: 20,
              };
            },
          },
        ],
      },
    };

    renderStrategySheet(s2Options, StrategySheetDataConfig);

    await waitFor(() => {
      const dataCellTextShapes = s2.facet
        .getDataCells()
        .filter((cell) => {
          const meta = cell.getMeta();

          return meta.colIndex === 1 && meta.fieldValue;
        })
        .map((cell) => cell.getTextShapes())
        .flat();

      dataCellTextShapes.forEach((text) => {
        const { fill, fontSize, fontWeight } = text.attributes;

        expect(fill).toEqual('red');
        expect(fontSize).toEqual(20);
        expect(fontWeight).toEqual(800);
      });
    });
  });
});

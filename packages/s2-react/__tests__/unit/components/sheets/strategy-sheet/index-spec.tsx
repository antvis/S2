/* eslint-disable max-classes-per-file */
import {
  CellType,
  customMerge,
  getCellMeta,
  InteractionStateName,
  SpreadSheet,
  type S2DataConfig,
  type GEvent,
  RowCell,
} from '@antv/s2';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { get } from 'lodash';
import { getContainer } from '../../../../util/helpers';
import {
  StrategySheetDataConfig,
  StrategyOptions,
} from '../../../../data/strategy-data';
import {
  SheetComponent,
  StrategySheetColCell,
  StrategySheetDataCell,
  type SheetComponentOptions,
} from '@/components';
import { strategyCopy } from '@/components/export/strategy-copy';

describe('<StrategySheet/> Tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  const renderStrategySheet = (
    options: SheetComponentOptions | null,
    dataCfg?: S2DataConfig,
  ) => {
    act(() => {
      ReactDOM.render(
        <SheetComponent
          sheetType="strategy"
          options={customMerge(
            {
              width: 200,
              height: 200,
            },
            options,
            { debug: true },
          )}
          dataCfg={dataCfg as S2DataConfig}
          onMounted={(instance) => {
            s2 = instance;
          }}
        />,
        container,
      );
    });
  };

  test('should overwrite strategy sheet tooltip data cell content', () => {
    const content = 'custom';

    const s2Options: SheetComponentOptions = {
      tooltip: {
        dataCell: {
          content,
        },
      },
    };

    renderStrategySheet(s2Options);

    expect(s2!.options.tooltip!.dataCell!.content).toEqual(content);
  });

  test('should hide value if only one value field', () => {
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

    expect(s2.options!.style!.colCell!.hideValue).toBeTruthy();
  });

  test('should enable hidden columns operation', () => {
    renderStrategySheet(null);

    expect(s2.options!.tooltip!.operation!.hiddenColumns).toBeTruthy();
  });

  test.each([
    CellType.ROW_CELL,
    CellType.COL_CELL,
    CellType.DATA_CELL,
  ] as const)(
    'should overwrite strategy sheet default custom tooltip and render custom %s tooltip',
    (cellType) => {
      const content = `${cellType} test content`;

      renderStrategySheet({
        tooltip: {
          showTooltip: true,
          [cellType]: {
            content: () => <div>{content}</div>,
          },
        },
      });

      jest.spyOn(s2, 'getCellType').mockReturnValueOnce(cellType);

      s2.showTooltipWithInfo({} as GEvent, []);

      expect(s2!.tooltip.container!.innerText).toEqual(content);
    },
  );

  test('should render correctly KPI bullet column measure text', () => {
    renderStrategySheet(
      {
        width: 6000,
        height: 600,
      },
      StrategySheetDataConfig,
    );

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

  test('should format corner date field', () => {
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

    const textList = s2.facet.cornerHeader.children.map((element) =>
      get(element, 'actualText'),
    );

    expect(textList).toEqual(['自定义节点A/指标E/指标', '日期']);
  });

  test('should format corner date field for custom corner text', () => {
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

    const textList = s2.facet.cornerHeader.children.map((element) =>
      get(element, 'actualText'),
    );

    expect(textList).toEqual(['测试', '日期']);
  });

  test('should render correctly row nodes', () => {
    renderStrategySheet(
      {
        width: 6000,
        height: 600,
      },
      StrategySheetDataConfig,
    );

    const rowNodes = s2.facet.getRowNodes().map((node) => {
      return {
        field: node.field,
        value: node.value,
      };
    });

    expect(rowNodes).toMatchSnapshot();
  });

  describe('StrategySheet Export Tests', () => {
    beforeEach(() => {
      renderStrategySheet(StrategyOptions, StrategySheetDataConfig);
    });

    test('should export correct data', () => {
      const result = strategyCopy(s2, '\t', true);

      /*
       * 角头部分展示如下：
       * ["", "","日期"]
       * ["", "","指标"]
       */
      const rows = result.split('\n');
      const corner1 = rows[0].split('\t').slice(0, 3);
      const corner2 = rows[1].split('\t').slice(0, 3);

      expect(result).toMatchInlineSnapshot(`
        "		日期	2022-09			2022-10		2022-11			2021年净增完成度	趋势	2022
        		指标	数值	环比	同比	数值	环比	数值	环比	同比	净增完成度	趋势	数值	环比
        自定义节点A												-
        自定义节点A	指标A					377		3877	4324	42%	-	-	377
        自定义节点A	指标A	指标B				377	324	377	324	-0.02	-	-	377	324
        自定义节点A	指标A	自定义节点B
        自定义节点A	指标A	指标C					324	377	0		-	-		324
        自定义节点A	指标A	指标D				377	324	377	324	0.02	-	-	377	324
        自定义节点A	自定义节点E
        指标E								377	324	0.02	-	-
        指标E	自定义节点C
        指标E	自定义节点D													"
      `);
      expect(corner1).toEqual(['', '', '日期']);
      expect(corner2).toEqual(['', '', '指标']);
    });

    test('should export correct data for multi different cycle compare data', () => {
      /*
       * 列头部分不同粒度的列头包含不同的同环比个数
       * 2022-09 包含 [数值，环比，同比]
       * 2022-10 包含 [数值，环比]
       * 它们都应和各自的列头数值一栏对齐
       */
      const result = strategyCopy(s2, '\t', true);

      const rows = result.split('\n');
      const col1: string[] = rows[0].split('\t').slice(3);
      const col2: string[] = rows[1].split('\t').slice(3);

      expect(result).toMatchInlineSnapshot(`
        "		日期	2022-09			2022-10		2022-11			2021年净增完成度	趋势	2022
        		指标	数值	环比	同比	数值	环比	数值	环比	同比	净增完成度	趋势	数值	环比
        自定义节点A												-
        自定义节点A	指标A					377		3877	4324	42%	-	-	377
        自定义节点A	指标A	指标B				377	324	377	324	-0.02	-	-	377	324
        自定义节点A	指标A	自定义节点B
        自定义节点A	指标A	指标C					324	377	0		-	-		324
        自定义节点A	指标A	指标D				377	324	377	324	0.02	-	-	377	324
        自定义节点A	自定义节点E
        指标E								377	324	0.02	-	-
        指标E	自定义节点C
        指标E	自定义节点D													"
      `);
      expect(col1.length).toEqual(col2.length);
      // 2022-09 对齐其数值
      const idx1 = col1.findIndex((col) => col === '2022-09');

      expect(col2[idx1]).toEqual('数值');
      // 2022-10 对齐其数值
      const idx2 = col1.findIndex((col) => col === '2022-10');

      expect(col2[idx2]).toEqual('数值');
    });

    test('should export correct data for empty cell', () => {
      /*
       * 2022-09 包含 [数值，环比，同比], 但是数值均为空
       * 对应数据应该空三格
       */
      const result = strategyCopy(s2, '\t', true);

      const rows = result.split('\n');
      // 自定义节点A - 指标A
      const detailRow: string[] = rows[3].split('\t').slice(0, 5);

      expect(result).toMatchInlineSnapshot(`
        "		日期	2022-09			2022-10		2022-11			2021年净增完成度	趋势	2022
        		指标	数值	环比	同比	数值	环比	数值	环比	同比	净增完成度	趋势	数值	环比
        自定义节点A												-
        自定义节点A	指标A					377		3877	4324	42%	-	-	377
        自定义节点A	指标A	指标B				377	324	377	324	-0.02	-	-	377	324
        自定义节点A	指标A	自定义节点B
        自定义节点A	指标A	指标C					324	377	0		-	-		324
        自定义节点A	指标A	指标D				377	324	377	324	0.02	-	-	377	324
        自定义节点A	自定义节点E
        指标E								377	324	0.02	-	-
        指标E	自定义节点C
        指标E	自定义节点D													"
      `);
      expect(detailRow).toEqual(['自定义节点A', '指标A', '', '', '']);
    });

    test('should export correct headers when label have array and string', () => {
      const result = strategyCopy(s2, '\t', true);
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

  describe('StrategySheet Interaction Tests', () => {
    beforeEach(() => {
      renderStrategySheet(
        {
          ...StrategyOptions,
          interaction: {
            selectedCellsSpotlight: true,
          },
        },
        StrategySheetDataConfig,
      );
    });

    // https://github.com/antvis/S2/issues/1960
    it('should selected cell and update spotlight style', () => {
      const dataCellId = `root[&]自定义节点A[&]指标A-root[&]2022-11[&]["数值","环比","同比"]`;

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

  test('should overwrite strategy sheet row cell', () => {
    const fn = jest.fn();

    class CustomRowCell extends RowCell {
      protected drawTextShape() {
        fn();

        return super.drawTextShape();
      }
    }

    const s2Options: SheetComponentOptions = {
      rowCell: (...args) => new CustomRowCell(...args),
    };

    renderStrategySheet(s2Options, StrategySheetDataConfig);

    expect(fn).toHaveBeenCalled();
  });

  test('should overwrite strategy sheet col cell', () => {
    const fn = jest.fn();

    class CustomColCell extends StrategySheetColCell {
      protected drawTextShape() {
        fn();

        return super.drawTextShape();
      }
    }

    const s2Options: SheetComponentOptions = {
      colCell: (...args) => new CustomColCell(...args),
    };

    renderStrategySheet(s2Options, StrategySheetDataConfig);

    expect(fn).toHaveBeenCalled();
  });

  test('should overwrite strategy sheet data cell', () => {
    const fn = jest.fn();

    class CustomDataCell extends StrategySheetDataCell {
      protected drawTextShape() {
        fn();

        return super.drawTextShape();
      }
    }

    const s2Options: SheetComponentOptions = {
      dataCell: (viewMeta) =>
        new CustomDataCell(viewMeta, viewMeta.spreadsheet),
    };

    renderStrategySheet(s2Options, StrategySheetDataConfig);

    expect(fn).toHaveBeenCalled();
  });

  test('should render custom text style by conditions', () => {
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

import type { Event as GEvent } from '@antv/g-canvas';
import {
  CellTypes,
  copyData,
  customMerge,
  SpreadSheet,
  type S2DataConfig,
} from '@antv/s2';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { expectSelectedCellsSpotlight } from '@antv/s2-shared/__tests__/util/helpers';
import {
  SheetComponent,
  SheetComponentOptions,
} from '../../../../../src/components';
import { getContainer } from '../../../../util/helpers';
import {
  StrategySheetDataConfig,
  StrategyOptions,
} from '../../../../data/strategy-data';

describe('<StrategySheet/> Tests', () => {
  let s2: SpreadSheet;
  let container: HTMLDivElement;

  beforeAll(() => {
    container = getContainer();
  });

  afterAll(() => {
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
        data: {
          content,
        },
      },
    };

    renderStrategySheet(s2Options);

    expect(s2.options.tooltip.data.content).toEqual(content);
  });

  test('should replace hierarchyType with "customTree" when rows is empty and contains custom tree items', () => {
    const s2Options: SheetComponentOptions = {
      hierarchyType: 'grid',
    };

    const s2DataConfig: S2DataConfig = {
      data: [],
      fields: {
        rows: [],
        customTreeItems: [
          {
            key: '1',
            title: '1',
          },
        ],
      },
    };

    renderStrategySheet(s2Options, s2DataConfig);

    expect(s2.options.hierarchyType).toEqual('customTree');
  });

  test('should hideMeasureColumn if only one value field', () => {
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

    expect(s2.options.style.colCfg.hideMeasureColumn).toBeTruthy();
  });

  test('should enable hidden columns operation', () => {
    renderStrategySheet(null);

    expect(s2.options.tooltip.operation.hiddenColumns).toBeTruthy();
  });

  test.each([CellTypes.ROW_CELL, CellTypes.COL_CELL, CellTypes.DATA_CELL])(
    'should overwrite strategy sheet default custom tooltip and render custom %s tooltip',
    (cellType) => {
      const content = `${cellType} test content`;
      const cell = {
        [CellTypes.ROW_CELL]: 'row',
        [CellTypes.COL_CELL]: 'col',
        [CellTypes.DATA_CELL]: 'data',
      }[cellType];

      renderStrategySheet({
        tooltip: {
          showTooltip: true,
          [cell]: {
            content: () => <div>{content}</div>,
          },
        },
      });

      jest.spyOn(s2, 'getCellType').mockReturnValueOnce(cellType);

      s2.showTooltipWithInfo({} as GEvent, []);

      expect(s2.tooltip.container.innerText).toEqual(content);
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
    const dataCell = s2.interaction
      .getPanelGroupAllDataCells()
      .filter((cell) => {
        const meta = cell.getMeta();
        return meta.colIndex === 3 && meta.fieldValue;
      });

    const bulletMeasureTextList = dataCell.map((cell) => {
      const textShape = cell
        .getChildren()
        .find((child) => child.cfg.type === 'text');
      return textShape?.attr('text');
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

    const textList = s2.facet.cornerHeader
      .getChildren()
      .map((element) => (element as any).actualText);

    expect(textList).toEqual(['数值', '日期']);
  });

  describe('StrategySheet Export Tests', () => {
    beforeEach(() => {
      renderStrategySheet(StrategyOptions, StrategySheetDataConfig);
    });

    test('should export correct data', () => {
      // 角头部分展示如下：
      // ["", "","日期"]
      // ["", "","数值"]
      const result = copyData(s2, '\t');

      const rows = result.split('\n');
      const corner1 = rows[0].split('\t').slice(0, 3);
      const corner2 = rows[1].split('\t').slice(0, 3);

      expect(result).toMatchSnapshot();
      expect(corner1).toEqual(['', '', `"日期"`]);
      expect(corner2).toEqual(['', '', `"数值"`]);
    });

    test('should export correct data for multi different cycle compare data', () => {
      // 列头部分不同粒度的列头包含不同的同环比个数
      // 2022-09 包含 [数值，环比，同比]
      // 2022-10 包含 [数值，环比]
      // 它们都应和各自的列头数值一栏对齐
      const result = copyData(s2, '\t');

      const rows = result.split('\n');
      const col1: string[] = rows[0].split('\t').slice(3);
      const col2: string[] = rows[1].split('\t').slice(3);

      expect(result).toMatchSnapshot();
      expect(col1.length).toEqual(col2.length);
      // 2022-09 对齐其数值
      const idx1 = col1.findIndex((col) => col === `"2022-09"`);
      expect(col2[idx1]).toEqual(`"数值"`);
      // 2022-10 对齐其数值
      const idx2 = col1.findIndex((col) => col === `"2022-10"`);
      expect(col2[idx2]).toEqual(`"数值"`);
    });

    test('should export correct data for empty cell', () => {
      // 2022-09 包含 [数值，环比，同比], 但是数值均为空
      // 对应数据应该空三格
      const result = copyData(s2, '\t');

      const rows = result.split('\n');
      // 自定义节点A - 指标A
      const detailRow: string[] = rows[3].split('\t').slice(0, 5);

      expect(result).toMatchSnapshot();
      expect(detailRow).toEqual([`"自定义节点A"`, `"指标A"`, '', '', '']);
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
    // eslint-disable-next-line jest/expect-expect
    it('should selected cell and update spotlight style', () => {
      const dataCellId = `root[&]自定义节点A[&]指标A-root[&]2022-11[&]["数值","环比","同比"]`;

      expectSelectedCellsSpotlight({
        s2,
        selectedCount: 30,
        selectedCellId: dataCellId,
      });
    });
  });
});

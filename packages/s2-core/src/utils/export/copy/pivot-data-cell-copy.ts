import { find, isEmpty, map, slice, zip } from 'lodash';
import {
  AsyncRenderThreshold,
  type CellMeta,
  type DataItem,
  EXTRA_FIELD,
  VALUE_FIELD,
} from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import type {
  CopyableList,
  CopyAllDataParams,
  MeasureQuery,
  SheetCopyConstructorParams,
} from '../interface';
import {
  convertString,
  getColNodeFieldFromNode,
  getHeaderList,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import type { BaseDataSet } from './../../../data-set/base-data-set';
import {
  assembleMatrix,
  completeMatrix,
  getFormatter,
  getMaxRowLen,
  getNodeFormatData,
} from './common';
import { getHeaderNodeFromMeta } from './core';
import { BaseDataCellCopy } from './base-data-cell-copy';

export class PivotDataCellCopy extends BaseDataCellCopy {
  protected leafRowNodes: Node[] = [];

  protected leafColNodes: Node[] = [];

  /**
   * @param {{
   * spreadsheet: SpreadSheet,
   * selectedCells?: CellMeta[],
   * formatOptions?: FormatOptions,
   * }} params
   */
  constructor(params: SheetCopyConstructorParams) {
    super(params);
    this.leafRowNodes = this.getLeafRowNodes();
    this.leafColNodes = this.getLeafColNodes();
  }

  private getLeafRowNodes() {
    const allRowLeafNodes = this.spreadsheet.getRowLeafNodes();
    let result: Node[] = allRowLeafNodes;
    const selectedRowMeta = getSelectedRows(this.config.selectedCells);
    const isTreeData = this.spreadsheet.isHierarchyTreeType();

    // selectedRowMeta 选中了指定的行头，则只展示对应行头对应的数据
    if (!isEmpty(selectedRowMeta)) {
      result = this.getSelectedNode(
        selectedRowMeta,
        allRowLeafNodes,
        isTreeData,
      );
    }

    return result;
  }

  private getLeafColNodes() {
    const allColLeafNodes = this.spreadsheet.getColumnLeafNodes();
    let result: Node[] = allColLeafNodes;
    const selectedColMetas = getSelectedCols(this.config.selectedCells);

    // selectedColNodes 选中了指定的列头，则只展示对应列头对应的数据
    if (!isEmpty(selectedColMetas)) {
      result = this.getSelectedNode(selectedColMetas, allColLeafNodes);
    }

    return result;
  }

  private getSelectedNode(
    selectedMeta: CellMeta[],
    allRowOrColLeafNodes: Node[],
    isTreeData = false,
  ): Node[] {
    return selectedMeta.reduce<Node[]>((nodes, cellMeta) => {
      const filterNodes = allRowOrColLeafNodes.filter((node) =>
        isTreeData ? node.id === cellMeta.id : node.id.startsWith(cellMeta.id),
      );

      nodes.push(...filterNodes);

      return nodes;
    }, []);
  }

  /**
   * 兼容 hideMeasureColumn 方案：hideMeasureColumn 的隐藏实现是通过截取掉度量(measure)数据，但是又只截取了 Node 中的，像 pivotMeta 中的又是完整的。导致复制时，无法通过 Node 找出正确路径。
   * https://github.com/antvis/S2/issues/1955
   */
  private compatibleHideMeasureColumn = (): MeasureQuery => {
    const isHideValue =
      this.spreadsheet.options?.style?.colCell?.hideValue &&
      this.spreadsheet.isValueInCols();

    // 被 hideMeasureColumn 隐藏的 度量(measure) 值，手动添加上。
    return isHideValue
      ? {
          [EXTRA_FIELD]: this.spreadsheet.dataCfg.fields.values?.[0],
        }
      : {};
  };

  protected getDataMatrixByHeaderNode = () => {
    const measureQuery = this.compatibleHideMeasureColumn();

    return map(this.leafRowNodes, (rowNode) =>
      this.leafColNodes.map((colNode) => {
        // const
        return this.getDataCellValue({
          rowNode,
          colNode,
          config: {
            measureQuery,
            isPivotMode: this.spreadsheet.isPivotMode,
            dataSet: this.spreadsheet.dataSet,
          },
        });
      }),
    );
  };

  protected getDataMatrixByHeaderNodeRIC = () => {
    const matrix: DataItem[][] = [];
    let rowIndex = 0;

    const measureQuery = this.compatibleHideMeasureColumn();

    // 在所有单元格数据获取成功后 resolve
    return new Promise((resolve, reject) => {
      try {
        // 因为每次 requestIdleCallback 执行的时间不一样，所以需要记录下当前执行到的 this.leafRowNodes 和 this.leafColNodes
        const dataMatrixIdleCallback = (deadline: IdleDeadline) => {
          let count = AsyncRenderThreshold;
          const rowLen: number = this.leafRowNodes.length;

          while (
            deadline.timeRemaining() > 0 &&
            rowIndex < rowLen - 1 &&
            count > 0
          ) {
            for (let j = rowIndex; j < rowLen && count > 0; j++) {
              const row: DataItem[] = [];
              const rowNode = this.leafRowNodes[j];

              for (let i = 0; i < this.leafColNodes.length; i++) {
                const colNode = this.leafColNodes[i];

                const dataItem = this.getDataCellValue({
                  rowNode,
                  colNode,
                  config: {
                    isPivotMode: this.spreadsheet.isPivotMode,
                    dataSet: this.spreadsheet.dataSet,
                    measureQuery,
                  },
                });

                row.push(dataItem);
              }
              rowIndex = j;
              matrix.push(row);
              count--;
            }
          }

          if (rowIndex === rowLen - 1) {
            resolve(matrix);
          } else {
            requestIdleCallback(dataMatrixIdleCallback);
          }
        };

        requestIdleCallback(dataMatrixIdleCallback);
      } catch (e) {
        reject(e);
      }
    }) as Promise<DataItem[][]>;
  };

  private getDataCellValue = ({
    rowNode,
    colNode,
    config,
  }: {
    rowNode: Node;
    colNode: Node;
    config: {
      isPivotMode: () => boolean;
      dataSet: BaseDataSet;
      measureQuery: MeasureQuery;
    };
  }): DataItem => {
    const { isPivotMode, dataSet, measureQuery } = config;
    const cellData = dataSet.getCellData({
      query: {
        ...rowNode.query,
        ...colNode.query,
        ...measureQuery,
      },
      rowNode,
      isTotals:
        rowNode.isTotals ||
        rowNode.isTotalMeasure ||
        colNode.isTotals ||
        colNode.isTotalMeasure,
    });

    const field = getColNodeFieldFromNode(isPivotMode, colNode);

    const formatter = getFormatter(
      field ?? colNode.field,
      this.config.isFormatData,
      dataSet,
    );

    return formatter(cellData?.[VALUE_FIELD] ?? '');
  };

  protected getCornerMatrix = (rowMatrix?: string[][]): string[][] => {
    const { fields, meta } = this.spreadsheet.dataCfg;
    const { columns = [], rows = [] } = fields;
    // 为了对齐数值
    const customColumns = [...columns, ''];
    const maxRowLen = this.spreadsheet.isHierarchyTreeType()
      ? getMaxRowLen(rowMatrix ?? [])
      : rows.length;
    const customRows = slice(rows, 0, maxRowLen);

    /*
     * cornerMatrix 形成的矩阵为  rows.length(宽) * columns.length(高)
     */
    return map(customColumns, (col, colIndex) =>
      map(customRows, (row, rowIndex) => {
        // 角头的最后一行，为行头
        if (colIndex === customColumns.length - 1) {
          return find(meta, ['field', row])?.name ?? row;
        }

        // 角头的最后一列，为列头
        if (rowIndex === maxRowLen - 1) {
          return find(meta, ['field', col])?.name ?? col;
        }

        return '';
      }),
    ) as unknown as string[][];
  };

  protected getColMatrix(): string[][] {
    return zip(
      ...map(this.leafColNodes, (n) =>
        this.config.isFormatHeader ? getNodeFormatData(n) : getHeaderList(n.id),
      ),
    ) as string[][];
  }

  protected getRowMatrix(): string[][] {
    const rowMatrix: string[][] = map(this.leafRowNodes, (n) =>
      this.config.isFormatHeader ? getNodeFormatData(n) : getHeaderList(n.id),
    );

    return completeMatrix(rowMatrix);
  }

  getDataMatrixByDataCell = (cellMetaMatrix: CellMeta[][]): CopyableList => {
    const { copyWithHeader } = this.spreadsheet.options.interaction!;
    const measureQuery = this.compatibleHideMeasureColumn();

    const dataMatrix = map(cellMetaMatrix, (cellsMeta) =>
      map(cellsMeta, (it) => {
        const [rowNode, colNode] = getHeaderNodeFromMeta(it, this.spreadsheet);
        const dataItem = this.getDataCellValue({
          rowNode: rowNode!,
          colNode: colNode!,
          config: {
            isPivotMode: this.spreadsheet.isPivotMode,
            dataSet: this.spreadsheet.dataSet,
            measureQuery,
          },
        });

        return convertString(dataItem);
      }),
    ) as string[][];

    // 不带表头复制
    if (!copyWithHeader) {
      return this.matrixTransformer(dataMatrix, this.config.separator);
    }

    // 带表头复制
    const rowMatrix = this.getRowMatrix();

    // 判断是否为趋势分析表

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ rowMatrix, colMatrix, dataMatrix }),
      this.config.separator,
    );
  };

  getPivotCopyData(): CopyableList {
    const { copyWithHeader } = this.spreadsheet.options.interaction!;

    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    // 不带表头复制
    if (!copyWithHeader) {
      return this.matrixTransformer(dataMatrix, this.config.separator);
    }

    // 带表头复制
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ rowMatrix, colMatrix, dataMatrix }),
      this.config.separator,
    );
  }

  getAsyncAllPivotCopyData = async (): Promise<CopyableList> => {
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

    const cornerMatrix = this.getCornerMatrix(rowMatrix);

    let dataMatrix: string[][] = [];

    // 把两类导出都封装成异步的，保证导出类型的一致
    if (this.config.isAsyncExport) {
      dataMatrix = (await this.getDataMatrixByHeaderNodeRIC()) as string[][];
    } else {
      dataMatrix = (await Promise.resolve(
        this.getDataMatrixByHeaderNode(),
      )) as string[][];
    }

    const resultMatrix = this.matrixTransformer(
      assembleMatrix({ rowMatrix, colMatrix, dataMatrix, cornerMatrix }),
      this.config.separator,
    );

    return resultMatrix;
  };

  getPivotAllCopyData = (): CopyableList => {
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

    const cornerMatrix = this.getCornerMatrix(rowMatrix);

    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    const resultMatrix = this.matrixTransformer(
      assembleMatrix({ rowMatrix, colMatrix, dataMatrix, cornerMatrix }),
      this.config.separator,
    );

    return resultMatrix;
  };
}

export function processSelectedPivotByHeader(
  spreadsheet: SpreadSheet,
  selectedCells: CellMeta[],
): CopyableList {
  const pivotDataCellCopy = new PivotDataCellCopy({
    spreadsheet,
    config: {
      selectedCells,
    },
  });

  return pivotDataCellCopy.getPivotCopyData();
}

// 全量导出使用
export const processSelectedAllPivot = (
  params: CopyAllDataParams,
): CopyableList => {
  const { sheetInstance, split, formatOptions, customTransformer } = params;
  const pivotDataCellCopy = new PivotDataCellCopy({
    spreadsheet: sheetInstance,
    isExport: true,
    config: {
      separator: split,
      formatOptions,
      customTransformer,
    },
  });

  return pivotDataCellCopy.getPivotAllCopyData();
};

// 全量导出使用 异步方法
export const processSelectedAllPivotAsync = (
  params: CopyAllDataParams,
): Promise<CopyableList> => {
  const { sheetInstance, split, formatOptions, customTransformer } = params;
  const pivotDataCellCopy = new PivotDataCellCopy({
    spreadsheet: sheetInstance,
    isExport: true,
    config: {
      separator: split,
      formatOptions,
      customTransformer,
      isAsyncExport: true,
    },
  });

  return pivotDataCellCopy.getAsyncAllPivotCopyData();
};

export const processSelectedPivotByDataCell = ({
  spreadsheet,
  selectedCells,
  headerSelectedCells,
}: {
  spreadsheet: SpreadSheet;
  selectedCells: CellMeta[][];
  headerSelectedCells: CellMeta[];
}): CopyableList => {
  const pivotDataCellCopy = new PivotDataCellCopy({
    spreadsheet,
    config: {
      selectedCells: headerSelectedCells,
      formatOptions: true,
    },
  });

  return pivotDataCellCopy.getDataMatrixByDataCell(selectedCells);
};

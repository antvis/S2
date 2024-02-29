import {
  groupBy,
  isEmpty,
  isPlainObject,
  map,
  slice,
  sortBy,
  zip,
} from 'lodash';
import {
  AsyncRenderThreshold,
  EXTRA_FIELD,
  VALUE_FIELD,
  type CellMeta,
  type DataItem,
  type MiniChartData,
  type MultiData,
  CornerNodeType,
} from '../../../common';
import type {
  CopyAllDataParams,
  CopyableList,
  MeasureQuery,
  SheetCopyConstructorParams,
} from '../../../common/interface/export';
import type { CellData } from '../../../data-set';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import {
  convertString,
  getColNodeFieldFromNode,
  getHeaderList,
  getHeaderMeasureFieldNames,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import type { BaseDataSet } from './../../../data-set/base-data-set';
import { BaseDataCellCopy } from './base-data-cell-copy';
import {
  assembleMatrix,
  completeMatrix,
  getFormatter,
  getMaxRowLen,
  getNodeFormatData,
} from './common';
import { getHeaderNodeFromMeta } from './core';

export class PivotDataCellCopy extends BaseDataCellCopy {
  protected leafRowNodes: Node[] = [];

  protected leafColNodes: Node[] = [];

  constructor(params: SheetCopyConstructorParams) {
    super(params);
    this.leafRowNodes = this.getLeafRowNodes();
    this.leafColNodes = this.getLeafColNodes();
  }

  private getLeafRowNodes() {
    const rowLeafNodes = this.spreadsheet.facet.getRowLeafNodes();
    const selectedRowsMeta = getSelectedRows(this.config.selectedCells);
    const isTreeData = this.spreadsheet.isHierarchyTreeType();

    if (isEmpty(selectedRowsMeta)) {
      return rowLeafNodes;
    }

    // selectedRowMeta 选中了指定的行头，则只展示对应行头对应的数据
    return this.getSelectedNode(selectedRowsMeta, rowLeafNodes, isTreeData);
  }

  private getLeafColNodes() {
    const colLeafNodes = this.spreadsheet.facet.getColLeafNodes();
    const selectedColsMeta = getSelectedCols(this.config.selectedCells);

    if (isEmpty(selectedColsMeta)) {
      return colLeafNodes;
    }

    // selectedColNodes 选中了指定的列头，则只展示对应列头对应的数据
    return this.getSelectedNode(selectedColsMeta, colLeafNodes);
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

    const formatNode = this.spreadsheet.isValueInCols() ? colNode : rowNode;

    let field: string | undefined =
      getColNodeFieldFromNode(isPivotMode, formatNode) ?? '';

    // 主要解决只有一个度量时,总计小计对应的值无法格式化的问题
    const values = this.spreadsheet.dataCfg.fields.values;

    field = values?.includes(field) ? field : values?.[0];

    const formatter = getFormatter(
      field ?? colNode.field,
      this.config.formatData,
      dataSet,
    );

    const fieldValue = (cellData as CellData)?.[VALUE_FIELD];
    const isChartData = isPlainObject(
      (fieldValue as MultiData<MiniChartData>)?.values,
    );
    const value = isChartData ? '' : fieldValue;

    return formatter(value ?? '');
  };

  protected getCustomRowCornerMatrix = (rowMatrix?: string[][]): string[][] => {
    const maxRowLen = getMaxRowLen(rowMatrix ?? []);
    const cornerNodes = this.spreadsheet.facet.getCornerNodes();
    // 对 cornerNodes 进行排序， cornerType === CornerNodeType.Col 的放在前面
    const sortedCornerNodes = sortBy(cornerNodes, (node) => {
      return node.cornerType === CornerNodeType.Col ? 0 : 1;
    });

    // 树状模式
    if (this.spreadsheet.isHierarchyTreeType()) {
      // 角头需要根据行头的最大长度进行填充，最后一列的值为角头的值
      return map(sortedCornerNodes, (node) => {
        const result: string[] = new Array(maxRowLen).fill('');

        result[maxRowLen - 1] = node.value;

        return result;
      });
    }

    // 平铺模式
    return Object.values(groupBy(sortedCornerNodes, 'y')).map((nodes) => {
      const placeholder: string[] = new Array(maxRowLen - nodes.length).fill(
        '',
      );
      const result = nodes.map((node) => node.value);

      return [...placeholder, ...result];
    });
  };

  protected getCornerMatrix = (rowMatrix?: string[][]): string[][] => {
    if (this.spreadsheet.isCustomRowFields()) {
      return this.getCustomRowCornerMatrix(rowMatrix);
    }

    const { fields } = this.spreadsheet.dataCfg;
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
    return map(customColumns, (colField, colIndex) =>
      map(customRows, (rowField, rowIndex) => {
        // 角头的最后一行，为行头
        if (colIndex === customColumns.length - 1) {
          return this.spreadsheet.dataSet.getFieldName(rowField);
        }

        // 角头的最后一列，为列头
        if (rowIndex === maxRowLen - 1) {
          return this.spreadsheet.dataSet.getFieldName(colField);
        }

        return '';
      }),
    );
  };

  protected getColMatrix(): string[][] {
    return zip(
      ...map(this.leafColNodes, (node) =>
        this.config.formatHeader
          ? getNodeFormatData(node)
          : getHeaderMeasureFieldNames(
              getHeaderList(node.id),
              node.spreadsheet,
            ),
      ),
    ) as string[][];
  }

  protected getRowMatrix(): string[][] {
    const rowMatrix: string[][] = map(this.leafRowNodes, (node) =>
      this.config.formatHeader
        ? getNodeFormatData(node)
        : getHeaderMeasureFieldNames(getHeaderList(node.id), node.spreadsheet),
    );

    return completeMatrix(rowMatrix);
  }

  getDataMatrixByDataCell = (cellMetaMatrix: CellMeta[][]): CopyableList => {
    const { copy } = this.spreadsheet.options.interaction!;
    const measureQuery = this.compatibleHideMeasureColumn();

    const dataMatrix = map(cellMetaMatrix, (cellsMeta) =>
      map(cellsMeta, (meta) => {
        const [rowNode, colNode] = getHeaderNodeFromMeta(
          meta,
          this.spreadsheet,
        );
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
    if (!copy?.withHeader) {
      return this.matrixTransformer(dataMatrix, this.config.separator);
    }

    // 带表头复制
    const rowMatrix = this.getRowMatrix();
    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ rowMatrix, colMatrix, dataMatrix }),
      this.config.separator,
    );
  };

  getPivotCopyData(): CopyableList {
    const { copy } = this.spreadsheet.options.interaction!;
    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    // 不带表头复制
    if (!copy?.withHeader) {
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

export const asyncProcessSelectedAllPivot = (
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

/**
 * 刷选单元格数据时使用此方法
 * @param {SpreadSheet} spreadsheet
 * @param {CellMeta[][]} selectedCells
 * @param {CellMeta[]} headerSelectedCells
 * @return {CopyableList}
 */
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

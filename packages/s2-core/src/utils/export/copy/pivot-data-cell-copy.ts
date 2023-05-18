import { find, isEmpty, map, slice, zip } from 'lodash';
import {
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
  SheetCopyConstructorParams,
} from '../interface';
import {
  convertString,
  getColNodeFieldFromNode,
  getHeaderList,
  getSelectedCols,
  getSelectedRows,
} from '../method';
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
  private compatibleHideMeasureColumn = () => {
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

  protected getDataMatrixByHeaderNode = () =>
    map(this.leafRowNodes, (rowNode) =>
      this.leafColNodes.map((colNode) =>
        this.getDataCellValue(rowNode, colNode),
      ),
    );

  private getDataCellValue(rowNode: Node, colNode: Node): DataItem {
    const measureQuery = this.compatibleHideMeasureColumn();

    const cellData = this.spreadsheet.dataSet.getCellData({
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

    const field = getColNodeFieldFromNode(
      this.spreadsheet.isPivotMode,
      colNode,
    );

    const formatter = getFormatter(
      this.spreadsheet,
      field ?? colNode.field,
      this.config.isFormatData,
    );

    return formatter(cellData?.[VALUE_FIELD] ?? '');
  }

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

    const dataMatrix = map(cellMetaMatrix, (cellsMeta) =>
      map(cellsMeta, (it) => {
        const [rowNode, colNode] = getHeaderNodeFromMeta(it, this.spreadsheet);
        const dataItem = this.getDataCellValue(rowNode!, colNode!);

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
    );
  };

  getPivotCopyData(): CopyableList {
    const { copyWithHeader } = this.spreadsheet.options.interaction!;

    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    // 不带表头复制
    if (!copyWithHeader) {
      return this.matrixTransformer(dataMatrix);
    }

    // 带表头复制
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ rowMatrix, colMatrix, dataMatrix }),
    );
  }

  getPivotAllCopyData = (): CopyableList => {
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

    const cornerMatrix = this.getCornerMatrix(rowMatrix);
    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    return this.matrixTransformer(
      assembleMatrix({ rowMatrix, colMatrix, dataMatrix, cornerMatrix }),
    );
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

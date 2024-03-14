import {
  PivotDataCellCopy,
  assembleMatrix,
  getHeaderList,
  getNodeFormatData,
  safeJsonParse,
  type CopyAllDataParams,
  type CopyableList,
  type Node,
  type SheetCopyConstructorParams,
  type ViewMeta,
} from '@antv/s2';
import {
  flatten,
  forEach,
  get,
  isArray,
  isFunction,
  isNil,
  isObject,
  map,
} from 'lodash';

/**
 * Process the multi-measure with single-lines
 */
const processObjectValueInRow = (
  data: Record<string, unknown>,
  isFormat = false,
) => {
  if (!isFormat) {
    return get(data, ['originalValues', 0]) ?? get(data, ['values', 0]);
  }

  return get(data, ['values', 0]);
};

const getHeaderLabel = (val: string) => {
  const label = safeJsonParse<string[]>(val);

  if (isArray(label)) {
    return label;
  }

  return val;
};

class StrategyCopyData extends PivotDataCellCopy {
  constructor(props: SheetCopyConstructorParams) {
    super(props);
  }

  private getPlaceholder = (viewMeta: ViewMeta, leafNode: Node) => {
    const label = getHeaderLabel(leafNode.value);
    const labelLength = isArray(label) ? label.length : 1;
    const placeholder = this.spreadsheet.options.placeholder;
    const placeholderStr = isFunction(placeholder)
      ? placeholder(viewMeta)
      : placeholder;

    return Array(labelLength).fill(placeholderStr);
  };

  /* Process the data when the value position is on the rows. */
  private processValueInRow = (viewMeta: ViewMeta, placeholder: string[]) => {
    let tempCells: string[] = [];
    const defaultResult = placeholder ?? [''];

    if (!viewMeta) {
      return defaultResult;
    }

    const { fieldValue, valueField, data } = viewMeta;

    if (isObject(fieldValue)) {
      tempCells = processObjectValueInRow(
        fieldValue,
        this.config.formatHeader,
      ) as unknown as string[];

      return tempCells ?? placeholder;
    }

    // 如果本身格子的数据是 null， 但是一个格子又需要绘制多个指标时，需要使用placeholder填充
    if (isNil(fieldValue) && placeholder.length > 1) {
      return defaultResult;
    }

    // The main measure.
    if (!this.config.formatHeader) {
      tempCells.push((fieldValue as string) ?? '');
    } else {
      const mainFormatter =
        this.spreadsheet.dataSet.getFieldFormatter(valueField);
      const tempCell = mainFormatter(fieldValue, data) ?? '';

      tempCells.push(tempCell);
    }

    return tempCells ?? placeholder;
  };

  protected getCornerMatrix = (rowMatrix?: string[][]): string[][] => {
    return this.getCustomRowCornerMatrix(rowMatrix);
  };

  protected getDataMatrixByHeaderNode = () => {
    return map(this.leafRowNodes, (rowNode) => {
      // 获取每行的数据，如果无法获取到数据则使用 placeholder 填充
      const rowVal = this.leafColNodes.map((colNode) => {
        const viewMeta = this.spreadsheet.facet.getCellMeta?.(
          rowNode.rowIndex,
          colNode.colIndex,
        )!;
        const placeholder = this.getPlaceholder(viewMeta!, colNode);

        return this.processValueInRow(viewMeta, placeholder);
      });

      // 因为每个格子可能有多个指标时，则以数组展示。对于行头来说，需要将每个格子的展示拍平
      return flatten(rowVal);
    });
  };

  // 趋势表都需要列头为"字符串数组类型"的 value, e.g.: "["数值","环比","同比"]"
  protected getColMatrix(): string[][] {
    const result: string[][] = [];

    forEach(this.leafColNodes, (node) => {
      const colList = this.config.formatHeader
        ? getNodeFormatData(node)
        : getHeaderList(node.id);
      // 倒着循环 colList
      let maxLen = 0;

      for (let i = colList.length - 1; i >= 0; i--) {
        const item = colList[i];
        let temp: string[] = [];

        // 如果是最后一个元素，且是 "["数值","环比","同比"]"，则需要转换
        if (item.startsWith('[') && item.endsWith(']')) {
          temp = JSON.parse(item);
          // 如果是 "["数值","环比","同比"]"，则转换为 "数值","环比","同比"
          maxLen = temp.length > maxLen ? temp.length : maxLen;
        } else {
          // 需要补全 "" 在后面，e.g.: "2022-09" => ["2022-09", "", ""]
          temp = maxLen > 0 ? new Array(maxLen).fill('') : [];
          temp[0] = item;
        }

        result[i] = result[i] ? result[i].concat(temp) : temp;
      }
    });

    return result;
  }

  getPivotAllCopyData = (): CopyableList => {
    const rowMatrix = this.getRowMatrix();
    const colMatrix = this.getColMatrix();
    const cornerMatrix = this.getCornerMatrix(rowMatrix);
    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    return this.matrixTransformer(
      assembleMatrix({
        colMatrix,
        dataMatrix,
        rowMatrix,
        cornerMatrix,
      }),
    );
  };
}

export const strategyCopy = (params: CopyAllDataParams): string => {
  const { sheetInstance, split, formatOptions } = params;
  const strategyCopyData = new StrategyCopyData({
    spreadsheet: sheetInstance,
    isExport: true,
    config: {
      separator: split,
      formatOptions,
    },
  });

  return strategyCopyData.getPivotAllCopyData()[0].content;
};

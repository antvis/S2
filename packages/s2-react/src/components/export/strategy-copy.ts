import {
  type CopyConstructorParams,
  CornerNodeType,
  NewTab,
  type Node,
  PivotDataCellCopy,
  safeJsonParse,
  SpreadSheet,
  type ViewMeta,
} from '@antv/s2';
import type {
  CopyableList,
  // @ts-ignore
  FormatOptions,
} from '@antv/s2/src/utils/export/interface';
import {
  clone,
  flatten,
  forEach,
  get,
  isArray,
  isEmpty,
  isFunction,
  isNil,
  isObject,
  isString,
  last,
  map,
  max,
  size,
  sortBy,
} from 'lodash';
import {
  assembleMatrix,
  getMaxRowLen,
  getNodeFormatData,
} from '@antv/s2/src/utils/export/copy/common';
import { getHeaderList } from '@antv/s2/src/utils/export/method';
// import { getLeafColumnsWithKey } from '@antv/s2/src/facet/utils';

/*
 * Process the multi-measure with single-lines
 */
const processObjectValueInRow = (
  data: Record<string, unknown>,
  isFormat = false,
) => {
  if (!isFormat) {
    return get(data?.['originalValues'], 0) ?? get(data?.['values'], 0);
  }

  return get(data?.['values'], 0);
};
const getHeaderLabel = (val: string) => {
  const label = safeJsonParse(val);

  if (isArray(label)) {
    return label;
  }

  return val;
};

const getPlaceholder = (
  viewMeta: ViewMeta,
  leafNode: Node,
  sheetInstance: SpreadSheet,
) => {
  const label = getHeaderLabel(leafNode.value);
  const labelLength = isArray(label) ? label.length : 1;
  const placeholder = sheetInstance.options.placeholder;
  const placeholderStr = isFunction(placeholder)
    ? placeholder(viewMeta)
    : placeholder;

  return Array(labelLength).fill(placeholderStr);
};

const processValueInRow = (
  viewMeta: ViewMeta,
  sheetInstance: SpreadSheet,
  placeholder: string[],
  isFormat = false,
) => {
  let tempCells: string[] = [];
  const defaultResult = placeholder ?? [''];

  if (!viewMeta) {
    return defaultResult;
  }

  const { fieldValue, valueField, data } = viewMeta;

  // todo
  if (isObject(fieldValue)) {
    tempCells = processObjectValueInRow(fieldValue, isFormat);

    return tempCells ?? placeholder;
  }

  // 如果本身格子的数据是 null， 但是一个格子又需要绘制多个指标时，需要使用placeholder填充
  if (isNil(fieldValue) && placeholder.length > 1) {
    return defaultResult;
  }

  // The main measure.
  if (!isFormat) {
    tempCells.push((fieldValue as string) ?? '');
  } else {
    const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);
    const tempCell = mainFormatter(fieldValue, data) ?? '';

    tempCells.push(tempCell);
  }

  return tempCells ?? placeholder;
};

class StrategyCopyData extends PivotDataCellCopy {
  constructor(props: CopyConstructorParams) {
    super(props);
  }

  /* Process the data when the value position is on the rows. */
  processValueInRow = (
    viewMeta: ViewMeta,
    sheetInstance: SpreadSheet,
    placeholder: string[],
    isFormat = false,
  ) => {
    let tempCells: string[] = [];
    const defaultResult = placeholder ?? [''];

    if (!viewMeta) {
      return defaultResult;
    }

    const { fieldValue, valueField, data } = viewMeta;

    // todo
    if (isObject(fieldValue)) {
      tempCells = processObjectValueInRow(fieldValue, isFormat);

      return tempCells ?? placeholder;
    }

    // 如果本身格子的数据是 null， 但是一个格子又需要绘制多个指标时，需要使用placeholder填充
    if (isNil(fieldValue) && placeholder.length > 1) {
      return defaultResult;
    }

    // The main measure.
    if (!isFormat) {
      tempCells.push((fieldValue as string) ?? '');
    } else {
      const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);
      const tempCell = mainFormatter(fieldValue, data) ?? '';

      tempCells.push(tempCell);
    }

    return tempCells ?? placeholder;
  };

  protected getCornerMatrix = (rowMatrix?: string[][]): string[][] => {
    const { fields } = this.spreadsheet.dataCfg;
    const { rows = [] } = fields;
    const maxRowLen = this.spreadsheet.isHierarchyTreeType()
      ? getMaxRowLen(rowMatrix ?? [])
      : rows.length;
    const sheetInstance = this.spreadsheet;
    const { data: cornerNodes } =
      sheetInstance.facet.cornerHeader.getHeaderConfig();

    // 对 cornerNodes 进行排序， cornerType === CornerNodeType.Col 的放在前面
    const sortedCornerNodes = sortBy(cornerNodes, (node) => {
      const { cornerType } = node;

      return cornerType === CornerNodeType.Col ? 0 : 1;
    });

    return map(sortedCornerNodes, (node) => {
      const { value } = node;
      const result: string[] = new Array(maxRowLen).fill('');

      // 根据 maxRowLen 进行填充：
      result[maxRowLen - 1] = value;

      return result;
    });
  };

  getPivotAllCopyData = (): CopyableList => {
    const rowMatrix = this.getRowMatrix();
    const colMatrix = this.getColMatrix();
    const cornerMatrix = this.getCornerMatrix(rowMatrix);
    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    // console.log('cornerMatrix', cornerMatrix, 'colMatrix', colMatrix);

    // console.log(dataMatrix, 'dataMatrix');

    return assembleMatrix({
      colMatrix,
      dataMatrix,
      rowMatrix,
      cornerMatrix,
    });
  };

  protected getDataMatrixByHeaderNode = () => {
    const { getCellMeta } = this.spreadsheet?.facet?.layoutResult;

    return map(this.leafRowNodes, (rowNode) => {
      const rowVal = this.leafColNodes.map((colNode) => {
        const viewMeta = getCellMeta(rowNode.rowIndex, colNode.colIndex)!;
        const placeholder = getPlaceholder(
          viewMeta!,
          colNode,
          this.spreadsheet,
        );

        const val = this.processValueInRow(
          viewMeta,
          this.spreadsheet,
          placeholder,
          true,
        );

        return val;
      });

      // 将 rowVal 转换为一维数组
      return flatten(rowVal);
    });
  };

  // 趋势表都需要特殊处理
  protected getColMatrix(): string[][] {
    const result: string[][] = [];

    forEach(this.leafColNodes, (n) => {
      const colList = this.config.isFormatHeader
        ? getNodeFormatData(n)
        : getHeaderList(n.id);
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
}

export const strategyCopy = (
  sheetInstance: SpreadSheet,
  split = NewTab,
  formatOptions?: FormatOptions,
) => {
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

/*
 * Process the multi-measure with multi-lines
 * For Grid-analysis-sheet
 * use the ' ' to divide different measures in the same line
 * use the '$' to divide different lines
 */
const processObjectValueInCol = (data: Record<string, unknown>) => {
  const tempCells = data?.['value'] ? [data?.['value']] : [];
  const values = data?.['values'] as (string | number)[][];

  if (!isEmpty(values)) {
    forEach(values, (value) => {
      tempCells.push(value.join(' '));
    });
  }

  return tempCells.join('$');
};

export function getCsvString(v: any): string {
  if (!v) {
    return v;
  }

  if (typeof v === 'string') {
    const out = v;

    // 需要替换", https://en.wikipedia.org/wiki/Comma-separated_values#Example
    return `"${out.replace(/"/g, '""')}"`;
  }

  return `"${v}"`;
}
/* Process the data when the value position is on the columns.  */
const processValueInCol = (
  viewMeta: ViewMeta,
  sheetInstance: SpreadSheet,
  isFormat?: boolean,
): string => {
  if (!viewMeta) {
    // If the meta equals null, replacing it with blank line.
    return '';
  }

  const { fieldValue, valueField, data } = viewMeta;

  if (isObject(fieldValue)) {
    return processObjectValueInCol(fieldValue);
  }

  if (!isFormat) {
    return `${fieldValue}`;
  }

  const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);

  return mainFormatter(fieldValue, data);
};

/* Get the label name for the header. */

/**
 * 当列头label存在数组情况，需要将其他层级补齐空格
 * eg [ ['数值', '环比'], '2021'] => [ ['数值', '环比'], ['2021', '']
 */
const processColHeaders = (headers: any[][]) => {
  const result = headers.map((header) =>
    header.map((item) => {
      if (isArray(item)) {
        return item;
      }

      if (isArray(header[0])) {
        return [item, ...new Array(header[0].length - 1)];
      }

      return item;
    }),
  );

  return result;
};

const getNodeFormatLabel = (node: Node) => {
  const formatter = node.spreadsheet?.dataSet?.getFieldFormatter?.(node.field);

  return formatter?.(node.value) ?? node.value;
};

/**
 * 通过 rowLeafNode 获取到当前行所有 rowNode 的数据
 * @param rowLeafNode
 */

const getFormatOptions = (isFormat: FormatOptions) => {
  if (typeof isFormat === 'object') {
    return {
      isFormatHeader: isFormat.isFormatHeader ?? false,
      isFormatData: isFormat.isFormatData ?? false,
    };
  }

  return {
    isFormatHeader: isFormat ?? false,
    isFormatData: isFormat ?? false,
  };
};

type FormatOptions =
  | boolean
  | {
      isFormatHeader?: boolean;
      isFormatData?: boolean;
    };

/**
 * Copy data
 * @param sheetInstance
 * @param formatOptions 是否格式化数据
 * @param split
 */
// eslint-disable-next-line max-lines-per-function
export const getStrategySheetData1 = (
  sheetInstance: SpreadSheet,
  split: string,
  formatOptions?: FormatOptions,
): string => {
  // isFormatHeader 格式化表头， isFormatData 格式化数据
  const { isFormatHeader, isFormatData } = getFormatOptions(formatOptions!);
  const { rowsHierarchy, rowLeafNodes, colLeafNodes, getCellMeta } =
    sheetInstance?.facet?.layoutResult;
  const { maxLevel: maxRowsHeaderLevel } = rowsHierarchy;
  const { valueInCols } = sheetInstance.dataCfg.fields;
  // Generate the table header.
  const rowsHeader = rowsHierarchy.sampleNodesForAllLevels.map((item) =>
    sheetInstance.dataSet.getFieldName(item.field),
  );

  // get max query property length
  const maxRowDepth = rowLeafNodes.reduce((maxDepth, node) => {
    // 第一层的level为0
    const depth = (node.level ?? 0) + 1;

    return depth > maxDepth ? depth : maxDepth;
  }, 0);
  // Generate the table body.
  const detailRows = [];
  let maxRowLength = 0;

  // Filter out the related row head leaf nodes.
  const caredRowLeafNodes = rowLeafNodes.filter((row) => row.height !== 0);

  for (const rowNode of caredRowLeafNodes) {
    let tempLine = [];

    // TODO 兼容下钻，需要获取下钻最大层级
    const totalLevel = maxRowsHeaderLevel + 1;
    const emptyLength = totalLevel - tempLine.length;

    if (emptyLength > 0) {
      tempLine.push(...new Array(emptyLength));
    }

    // 指标挂行头且为平铺模式下，获取指标名称
    const lastLabel = sheetInstance.dataSet.getFieldName(last(tempLine)!);

    tempLine[tempLine.length - 1] = lastLabel;

    for (const colNode of colLeafNodes) {
      if (valueInCols) {
        const viewMeta = getCellMeta(rowNode.rowIndex, colNode.colIndex)!;

        tempLine.push(processValueInCol(viewMeta, sheetInstance, isFormatData));
      } else {
        const viewMeta = getCellMeta(rowNode.rowIndex, colNode.colIndex);
        const placeholder = getPlaceholder(viewMeta!, colNode, sheetInstance);
        const lintItem = processValueInRow(
          viewMeta!,
          sheetInstance,
          placeholder,
          isFormatData,
        );

        if (isArray(lintItem)) {
          tempLine = tempLine.concat(...lintItem);
        } else {
          tempLine.push(lintItem);
        }
      }
    }
    maxRowLength = max([tempLine.length, maxRowLength])!;
    const lineString = tempLine.map((value) => getCsvString(value)).join(split);

    detailRows.push(lineString);
  }

  // Generate the table header.
  let headers: string[][] = [];

  if (isEmpty(colLeafNodes) && !sheetInstance.isPivotMode()) {
    // when there is no column in detail mode
    headers = [rowsHeader];
  } else {
    // 当列头label为array时用于补全其他层级的label
    let arrayLength = 0;
    // Get the table header of Columns.
    let tempColHeader = clone(colLeafNodes).map((leafNode) => {
      let currentLeafNode = leafNode;

      const tempCol = [];

      // Generate the column dimensions.
      while (currentLeafNode.level !== undefined) {
        let value = getHeaderLabel(currentLeafNode.value);

        if (isArray(value)) {
          arrayLength = max([arrayLength, size(value)])!;
        } else {
          // label 为数组时不进行格式化
          value =
            isFormatHeader && sheetInstance.isPivotMode()
              ? getNodeFormatLabel(currentLeafNode)
              : value;
        }

        tempCol.push(value);
        currentLeafNode = currentLeafNode.parent!;
      }

      return tempCol;
    });

    if (arrayLength > 1) {
      tempColHeader = processColHeaders(tempColHeader);
    }

    const colLevels = tempColHeader.map((colHeader) => colHeader.length);
    const colLevel = max(colLevels)!;

    const colHeader: string[][] = [];

    // Convert the number of column dimension levels to the corresponding array.
    for (let i = colLevel - 1; i >= 0; i -= 1) {
      // The map of data set: key-name
      const colHeaderItem = tempColHeader
        // total col completion
        .map((item) =>
          item.length < colLevel
            ? [...new Array(colLevel - item.length), ...item]
            : item,
        )
        .map((item) => item[i])
        .map((colItem) => sheetInstance.dataSet.getFieldName(colItem));

      colHeader.push(flatten(colHeaderItem));
    }

    // Generate the table header.
    headers = colHeader.map((item, index) => {
      if (sheetInstance.isPivotMode()) {
        const { data } = sheetInstance.facet.cornerHeader.getHeaderConfig();
        const { columns = [], rows = [] } = sheetInstance.dataSet.fields;
        const colNodes = data.filter(
          ({ cornerType }) => cornerType === CornerNodeType.Col,
        );

        if (index < colHeader.length - 1) {
          const fillTempStrings: string[] = Array(maxRowsHeaderLevel).fill('');
          const colNodeLabel =
            colNodes.find(({ field }) => field === columns[index])?.value || '';

          return [...fillTempStrings, colNodeLabel, ...item];
        }
        // 行头展开多少层，则复制多少层的内容。不进行全量复制。 eg: 树结构下，行头为 省份/城市, 折叠所有城市，则只复制省份

        const withoutCustomFieldRows = rows.filter((field) => isString(field));
        const copiedRows = withoutCustomFieldRows.slice(0, maxRowDepth);

        // 在趋势分析表中，行头只有一个 extra的维度，但是有多个层级
        if (copiedRows.length < maxRowDepth) {
          copiedRows.unshift(
            ...Array(maxRowDepth - copiedRows.length).fill(''),
          );
        }

        const copiedRowLabels = copiedRows.map(
          (rowField) => sheetInstance.dataSet.getFieldName(rowField) || '',
        );

        return [...copiedRowLabels, ...item];
      }

      return index < colHeader.length
        ? Array(maxRowDepth)
            .fill('')
            .concat(...item)
        : rowsHeader.concat(...item);
    });
  }

  const headerRow = headers
    .map((header) => {
      const emptyLength = maxRowLength - header.length;

      if (emptyLength > 0) {
        header.unshift(...new Array(emptyLength));
      }

      return header.map((h) => getCsvString(h)).join(split);
    })
    .join('\r\n');

  const data = [headerRow].concat(detailRows);
  const result = data.join('\r\n');

  return result;
};

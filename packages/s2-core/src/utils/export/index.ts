import {
  last,
  isEmpty,
  clone,
  trim,
  max,
  isObject,
  forEach,
  isArray,
  flatten,
  size,
} from 'lodash';
import { getCsvString } from './export-worker';
import { SpreadSheet } from '@/sheet-type';
import { CornerNodeType, ViewMeta } from '@/common/interface';
import { ID_SEPARATOR, ROOT_BEGINNING_REGEX } from '@/common/constant';
import { MultiData } from '@/common/interface';
import { safeJsonParse } from '@/utils/text';

export const copyToClipboardByExecCommand = (str: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = str;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (success) {
      resolve();
    } else {
      reject();
    }
  });
};

export const copyToClipboardByClipboard = (str: string): Promise<void> => {
  return navigator.clipboard.writeText(str).catch(() => {
    return copyToClipboardByExecCommand(str);
  });
};

export const copyToClipboard = (str: string, sync = false): Promise<void> => {
  if (!navigator.clipboard || sync) {
    return copyToClipboardByExecCommand(str);
  }
  return copyToClipboardByClipboard(str);
};

export const download = (str: string, fileName: string) => {
  try {
    const link = document.createElement('a');
    link.download = `${fileName}.csv`;
    // Avoid errors in Chinese encoding.
    const dataBlob = new Blob([`\ufeff${str}`], {
      type: 'text/csv;charset=utf-8',
    });

    link.href = URL.createObjectURL(dataBlob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

/*
 * Process the multi-measure with multi-lines
 * For Grid-analysis-sheet
 * use the ' ' to divide different measures in the same line
 * use the '$' to divide different lines
 */
const processObjectValueInCol = (data: MultiData) => {
  const tempCells = data?.label ? [data?.label] : [];
  const values = data?.values;
  if (!isEmpty(values)) {
    forEach(values, (value) => {
      tempCells.push(value.join(' '));
    });
  }
  return tempCells.join('$');
};

/*
 * Process the multi-measure with single-lines
 * For StrategySheet
 */
const processObjectValueInRow = (data: MultiData, isFormat: boolean) => {
  if (!isFormat) {
    return data?.originalValues?.[0] ?? data?.values?.[0];
  }
  return data?.values?.[0];
};

/* Process the data in detail mode. */
const processValueInDetail = (
  sheetInstance: SpreadSheet,
  split: string,
  isFormat?: boolean,
): string[] => {
  const data = sheetInstance.dataSet.getDisplayDataSet();
  const { columns } = sheetInstance.dataCfg?.fields;
  const res = [];
  for (const [index, record] of data.entries()) {
    let tempRows = [];
    if (!isFormat) {
      tempRows = columns.map((v: string) => getCsvString(record[v]));
    } else {
      tempRows = columns.map((v: string) => {
        const mainFormatter = sheetInstance.dataSet.getFieldFormatter(v);
        return getCsvString(mainFormatter(record[v], record));
      });
    }
    if (sheetInstance.options.showSeriesNumber) {
      tempRows = [getCsvString(index + 1)].concat(tempRows);
    }

    res.push(tempRows.join(split));
  }
  return res;
};

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

/* Process the data when the value position is on the rows. */
const processValueInRow = (
  viewMeta: ViewMeta,
  sheetInstance: SpreadSheet,
  isFormat?: boolean,
) => {
  let tempCells = [];

  if (viewMeta) {
    const { fieldValue, valueField, data } = viewMeta;
    if (isObject(fieldValue)) {
      tempCells = processObjectValueInRow(fieldValue, isFormat);
      return tempCells;
    }
    // The main measure.
    if (!isFormat) {
      tempCells.push(fieldValue);
    } else {
      const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);
      tempCells.push(mainFormatter(fieldValue, data));
    }
  } else {
    // If the meta equals null then it will be replaced by '-'.
    tempCells.push(sheetInstance.options.placeholder);
  }
  return tempCells.join('    ');
};

/* Get the label name for the header. */
const getHeaderLabel = (val: string) => {
  const label = safeJsonParse(val);
  if (isArray(label)) {
    return label;
  }
  return val;
};

/**
 * 当列头label存在数组情况，需要将其他层级补齐空格
 * eg [ ['数值', '环比'], '2021'] => [ ['数值', '环比'], ['2021', '']
 */
const processColHeaders = (headers: any[][], arrayLength: number) => {
  const result = headers.map((header) =>
    header.map((item) =>
      isArray(item) ? item : [item, ...new Array(arrayLength - 1)],
    ),
  );
  return result;
};

/**
 * Copy data
 * @param sheetInstance
 * @param isFormat
 * @param split
 */
export const copyData = (
  sheetInstance: SpreadSheet,
  split: string,
  isFormat?: boolean,
): string => {
  const { rowsHierarchy, rowLeafNodes, colLeafNodes, getCellMeta } =
    sheetInstance?.facet?.layoutResult;
  const { maxLevel } = rowsHierarchy;
  const { valueInCols } = sheetInstance.dataCfg.fields;
  // Generate the table header.
  const rowsHeader = rowsHierarchy.sampleNodesForAllLevels.map((item) =>
    sheetInstance.dataSet.getFieldName(item.key),
  );

  // get max query property length
  const rowLength = rowLeafNodes.reduce((pre, cur) => {
    const length = cur.query ? Object.keys(cur.query).length : 0;
    return length > pre ? length : pre;
  }, 0);

  // Generate the table body.
  let detailRows = [];
  let maxRowLength = 0;

  if (!sheetInstance.isPivotMode()) {
    detailRows = processValueInDetail(sheetInstance, split, isFormat);
  } else {
    // Filter out the related row head leaf nodes.
    const caredRowLeafNodes = rowLeafNodes.filter((row) => row.height !== 0);
    for (const rowNode of caredRowLeafNodes) {
      // Removing the space at the beginning of the line of the label.
      rowNode.label = trim(rowNode?.label);
      const id = rowNode.id.replace(ROOT_BEGINNING_REGEX, '');
      let tempLine = id.split(ID_SEPARATOR);
      // TODO 兼容下钻，需要获取下钻最大层级
      const totalLevel = maxLevel + 1;
      const emptyLength = totalLevel - tempLine.length;
      if (emptyLength > 0) {
        tempLine.push(...new Array(emptyLength));
      }

      // 指标挂行头且为平铺模式下，获取指标名称
      const lastLabel = sheetInstance.dataSet.getFieldName(last(tempLine));
      tempLine[tempLine.length - 1] = lastLabel;

      for (const colNode of colLeafNodes) {
        if (valueInCols) {
          const viewMeta = getCellMeta(rowNode.rowIndex, colNode.colIndex);
          tempLine.push(processValueInCol(viewMeta, sheetInstance, isFormat));
        } else {
          const viewMeta = getCellMeta(rowNode.rowIndex, colNode.colIndex);
          const lintItem = processValueInRow(viewMeta, sheetInstance, isFormat);
          if (isArray(lintItem)) {
            tempLine = tempLine.concat(...lintItem);
          } else {
            tempLine.push(lintItem);
          }
        }
      }
      maxRowLength = max([tempLine.length, maxRowLength]);
      const lineString = tempLine
        .map((value) => getCsvString(value))
        .join(split);

      detailRows.push(lineString);
    }
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
    let tempColHeader = clone(colLeafNodes).map((colItem) => {
      let curColItem = colItem;

      const tempCol = [];

      // Generate the column dimensions.
      while (curColItem.level !== undefined) {
        const label = getHeaderLabel(curColItem.label);
        if (isArray(label)) {
          arrayLength = max([arrayLength, size(label)]);
        }
        tempCol.push(label);
        curColItem = curColItem.parent;
      }
      return tempCol;
    });

    if (arrayLength > 1) {
      tempColHeader = processColHeaders(tempColHeader, arrayLength);
    }

    const colLevels = tempColHeader.map((colHeader) => colHeader.length);
    const colLevel = max(colLevels);

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
        const { columns, rows, data } = sheetInstance.facet.cornerHeader.cfg;
        const colNodes = data.filter(
          ({ cornerType }) => cornerType === CornerNodeType.Col,
        );
        const rowNodes = data.filter(
          ({ cornerType }) => cornerType === CornerNodeType.Row,
        );

        if (index < colHeader.length - 1) {
          return [
            ...Array(rowLength - 1).fill(''),
            colNodes.find(({ field }) => field === columns[index])?.label || '',
            ...item,
          ];
        }
        if (index < colHeader.length) {
          return [
            ...rows.map(
              (row) => rowNodes.find(({ field }) => field === row)?.label || '',
            ),
            ...item,
          ];
        }

        return rowsHeader.concat(...item);
      }

      return index < colHeader.length
        ? Array(rowLength)
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

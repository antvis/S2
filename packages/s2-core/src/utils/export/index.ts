import { BaseSpreadSheet } from '../../sheet-type';
import { head, last, isEmpty, get, clone } from 'lodash';
import { ViewMeta } from '../..';
import { ID_SEPARATOR } from '../../common/constant';
import { getCsvString } from './export-worker';

// TODO 异常处理
export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

// TODO 异常处理 低版本兼容
export const download = (str: string, fileName: string) => {
  const link = document.createElement('a');
  link.download = `${fileName}.csv`;
  // Avoid errors in Chinese encoding.
  const dataBlob = new Blob([`\ufeff${str}`], {
    type: 'text/csv;charset=utf-8',
  });

  link.href = URL.createObjectURL(dataBlob);
  link.click();
  URL.revokeObjectURL(link.href);
};

/* Process the data in detail mode. */
const processValueInDetail = (
  sheetInstance: BaseSpreadSheet,
  split: string,
  isFormat?: boolean,
): string[] => {
  const { data } = sheetInstance.dataSet;
  const { rows, values } = sheetInstance.dataCfg?.fields;
  const res = [];
  for (const record of data) {
    const tempLine = [];
    let tempRows = [];
    let tempValus = [];
    if (!isFormat) {
      tempRows = rows.map((v: string) => getCsvString(record[v]));
      tempValus = values.map((v: string) => getCsvString(record[v]));
    } else {
      tempRows = rows.map((v: string) => {
        const mainFormatter = sheetInstance.dataSet.getFieldFormatter(v);
        return getCsvString(mainFormatter(record[v]));
      });
      tempValus = values.map((v: string) => {
        const mainFormatter = sheetInstance.dataSet.getFieldFormatter(v);
        return getCsvString(mainFormatter(record[v]));
      });
    }

    tempLine.push(tempRows.concat(tempValus).join(split));
    res.push(tempLine);
  }
  return res;
};

/* Process the data when the value position is on the columns.  */
const processValueInCol = (
  viewMeta: ViewMeta,
  sheetInstance: BaseSpreadSheet,
  isFormat?: boolean,
): string => {
  if (!viewMeta) {
    // If the meta equals null, replacing it with blank line.
    return getCsvString('');
  }
  const { fieldValue, valueField } = viewMeta;
  if (!isFormat) {
    return getCsvString(fieldValue);
  }
  const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);
  return getCsvString(mainFormatter(fieldValue));
};

/* Process the data when the value position is on the rows. */
const processValueInRow = (
  viewMeta: ViewMeta,
  sheetInstance: BaseSpreadSheet,
  isFormat?: boolean,
): string => {
  const tempCell = [];
  const { derivedValues } = sheetInstance.dataCfg.fields;
  const derivedValue = head(derivedValues);
  if (viewMeta) {
    const { data, fieldValue, valueField } = viewMeta;
    // The main measure.
    if (!isFormat) {
      tempCell.push(fieldValue);
    } else {
      const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);
      tempCell.push(mainFormatter(fieldValue));
    }

    const currentDV = sheetInstance.getDerivedValue(valueField);
    if (currentDV && !isEmpty(currentDV.derivedValueField)) {
      // When the derivedValue under the dimensions.
      for (const dv of currentDV.derivedValueField) {
        const derivedData = get(data, [0, dv]);
        if (!isFormat) {
          tempCell.push(derivedData);
        } else {
          const formatter = sheetInstance.dataSet.getFieldFormatter(dv);
          tempCell.push(formatter(derivedData));
        }
      }
    }
  } else {
    // If the meta equals null then it will be replaced by '-'.
    tempCell.push(getCsvString('-'));
    if (!isEmpty(derivedValue?.derivedValueField)) {
      // When the derivedValue under the dimensions.
      for (const dv of derivedValue.derivedValueField) {
        tempCell.push(getCsvString(dv));
      }
    }
  }
  return tempCell.join('    ');
};

/**
 * Copy data
 * @param sheetInstance
 * @param isFormat
 * @param split
 */
export const copyData = (
  sheetInstance: BaseSpreadSheet,
  split: string,
  isFormat?: boolean,
): string => {
  const {
    rowsHierarchy,
    rowLeafNodes,
    colLeafNodes,
    getViewMeta,
  } = sheetInstance?.facet?.layoutResult;
  const { valueInCols, spreadsheetType } = sheetInstance.options;
  const rows = clone(rowsHierarchy?.rows);

  /** Get the table header of rows. */
  const rowsHeader = rows.map((item) =>
    sheetInstance.dataSet.getFieldName(item),
  );

  const rowLength = rowsHeader.length;

  /** Get the table header of Columns. */
  const tempColHeader = clone(colLeafNodes).map((colItem) => {
    let curColItem = colItem;
    const tempCol = [];
    // Generate the column dimensions.
    while (curColItem.level !== undefined) {
      tempCol.push(curColItem.label);
      curColItem = curColItem.parent;
    }
    return tempCol;
  });
  const colLevel = tempColHeader[0].length;
  const colHeader: string[][] = [];
  // Convert the number of column dimension levels to the corresponding array.
  for (let i = colLevel - 1; i >= 0; i -= 1) {
    // The map of data set: key-name
    const colHeaderItem = tempColHeader
      .map((item) => item[i])
      .map((colItem) => sheetInstance.dataSet.getFieldName(colItem));
    colHeader.push(colHeaderItem);
  }

  // Genarate the table header.
  const headers = colHeader.map((item, index) => {
    return index < colHeader.length - 1
      ? Array(rowLength).concat(...item)
      : rowsHeader.concat(...item);
  });

  const headerRow = headers
    .map((header) => {
      return header.map((h) => getCsvString(h)).join(split);
    })
    .join('\r\n');

  // Genarate the table body.
  let detailRows = [];

  if (!spreadsheetType) {
    detailRows = processValueInDetail(sheetInstance, split, isFormat);
  } else {
    // Filter out the realated row head leaf nodes.
    const caredRowLeafNodes = rowLeafNodes.filter((row) => row.height !== 0);
    for (const rowNode of caredRowLeafNodes) {
      // Removing the space at the beginning of the line of the label.
      rowNode.label = rowNode.label ? rowNode.label.replace(/^\s*/g, '') : '';
      const id = rowNode.id.replace(/^root\[&\]*/, '');
      const tempLine = id.split(ID_SEPARATOR);
      const lastLabel = sheetInstance.dataSet.getFieldName(last(tempLine));
      tempLine[tempLine.length - 1] = lastLabel;
      const { rows: tempRows } = sheetInstance?.dataCfg?.fields;

      // Adapt to drill down mode.
      const emptyLength = tempRows.length - tempLine.length;
      for (let i = 0; i < emptyLength; i++) {
        tempLine.push('');
      }

      for (const colNode of colLeafNodes) {
        if (valueInCols) {
          const viewMeta = getViewMeta(rowNode.cellIndex, colNode.cellIndex);
          tempLine.push(processValueInCol(viewMeta, sheetInstance, isFormat));
        } else {
          const viewMeta = getViewMeta(rowNode.cellIndex, colNode.cellIndex);
          tempLine.push(processValueInRow(viewMeta, sheetInstance, isFormat));
        }
      }

      detailRows.push(tempLine.join(split));
    }
  }

  const data = [headerRow].concat(detailRows);
  const result = data.join('\r\n');
  return result;
};

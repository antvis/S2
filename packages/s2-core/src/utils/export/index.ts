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
  // 解决中文乱码问题
  const dataBlob = new Blob([`\ufeff${str}`], {
    type: 'text/csv;charset=utf-8',
  });

  link.href = URL.createObjectURL(dataBlob);
  link.click();
  URL.revokeObjectURL(link.href);
};

/* 明细表的处理 */
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

/* 数值挂列头的处理 */
const processValueInCol = (
  viewMeta: ViewMeta,
  sheetInstance: BaseSpreadSheet,
  isFormat?: boolean,
): string => {
  if (!viewMeta) {
    // meta 为null，补空行
    return getCsvString('');
  }
  const { fieldValue, valueField } = viewMeta;
  if (!isFormat) {
    return getCsvString(fieldValue);
  }
  const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);
  return getCsvString(mainFormatter(fieldValue));
};

/* 数值挂行头的处理 */
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
    // 主指标
    if (!isFormat) {
      tempCell.push(fieldValue);
    } else {
      const mainFormatter = sheetInstance.dataSet.getFieldFormatter(valueField);
      tempCell.push(mainFormatter(fieldValue));
    }

    // 衍生指标å
    const currentDV = sheetInstance.getDerivedValue(valueField);
    if (currentDV && !isEmpty(currentDV.derivedValueField)) {
      // 维度下存在衍生指标
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
    // meta 为null，补空
    tempCell.push(getCsvString('-'));
    if (!isEmpty(derivedValue?.derivedValueField)) {
      // 维度下存在衍生指标
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

  /** 获取行维度表头 */
  const rowsHeader = rows.map((item) =>
    sheetInstance.dataSet.getFieldName(item),
  );

  const rowLength = rowsHeader.length;

  /** 获取列维度表头，由于有维度需要转化 */
  const tempColHeader = clone(colLeafNodes).map((colItem) => {
    let curColItem = colItem;
    const tempCol = [];
    /** 列维度生成 */
    while (curColItem.level !== undefined) {
      tempCol.push(curColItem.label);
      curColItem = curColItem.parent;
    }
    return tempCol;
  });
  const colLevel = tempColHeader[0].length;
  const colHeader: string[][] = [];
  /** 将列维度层数转化为相应数组 */
  for (let i = colLevel - 1; i >= 0; i -= 1) {
    /** 数据字段映射key-name */
    const colHeaderItem = tempColHeader
      .map((item) => item[i])
      .map((colItem) => sheetInstance.dataSet.getFieldName(colItem));
    colHeader.push(colHeaderItem);
  }

  /** 构造表头 */
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

  /* 构造表体明细 */
  let detailRows = [];

  if (!spreadsheetType) {
    detailRows = processValueInDetail(sheetInstance, split, isFormat);
  } else {
    // 过滤出关系的行头叶子节点
    const caredRowLeafNodes = rowLeafNodes.filter((row) => row.height !== 0);
    for (const rowNode of caredRowLeafNodes) {
      // 去掉label本身的行首空格
      rowNode.label = rowNode.label.replace(/^\s*/g, '');
      const id = rowNode.id.replace(/^root\[&\]*/, '');
      const tempLine = id.split(ID_SEPARATOR);
      const lastLabel = sheetInstance.dataSet.getFieldName(last(tempLine));
      tempLine[tempLine.length - 1] = lastLabel;
      const { rows: tempRows } = sheetInstance?.dataCfg?.fields;

      // 补齐行头空格位 兼容下钻模式
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

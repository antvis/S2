import {
  sumBy,
  get,
  isNil,
  some,
  isEqual,
  noop,
  isNumber,
  uniq,
  forEach,
  isObject,
  isArray,
  map,
  size,
  filter,
  concat,
  compact,
} from 'lodash';
import { i18n } from '../common/i18n';
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from '../common/constant';
import getRightFieldInQuery from '../facet/layout/util/get-right-field-in-query';
import {
  DataItem,
  Aggregation,
  TooltipOptions,
  Position,
  SummaryProps,
  ListItem,
  HeadInfo,
  DataProps,
  BaseSpreadSheet,
} from '..';
import {
  POSITION_X_OFFSET,
  POSITION_Y_OFFSET,
} from '../common/tooltip/constant';

/**
 * calculate aggregate value
 */
export const getAggregationValue = (
  data: DataItem[],
  field: string,
  aggregation: Aggregation,
): number => {
  if (aggregation === 'SUM') {
    return sumBy(data, (datum) => {
      const v = get(datum, field, 0);
      return isNil(v) ? 0 : Number.parseFloat(v);
    });
  }
  return 0;
};

/** whether the data of hover is selected */
export const isHoverDataInSelectedData = (
  selectedData: DataItem[],
  hoverData: DataItem,
): boolean => {
  return some(selectedData, (dataItem: DataItem): boolean =>
    isEqual(dataItem, hoverData),
  );
};

/**
 * calculate tooltip show position
 */
export const getPosition = (
  position: Position,
  currContainer: HTMLElement = document.body,
  viewportContainer: HTMLElement = document.body,
): Position => {
  const tooltipBCR = currContainer.getBoundingClientRect();
  const viewportBCR = viewportContainer.getBoundingClientRect();
  let x = position.x + POSITION_X_OFFSET;
  let y = position.y + POSITION_Y_OFFSET;

  if (x + tooltipBCR.width > viewportBCR.width) {
    x = viewportBCR.width - tooltipBCR.width - 2;
  }

  if (y + tooltipBCR.height > viewportBCR.height) {
    y = viewportBCR.height - tooltipBCR.height - 2;
  }

  return {
    x,
    y,
    tipHeight: tooltipBCR.height,
  };
};

/**
 * get default options
 */
export const getOptions = (options?: TooltipOptions) => {
  return {
    operator: { onClick: noop, menus: [] },
    enterable: true,
    ...options,
  } as TooltipOptions;
};

export const shouldIgnore = (
  enterable: boolean,
  position: Position,
  currPosition: Position,
): boolean => {
  if (enterable) {
    if (
      Math.abs(position.x - currPosition?.x) < 20 &&
      Math.abs(position.y - currPosition?.y) < 20
    ) {
      return true;
    }
  }
  return false;
};

/**
 * add style to container
 */
export const manageContainerStyle = (container, styles: any) => {
  if (container && styles) {
    Object.keys(styles)?.forEach((item) => {
      container.style[item] = styles[item];
    });
  }

  return container;
};

/* formate */
export const getFriendlyVal = (val: any): number | string => {
  const isInvalidNumber = isNumber(val) && Number.isNaN(val);
  const isEmptyString = val === '';

  return isNil(val) || isInvalidNumber || isEmptyString ? '-' : val;
};

export const getSelectedCellIndexes = (
  spreadsheet: BaseSpreadSheet,
  layoutResult,
) => {
  const { rowLeafNodes, colLeafNodes } = layoutResult;

  const selected = spreadsheet?.store?.get('selected');

  if (isObject(selected)) {
    const { type, indexes } = selected;
    let [ii, jj] = indexes;
    if (type === 'brush' || type === 'cell') {
      const selectedIds = [];
      ii = isArray(ii) ? ii : [ii, ii];
      jj = isArray(jj) ? jj : [jj, jj];

      for (let i = ii[0]; i <= ii[1]; i++) {
        for (let j = jj[0]; j <= jj[1]; j++) {
          selectedIds.push([i, j]);
        }
      }
      return selectedIds;
    }
    // select row or coll
    const selectedIndexes = [];
    const leftNodes = type === 'row' ? colLeafNodes : rowLeafNodes;
    let indexs = type === 'row' ? ii : jj;

    map(leftNodes, (row, idx) => {
      indexs = isArray(indexs) ? indexs : [indexs, indexs];
      for (let i = indexs[0]; i <= indexs[1]; i++) {
        selectedIndexes.push([i, idx]);
      }
    });
    return selectedIndexes;
  }

  return [];
};

export const getSelectedData = (spreadsheet: BaseSpreadSheet): DataItem[] => {
  const layoutResult = spreadsheet?.facet?.layoutResult;

  const selectedCellIndexes = getSelectedCellIndexes(spreadsheet, layoutResult);

  const selectedData = [];

  forEach(selectedCellIndexes, ([i, j]) => {
    const viewMeta = layoutResult.getViewMeta(i, j);

    const data = get(viewMeta, 'data[0]');

    if (!isNil(data)) {
      selectedData.push(data);
    }
  });

  return selectedData;
};

export const getSelectedValueFields = (
  selectedData: DataItem[],
  field: string,
): string[] => {
  return uniq(selectedData.map((d) => d[field]));
};

export const getSummaryName = (
  spreadsheet: BaseSpreadSheet,
  valueFields,
  firstField,
  hoverData,
): string => {
  // total or subtotal
  // eslint-disable-next-line
  return size(valueFields) !== 1
    ? i18n('度量')
    : get(hoverData, 'isGrandTotals')
    ? i18n('总计')
    : spreadsheet?.dataSet?.getFieldName(firstField);
};

export const getFieldFormatter = (
  spreadsheet: BaseSpreadSheet,
  field: string,
) => {
  const formatter = spreadsheet?.dataSet?.getFieldFormatter(field);

  return (v: any) => {
    return getFriendlyVal(formatter(v));
  };
};

export const getListItem = (
  spreadsheet: BaseSpreadSheet,
  data: DataItem,
  field: string,
  valueField?: string,
): ListItem => {
  const name = spreadsheet?.dataSet?.getFieldName(field);
  const formatter = getFieldFormatter(spreadsheet, field);
  // eslint-disable-next-line
  const value = formatter(valueField ? valueField : data[field]);
  let icon;
  if (spreadsheet?.isDerivedValue(field)) {
    if (data[field]) {
      if (data[field] < 0) {
        icon = 'CellDown';
      } else {
        icon = 'CellUp';
      }
    }
  }
  return {
    name,
    value,
    icon,
  };
};

export const getFieldList = (
  spreadsheet: BaseSpreadSheet,
  fields: string[],
  hoverData: DataItem,
): ListItem[] => {
  const currFields = filter(
    concat([], fields),
    (field) => field !== EXTRA_FIELD && hoverData[field],
  );
  const fieldList = map(
    currFields,
    (field: string): ListItem => {
      return getListItem(spreadsheet, hoverData, field);
    },
  );
  return fieldList;
};

export const getHeadInfo = (
  spreadsheet: BaseSpreadSheet,
  hoverData: DataItem,
): HeadInfo => {
  if (hoverData) {
    const colFields = get(spreadsheet?.dataSet?.fields, 'columns', []);
    const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
    const colList = getFieldList(spreadsheet, colFields, hoverData);
    const rowList = getFieldList(spreadsheet, rowFields, hoverData);

    return { cols: colList, rows: rowList };
  }

  return { cols: [], rows: [] };
};

export const getDerivedItemList = (
  spreadsheet: BaseSpreadSheet,
  valItem,
  derivedValue,
  hoverData: DataItem,
) => {
  // replace old valItem
  valItem = map(derivedValue.derivedValueField, (value: any) => {
    return getListItem(spreadsheet, hoverData, value);
  });
  // add main indicator -- not empty
  if (hoverData[derivedValue.valueField]) {
    valItem.unshift(
      getListItem(spreadsheet, hoverData, derivedValue.valueField),
    );
  }
  return valItem;
};

export const getDetailList = (
  spreadsheet,
  hoverData: DataItem,
  options: TooltipOptions,
): ListItem[] => {
  if (hoverData) {
    const { isTotals } = options;

    let valItem = [];
    if (isTotals) {
      // total/subtotal
      valItem.push(
        getListItem(
          spreadsheet,
          hoverData,
          TOTAL_VALUE,
          get(hoverData, VALUE_FIELD),
        ),
      );
    } else {
      const field = hoverData[EXTRA_FIELD];
      if (hoverData[field]) {
        // filter empty
        valItem.push(getListItem(spreadsheet, hoverData, field));
      }
      const derivedValue = spreadsheet?.getDerivedValue(field);
      if (spreadsheet?.isValueInCols()) {
        // the value hangs at the head of the column, match the displayed fields according to the metric itself
        // 1、multiple derivative indicators
        // 2、only one column scene
        // 3、the clicked cell belongs to the derived index column
        // tooltip need to show all derivative indicators
        if (
          derivedValue.derivedValueField.length > 1 &&
          !isEqual(
            derivedValue.derivedValueField,
            derivedValue.displayDerivedValueField,
          ) &&
          spreadsheet?.isDerivedValue(field)
        ) {
          valItem = getDerivedItemList(
            spreadsheet,
            valItem,
            derivedValue,
            hoverData,
          );
        }
        // the value hangs at the head of the row，need to show all derivative indicators
      } else if (derivedValue.derivedValueField.length > 0) {
        valItem = getDerivedItemList(
          spreadsheet,
          valItem,
          derivedValue,
          hoverData,
        );
      }
    }

    return compact(concat([], [...valItem]));
  }
};

export const getSummaryProps = (
  spreadsheet: BaseSpreadSheet,
  hoverData: DataItem,
  options: TooltipOptions,
  aggregation: Aggregation = 'SUM',
): SummaryProps => {
  const selectedData = getSelectedData(spreadsheet);
  const valueFields = getSelectedValueFields(selectedData, EXTRA_FIELD);

  if (!options?.hideSummary && size(valueFields) > 0) {
    const firstField = valueFields[0];
    const firstFormatter = getFieldFormatter(spreadsheet, firstField);
    const name = getSummaryName(
      spreadsheet,
      valueFields,
      firstField,
      hoverData,
    );
    let aggregationValue = getAggregationValue(
      selectedData,
      VALUE_FIELD,
      aggregation,
    );
    aggregationValue = parseFloat(aggregationValue.toPrecision(12)); // solve accuracy problems
    const value = firstFormatter(aggregationValue);
    return {
      selectedData,
      name,
      value,
    };
  }
  return null;
};

export const getTooltipData = (
  spreadsheet: BaseSpreadSheet,
  data?: DataProps,
  options?: TooltipOptions,
  aggregation?: Aggregation,
) => {
  const { interpretation, infos, tips } = data || {};
  const summary = getSummaryProps(spreadsheet, data, options, aggregation);
  const headInfo = getHeadInfo(spreadsheet, data);
  const details = getDetailList(spreadsheet, data, options);

  return { summary, headInfo, details, interpretation, infos, tips };
};

export const getRightAndValueField = (
  spreadsheet: BaseSpreadSheet,
  options: TooltipOptions,
): { rightField: string; valueField: string } => {
  const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
  const rowQuery = options?.rowQuery || {};
  const rightField = getRightFieldInQuery(rowQuery, rowFields);
  const valueField = get(rowQuery, rightField, '');

  return { rightField, valueField };
};

export const getStrategySummary = (
  spreadsheet: BaseSpreadSheet,
  hoverData: Record<string, any>,
  options: TooltipOptions,
): SummaryProps => {
  if (hoverData) {
    const { valueField } = getRightAndValueField(spreadsheet, options);
    const { name, value } = getListItem(spreadsheet, hoverData, valueField);

    return {
      selectedData: [hoverData],
      name,
      value,
    };
  }
  return null;
};

export const getDerivedValues = (
  spreadsheet: BaseSpreadSheet,
  valueField: string,
): string[] => {
  const derivedValue = spreadsheet?.getDerivedValue(valueField);
  if (derivedValue) {
    return derivedValue.derivedValueField;
  }
  return [];
};

export const getStrategyDetailList = (
  spreadsheet: BaseSpreadSheet,
  hoverData: Record<string, any>,
  options: TooltipOptions,
): ListItem[] => {
  if (hoverData) {
    const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
    // if rows is not empty and values is data, use normal-tooltip
    if (rowFields.find((item) => item === EXTRA_FIELD)) {
      return getDetailList(spreadsheet, hoverData, options);
    }
    // the value hangs at the head of the column
    const { rightField, valueField } = getRightAndValueField(
      spreadsheet,
      options,
    );
    // show all derivative indicators no matter have value
    const valuesField = [
      rightField,
      ...getDerivedValues(spreadsheet, valueField),
    ];

    return map(
      valuesField,
      (field: string): ListItem => {
        if (isEqual(field, rightField)) {
          // the value of the measure dimension is taken separately
          return getListItem(spreadsheet, hoverData, hoverData[field]);
        }

        return getListItem(spreadsheet, hoverData, field);
      },
    );
  }
};

export const getStrategyHeadInfo = (
  spreadsheet: BaseSpreadSheet,
  hoverData: DataItem,
  options?: TooltipOptions,
): HeadInfo => {
  const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
  // if rows is not empty and values is data, use normal-tooltip
  if (rowFields.find((item) => item === EXTRA_FIELD)) {
    return getHeadInfo(spreadsheet, hoverData);
  }
  // the value hangs at the head of the column
  const { rightField } = getRightAndValueField(spreadsheet, options);
  const index = rowFields.indexOf(rightField);
  const rows = [...rowFields];
  if (index !== -1) {
    rows.splice(index + 1);
  }
  if (hoverData) {
    const colFields = get(spreadsheet?.dataSet?.fields, 'cols', []);
    const colList = getFieldList(spreadsheet, colFields, hoverData);
    const rowList = getFieldList(spreadsheet, rows, hoverData);

    return { cols: colList, rows: rowList };
  }

  return { cols: [], rows: [] };
};

export const getStrategyTooltipData = (
  spreadsheet: BaseSpreadSheet,
  data?: DataProps,
  options?: TooltipOptions,
) => {
  const { interpretation, infos, tips } = data || {};
  const summary = getStrategySummary(spreadsheet, data, options);
  const headInfo = getStrategyHeadInfo(spreadsheet, data);
  const details = getStrategyDetailList(spreadsheet, data, options);

  return { summary, headInfo, details, interpretation, infos, tips };
};

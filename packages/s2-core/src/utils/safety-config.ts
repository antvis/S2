/**
 * Create By Bruce Too
 * On 2021-03-04
 */
import {
  Conditions,
  DataCfg,
  Fields,
  SpreadsheetOptions,
  Totals,
} from '../common/interface';
import { DefaultStyleCfg } from '../builder/default-style-cfg';
import * as _ from 'lodash';
/**
 * Create By Bruce Too
 * On 2021-03-02
 */
export const safetyDataCfg = (dataCfg: DataCfg): DataCfg => {
  const { rows, columns, values, derivedValues } = dataCfg.fields || {
    rows: [],
    columns: [],
    values: [],
    derivedValues: [],
  };
  const safetyFields = {
    rows: rows || [],
    columns: columns || [],
    values: values || [],
    derivedValues: derivedValues || [],
  } as Fields;
  return {
    ...dataCfg,
    meta: dataCfg.meta || [],
    data: dataCfg.data || [],
    sortParams: dataCfg.sortParams || [],
    fields: safetyFields,
  } as DataCfg;
};

export const safetyOptions = (
  options: SpreadsheetOptions,
): SpreadsheetOptions => {
  const safetyConditions = {
    text: [],
    background: [],
    interval: [],
    icon: [],
  } as Conditions;
  const safetyTotals = {
    row: {},
    col: {},
  } as Totals;
  return {
    ...options,
    width: options.width || 600,
    height: options.height || 480,
    debug: _.get(options, 'debug', false),
    hierarchyType: options.hierarchyType || 'grid',
    hierarchyCollapse: _.get(options, 'hierarchyCollapse', false),
    conditions: _.merge({}, safetyConditions, options.conditions || {}),
    totals: _.merge({}, safetyTotals, options.totals || {}),
    linkFieldIds: options.linkFieldIds || [],
    pagination: options.pagination || false,
    containsRowHeader: _.get(options, 'containsRowHeader', true),
    spreadsheetType: _.get(options, 'spreadsheetType', true),
    style: _.merge({}, DefaultStyleCfg(), options.style),
    showSeriesNumber: _.get(options, 'showSeriesNumber', false),
    hideNodesIds: options.hideNodesIds || [],
    keepOnlyNodesIds: options.keepOnlyNodesIds || [],
    registerDefaultInteractions: _.get(
      options,
      'registerDefaultInteractions',
      true,
    ),
    scrollReachNodeField: options.scrollReachNodeField || {
      rowField: [],
      colField: [],
    },
    hideRowColFields: options.hideRowColFields || [],
    valueInCols: _.get(options, 'valueInCols', true),
    needDataPlaceHolderCell: _.get(options, 'needDataPlaceHolderCell', false),
    hideTooltip: _.get(options, 'hideTooltip', false),
    // dataCell, cornerCell, rowCell, colCell, frame, cornerHeader, layout
    // layoutResult, hierarchy, layoutArrange 存在使用时校验，在此不处理
  } as SpreadsheetOptions;
};

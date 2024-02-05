import { getDefaultSeriesNumberText } from '../../common';
import { SERIES_NUMBER_FIELD } from '../../common/constant';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import type { HeaderParams } from './interface';

export const buildTableHierarchy = (params: HeaderParams) => {
  const { spreadsheet, rootNode, fields, hierarchy } = params;
  const { columns = [] } = spreadsheet.dataSet.fields;
  const { enable, text } = spreadsheet.options.seriesNumber ?? {};

  const seriesNumberNodeValue = getDefaultSeriesNumberText(text);
  const fieldValues = columns.map((field) => {
    return field === SERIES_NUMBER_FIELD
      ? seriesNumberNodeValue
      : spreadsheet.dataSet.getFieldName(field);
  });

  if (enable && !fields.includes(SERIES_NUMBER_FIELD)) {
    fields.unshift(SERIES_NUMBER_FIELD);
    fieldValues.unshift(seriesNumberNodeValue);
  }

  generateHeaderNodes({
    spreadsheet,
    currentField: fields[0] as string,
    fields: fields as string[],
    fieldValues,
    hierarchy,
    parentNode: rootNode,
    level: 0,
    query: {},
    addMeasureInTotalQuery: false,
    addTotalMeasureInTotal: false,
  });
};

import { SERIES_NUMBER_FIELD } from '../../common/constant';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { buildGridHierarchy } from './build-gird-hierarchy';
import type { HeaderParams } from './interface';

export const buildTableHierarchy = (params: HeaderParams) => {
  const { spreadsheet, rootNode, fields, hierarchy } = params;
  const { columns = [] } = spreadsheet.dataSet.fields;
  const { enable } = spreadsheet.options.seriesNumber ?? {};

  const seriesNumberNodeValue = spreadsheet.getSeriesNumberText();
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
    handler: buildGridHierarchy,
  });
};

import { TableHeaderParams } from 'src/facet/layout/interface';
import { SERIES_NUMBER_FIELD } from 'src/common/constant';
import { i18n } from 'src/common/i18n';
import { get } from 'lodash';
import { generateHeaderNodes } from '@/facet/layout/util/generate-header-nodes';

export const buildTableHierarchy = (params: TableHeaderParams) => {
  const { facetCfg, hierarchy, parentNode } = params;
  const { columns, spreadsheet, dataSet } = facetCfg;

  const showSeriesNumber = get(spreadsheet, 'options.showSeriesNumber', false);

  const fields = [...columns];

  const fieldValues = columns.map((val) => dataSet.getFieldName(val));

  if (showSeriesNumber) {
    fields.unshift(SERIES_NUMBER_FIELD);
    fieldValues.unshift(i18n('序号'));
  }

  generateHeaderNodes({
    currentField: columns[0],
    fields,
    fieldValues,
    facetCfg,
    hierarchy,
    parentNode,
    level: 0,
    query: {},
    addMeasureInTotalQuery: false,
    addTotalMeasureInTotal: false,
  });
};

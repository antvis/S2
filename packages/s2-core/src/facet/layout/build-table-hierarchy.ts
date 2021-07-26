import { TableHeaderParams } from 'src/facet/layout/interface';
import { generateHeaderNodes } from '@/facet/layout/util/generate-row-nodes';
import { SERIES_NUMBER_FIELD } from 'src/common/constant';
import { i18n } from 'src/common/i18n';
import { get } from 'lodash';

export const buildTableHierarchy = (params: TableHeaderParams) => {
  const { facetCfg, hierarchy, parentNode } = params;
  const { cols, spreadsheet, dataSet } = facetCfg;

  const showSeriesNumber = get(spreadsheet, 'options.showSeriesNumber', false);

  const fields = [...cols];

  const fieldValues = cols.map((val) => dataSet.getFieldName(val));

  if (showSeriesNumber) {
    fields.unshift(SERIES_NUMBER_FIELD);
    fieldValues.unshift(i18n('序号'));
  }

  generateHeaderNodes({
    currentField: cols[0],
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

import { difference, isEmpty } from 'lodash';
import { TableHeaderParams } from '@/facet/layout/interface';
import { SERIES_NUMBER_FIELD } from '@/common/constant';
import { i18n } from '@/common/i18n';
import { generateHeaderNodes } from '@/utils/layout/generate-header-nodes';

export const buildTableHierarchy = (params: TableHeaderParams) => {
  const { facetCfg, hierarchy, parentNode } = params;
  const { columns, spreadsheet, dataSet, hiddenColumnFields = [] } = facetCfg;

  const hasInitColumnNodes = !isEmpty(spreadsheet.store.get('initColumnNodes'));
  const showSeriesNumber = spreadsheet.options?.showSeriesNumber;

  const displayedColumns = hasInitColumnNodes
    ? difference(columns, hiddenColumnFields)
    : columns;
  const fields = [...displayedColumns];

  const fieldValues = displayedColumns.map((val) => dataSet.getFieldName(val));

  if (showSeriesNumber) {
    fields.unshift(SERIES_NUMBER_FIELD);
    fieldValues.unshift(i18n('序号'));
  }

  generateHeaderNodes({
    currentField: displayedColumns[0],
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

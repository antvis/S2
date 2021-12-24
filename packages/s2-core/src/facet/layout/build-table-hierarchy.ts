import { map } from 'lodash';
import { TableHeaderParams } from '@/facet/layout/interface';
import { SERIES_NUMBER_FIELD } from '@/common/constant';
import { i18n } from '@/common/i18n';
import { generateHeaderNodes } from '@/utils/layout/generate-header-nodes';

export const buildTableHierarchy = (params: TableHeaderParams) => {
  const { facetCfg, hierarchy, parentNode } = params;
  const { columns, spreadsheet, dataSet } = facetCfg;

  const hiddenColumnsDetail = spreadsheet.store.get('hiddenColumnsDetail');
  const showSeriesNumber = facetCfg?.showSeriesNumber;

  const displayedColumns = columns.filter((column) => {
    if (!hiddenColumnsDetail) {
      return true;
    }
    return hiddenColumnsDetail.every((detail) => {
      return detail.hideColumnNodes.every((node) => {
        return node.field !== column;
      });
    });
  });
  const fields = [...displayedColumns];

  const fieldValues = map(displayedColumns, (val) => dataSet.getFieldName(val));

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

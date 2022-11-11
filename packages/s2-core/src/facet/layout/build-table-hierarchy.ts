import { map } from 'lodash';
import { SERIES_NUMBER_FIELD } from '../../common/constant';
import { i18n } from '../../common/i18n';
import { generateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import type { FieldValue, TableHeaderParams } from '../layout/interface';

export const buildTableHierarchy = (params: TableHeaderParams) => {
  const { facetCfg, hierarchy, parentNode } = params;
  const { columns = [], spreadsheet, dataSet } = facetCfg;

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
  const fields = [...displayedColumns] as string[];

  const fieldValues = map(displayedColumns, (field: string) =>
    dataSet.getFieldName(field),
  ) as unknown as FieldValue[];

  if (showSeriesNumber) {
    fields.unshift(SERIES_NUMBER_FIELD);
    fieldValues.unshift(i18n('序号'));
  }

  generateHeaderNodes({
    currentField: fields[0] as string,
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

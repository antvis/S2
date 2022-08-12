import { map } from 'lodash';
import { SERIES_NUMBER_FIELD } from '../../common/constant';
import { i18n } from '../../common/i18n';
import {
  generateHeaderNodes,
  DFSGenerateHeaderNodes,
} from '../../utils/layout/generate-header-nodes';
import { getDisplayedColumnsTree } from '../utils';
import type { TableHeaderParams } from '../layout/interface';

export const buildTableHierarchy = (params: TableHeaderParams) => {
  const { facetCfg, hierarchy, parentNode } = params;
  const { columns, columnsTree, spreadsheet, dataSet } = facetCfg;

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

  if (columnsTree) {
    if (showSeriesNumber) {
      generateHeaderNodes({
        currentField: fields[0],
        fields: [fields[0]],
        fieldValues: [fieldValues[0]],
        facetCfg,
        hierarchy,
        parentNode,
        level: 0,
        query: {},
        addMeasureInTotalQuery: false,
        addTotalMeasureInTotal: false,
      });
    }
    const fieldsMap = fields.reduce((prev, field) => {
      prev[field] = true;
      return prev;
    }, {});
    DFSGenerateHeaderNodes(
      getDisplayedColumnsTree(columnsTree, fieldsMap),
      params,
      0,
      null,
    );
    return;
  }

  generateHeaderNodes({
    currentField: fields[0],
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

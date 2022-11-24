import { DFSGenerateHeaderNodes } from '../../utils/layout/generate-header-nodes';
import { getDisplayedColumnsTree, getLeafColumnsWithKey } from '../utils';
import { SERIES_NUMBER_FIELD } from '../../common/constant';
import type { TableHeaderParams } from '../layout/interface';
import type { CustomTreeNode } from '../../common';

export const buildTableHierarchy = (params: TableHeaderParams) => {
  const { facetCfg } = params;
  const { columns = [], spreadsheet } = facetCfg;

  const hiddenColumnsDetail = spreadsheet.store.get('hiddenColumnsDetail');
  const showSeriesNumber = facetCfg?.showSeriesNumber;
  // 获取所有叶子结点
  const leafs = getLeafColumnsWithKey(columns);
  const displayedColumns = leafs.filter((column) => {
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

  const tree = [...columns];
  const fieldsMap: Record<string, boolean> = {};
  if (showSeriesNumber) {
    tree.unshift({
      key: SERIES_NUMBER_FIELD,
    } as CustomTreeNode);
    // @ts-ignore
    fieldsMap[SERIES_NUMBER_FIELD] = true;
  }

  fields.reduce((prev, field) => {
    // @ts-ignore
    prev[field] = true;
    return prev;
  }, fieldsMap);

  DFSGenerateHeaderNodes(
    getDisplayedColumnsTree(tree, fieldsMap),
    params,
    0,
    null,
  );
};

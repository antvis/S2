import { LayoutCallback } from '../../common/interface';
import { size } from 'lodash';

export const DrillDownLayout: LayoutCallback = (
  spreadsheet,
  rowNode,
  colNode,
) => {
  // @see option-helper
  const otterLayout = spreadsheet.options.otterLayout;
  if (otterLayout) {
    // 外部存在自定义的layout 先处理外部
    otterLayout(spreadsheet, rowNode, colNode);
  }
  if (rowNode && spreadsheet.isHierarchyTreeType()) {
    // 下钻icon下方的所有空节点全部要隐藏
    // 如果父节点下只有一个 undefined 节点，标记父节点为叶子节点
    const actionIconLevel = spreadsheet.store.get(
      'drillDownActionIconLevel',
      -1,
    );

    if (actionIconLevel >= 0) {
      // 存在下钻的维度
      if (rowNode && size(rowNode.children) === 0) {
        rowNode.isLeaf = true;
      }
    }
  }
};

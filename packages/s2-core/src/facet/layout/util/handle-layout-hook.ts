import { SpreadSheetFacetCfg } from '../../../common/interface';
import { Node } from '../node';

/**
 * Create By Bruce Too
 * On 2020-07-01
 * 给行，列的每个node节点增加外部控制宽高的回调！！
 */
export default function handleLayoutHook(
  facetCfg: SpreadSheetFacetCfg,
  rowNode: Node,
  colNode: Node,
) {
  const layout = facetCfg?.layout;
  if (layout) {
    layout(facetCfg.spreadsheet, rowNode, colNode);
  }
}

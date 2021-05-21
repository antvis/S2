import { SpreadsheetFacetCfg, S2Options } from '../common/interface';
import { BaseTooltip } from '../tooltip';
import { isEmpty, merge } from 'lodash';
import { KEY_COLLAPSE_TREE_ROWS } from '../common/constant';
import { SpreadsheetFacet } from '../facet';
import { StrategyDataSet, BaseDataSet } from '../data-set';
import { BaseFacet } from '../facet/base-facet';
import { Node } from '../index';

export default class StrategySheet extends SpreadSheet {
  protected bindEvents() {
    this.off(KEY_COLLAPSE_TREE_ROWS);
    this.on(KEY_COLLAPSE_TREE_ROWS, (data) => {
      const { id, isCollapsed, node } = data;
      const { style, hierarchyCollapse } = this.options;
      const cRows = { [id]: isCollapsed };
      // 在此需要根据 hierarchyCollapse来决定缓存点击的node id
      if (hierarchyCollapse) {
        // 如果角头的collapse总开关开启，需要对空节点(label为空)做单独处理
        // 比如 A -> B(空节点) -> C(空节点) -> (D1, D2)
        // B，C 节点的collapse状态必须跟随A
        Node.getAllChildrenNode(node)
          .filter((n) => {
            return !n.isLeaf && isEmpty(n.label);
          })
          .forEach((n) => {
            cRows[n.id] = isCollapsed;
          });
      }
      const options = merge({}, this.options, {
        style: {
          ...style,
          collapsedRows: cRows,
        },
      });
      // post to x-report to store state
      this.emit('spreadsheet:collapsed-rows', {
        collapsedRows: options.style.collapsedRows,
      });
      this.setOptions(options);

      this.render(false, () => {
        this.emit('spreadsheet:after-collapsed-rows', {
          collapsedRows: options.style.collapsedRows,
        });
      });
    });
  }

  isHierarchyTreeType(): boolean {
    return true;
  }

  protected initFacet(facetCfg: SpreadsheetFacetCfg): BaseFacet {
    return new SpreadsheetFacet(facetCfg);
  }

  protected initDataSet(options: Partial<S2Options>): BaseDataSet {
    return new StrategyDataSet({
      spreadsheet: this,
    });
  }

  protected initTooltip(): BaseTooltip {
    return new BaseTooltip(this);
  }

  protected registerInteractions(options: S2Options) {
    super.registerInteractions(options);
  }
}

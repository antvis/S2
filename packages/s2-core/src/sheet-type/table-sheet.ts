import type { Event as CanvasEvent } from '@antv/g-canvas';
import { TableDataCell, TableSeriesCell } from '../cell';
import {
  InterceptType,
  KEY_GROUP_PANEL_FROZEN_BOTTOM,
  KEY_GROUP_PANEL_FROZEN_COL,
  KEY_GROUP_PANEL_FROZEN_ROW,
  KEY_GROUP_PANEL_FROZEN_TOP,
  KEY_GROUP_PANEL_FROZEN_TRAILING_COL,
  KEY_GROUP_PANEL_FROZEN_TRAILING_ROW,
  PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
  S2Event,
  getTooltipOperatorTableSortMenus,
} from '../common/constant';
import type {
  S2Options,
  SortMethod,
  SortParam,
  SpreadSheetFacetCfg,
  TooltipOperatorOptions,
  ViewMeta,
} from '../common/interface';
import { TableDataSet } from '../data-set';
import { TableFacet } from '../facet';
import type { Node } from '../facet/layout/node';
import { FrozenGroup } from '../group/frozen-group';
import { SpreadSheet } from './spread-sheet';

export class TableSheet extends SpreadSheet {
  public getDataSet(options: S2Options) {
    const { dataSet } = options;
    if (dataSet) {
      return dataSet(this);
    }

    return new TableDataSet(this);
  }

  /**
   * Check if is pivot mode
   */
  public isPivotMode(): boolean {
    return false;
  }

  /**
   * Check if is pivot mode
   */
  public isTableMode(): boolean {
    return true;
  }

  /**
   * tree type must be in strategy mode
   */
  public isHierarchyTreeType(): boolean {
    return false;
  }

  /**
   * Check whether scroll contains row header
   * For now contains row header in ListSheet mode by default
   */
  public isScrollContainsRowHeader(): boolean {
    return false;
  }

  /**
   * Scroll Freeze Row Header
   */
  public isFrozenRowHeader(): boolean {
    return false;
  }

  public clearDrillDownData(): void {}

  /**
   * Check if the value is in the columns
   */
  public isValueInCols(): boolean {
    return false;
  }

  protected bindEvents() {}

  protected initPanelGroupChildren(): void {
    super.initPanelGroupChildren();
    const commonParams = {
      zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
      s2: this,
    };
    [
      this.frozenRowGroup,
      this.frozenColGroup,
      this.frozenTrailingRowGroup,
      this.frozenTrailingColGroup,
      this.frozenTopGroup,
      this.frozenBottomGroup,
    ] = [
      KEY_GROUP_PANEL_FROZEN_ROW,
      KEY_GROUP_PANEL_FROZEN_COL,
      KEY_GROUP_PANEL_FROZEN_TRAILING_ROW,
      KEY_GROUP_PANEL_FROZEN_TRAILING_COL,
      KEY_GROUP_PANEL_FROZEN_TOP,
      KEY_GROUP_PANEL_FROZEN_BOTTOM,
    ].map((name) => {
      const g = new FrozenGroup({
        name,
        ...commonParams,
      });
      this.panelGroup.add(g);
      return g;
    });
  }

  protected getFacetCfgFromDataSetAndOptions(): SpreadSheetFacetCfg {
    const { fields, meta } = this.dataSet;
    const { style, dataCell } = this.options;
    // 默认单元格实现
    const defaultCell = (facet: ViewMeta) => {
      if (this.options.showSeriesNumber && facet.colIndex === 0) {
        return new TableSeriesCell(facet, this);
      }
      return new TableDataCell(facet, this);
    };

    return {
      ...this.options,
      ...fields,
      ...style,
      meta,
      spreadsheet: this,
      dataSet: this.dataSet,
      dataCell: dataCell ?? defaultCell,
    };
  }

  protected buildFacet() {
    const facetCfg = this.getFacetCfgFromDataSetAndOptions();
    this.facet?.destroy();
    this.facet = new TableFacet(facetCfg);
    this.facet.render();
  }

  protected clearFrozenGroups() {
    this.frozenRowGroup.set('children', []);
    this.frozenColGroup.set('children', []);
    this.frozenTrailingRowGroup.set('children', []);
    this.frozenTrailingColGroup.set('children', []);
    this.frozenTopGroup.set('children', []);
    this.frozenBottomGroup.set('children', []);
  }

  public destroy() {
    super.destroy();
    this.clearFrozenGroups();
    this.off(S2Event.RANGE_SORT);
    this.off(S2Event.RANGE_FILTER);
  }

  // TODO: 好迷的写法, 拿到 key 又硬要写成 {key: key} 然后又解构一次, 不确定有没有被外面调用, 暂时不动
  public onSortTooltipClick = ({ key }: { key: SortMethod }, meta: Node) => {
    const { field } = meta;

    const sortParam: SortParam = {
      sortFieldId: field,
      sortMethod: key,
    };

    this.updateSortMethodMap(meta.id, key);
    // 触发排序事件
    this.emit(S2Event.RANGE_SORT, [sortParam]);
  };

  public handleGroupSort(event: CanvasEvent, meta: Node) {
    event.stopPropagation();
    this.interaction.addIntercepts([InterceptType.HOVER]);

    const defaultSelectedKeys = this.getMenuDefaultSelectedKeys(meta?.id);
    const operator: TooltipOperatorOptions = {
      onClick: ({ key }) => {
        const sortMethod = key as unknown as SortMethod;
        this.onSortTooltipClick({ key: sortMethod }, meta);
      },
      menus: getTooltipOperatorTableSortMenus(),
      defaultSelectedKeys,
    };

    this.showTooltipWithInfo(event, [], {
      operator,
      onlyMenu: true,
      forceRender: true,
    });
  }
}

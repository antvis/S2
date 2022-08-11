import type { Event as CanvasEvent } from '@antv/g-canvas';
import { set } from 'lodash';
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
  SortParam,
  SpreadSheetFacetCfg,
  TableSortParam,
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
  }

  public onSortTooltipClick = ({ key }, meta) => {
    const { field } = meta;

    const sortParam: SortParam = {
      sortFieldId: field,
      sortMethod: key as unknown as SortParam['sortMethod'],
    };

    let params = [sortParam];

    const currentParams = this.dataCfg.sortParams || [];

    params = params.map((item: TableSortParam) => {
      const newItem = {
        ...item,
        // 兼容之前 sortKey 的用法
        sortFieldId: item.sortKey ?? item.sortFieldId,
      };

      const oldItem =
        currentParams.find((p) => p.sortFieldId === newItem.sortFieldId) ?? {};
      return {
        ...oldItem,
        ...newItem,
      };
    });

    const oldConfigs = currentParams.filter((config) => {
      const newItem = params.find((p) => p.sortFieldId === config.sortFieldId);
      if (newItem) {
        return false;
      }
      return true;
    });
    // 触发排序事件
    this.emit(S2Event.RANGE_SORT, [sortParam]);
    set(this.dataCfg, 'sortParams', [...oldConfigs, ...params]);
    this.setDataCfg(this.dataCfg);
    this.render(true);
  };

  public handleGroupSort(event: CanvasEvent, meta: Node) {
    event.stopPropagation();
    this.interaction.addIntercepts([InterceptType.HOVER]);

    const operator: TooltipOperatorOptions = {
      onClick: (params: { key: string }) => {
        this.onSortTooltipClick(params, meta);
        this.emit(S2Event.RANGE_SORTED, event);
      },

      menus: getTooltipOperatorTableSortMenus(),
    };

    this.showTooltipWithInfo(event, [], {
      operator,
      onlyMenu: true,
    });
  }
}

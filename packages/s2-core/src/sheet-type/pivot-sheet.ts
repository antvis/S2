import { Canvas, Event as CanvasEvent, IGroup } from '@antv/g-canvas';
import { clone, get, includes, isString, merge, size } from 'lodash';
import { SpreadSheet } from './spread-sheet';
import { BaseCell, DataCell, TableDataCell, TableRowCell } from '@/cell';
import {
  BACK_GROUND_GROUP_CONTAINER_Z_INDEX,
  FRONT_GROUND_GROUP_CONTAINER_Z_INDEX,
  KEY_GROUP_BACK_GROUND,
  KEY_GROUP_FORE_GROUND,
  KEY_GROUP_PANEL_FROZEN_BOTTOM,
  KEY_GROUP_PANEL_FROZEN_COL,
  KEY_GROUP_PANEL_FROZEN_ROW,
  KEY_GROUP_PANEL_FROZEN_TOP,
  KEY_GROUP_PANEL_FROZEN_TRAILING_COL,
  KEY_GROUP_PANEL_FROZEN_TRAILING_ROW,
  KEY_GROUP_PANEL_GROUND,
  KEY_GROUP_PANEL_SCROLL,
  PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
  PANEL_GROUP_GROUP_CONTAINER_Z_INDEX,
  PANEL_GROUP_SCROLL_GROUP_Z_INDEX,
  S2Event,
} from '@/common/constant';
import { DebuggerUtil } from '@/common/debug';
import { i18n } from '@/common/i18n';
import {
  OffsetConfig,
  Pagination,
  S2CellType,
  S2DataConfig,
  S2MountContainer,
  S2Options,
  safetyDataConfig,
  safetyOptions,
  SpreadSheetFacetCfg,
  ThemeCfg,
  TooltipData,
  TooltipOptions,
  TooltipShowOptions,
  Total,
  Totals,
  ViewMeta,
} from '@/common/interface';
import {
  EmitterType,
  RowCellCollapseTreeRowsType,
} from '@/common/interface/emitter';
import { Store } from '@/common/store';
import { BaseDataSet, PivotDataSet, TableDataSet } from '@/data-set';
import { CustomTreePivotDataSet } from '@/data-set/custom-tree-pivot-data-set';
import { BaseFacet, PivotFacet, TableFacet } from '@/facet';
import { Node, SpreadSheetTheme } from '@/index';
import { RootInteraction } from '@/interaction/root';
import { getTheme } from '@/theme';
import { HdAdapter } from '@/ui/hd-adapter';
import { BaseTooltip } from '@/ui/tooltip';
import { clearValueRangeState } from '@/utils/condition/state-controller';
import { customMerge } from '@/utils/merge';
import { getTooltipData } from '@/utils/tooltip';

export class PivotSheet extends SpreadSheet {
  public getDataSet(options: S2Options) {
    const { dataSet, hierarchyType } = options;
    if (dataSet) {
      return dataSet(this);
    }

    const realDataSet =
      hierarchyType === 'customTree'
        ? new CustomTreePivotDataSet(this)
        : new PivotDataSet(this);
    return realDataSet;
  }

  /**
   * Check if is pivot mode
   */
  public isPivotMode(): boolean {
    return true;
  }

  /**
   * Check if is pivot mode
   */
  public isTableMode(): boolean {
    return false;
  }

  /**
   * tree type must be in strategy mode
   */
  public isHierarchyTreeType(): boolean {
    const type = this.options.hierarchyType;
    // custom tree and tree!!!
    return type === 'tree' || type === 'customTree';
  }

  /**
   * Check whether scroll contains row header
   * For now contains row header in ListSheet mode by default
   */
  public isScrollContainsRowHeader(): boolean {
    return !this.freezeRowHeader();
  }

  /**
   * Scroll Freeze Row Header
   */
  public freezeRowHeader(): boolean {
    return this.options?.freezeRowHeader;
  }

  /**
   * Check if the value is in the columns
   */
  public isValueInCols(): boolean {
    return this.dataSet.fields.valueInCols;
  }

  protected getFacetCfgFromDataSetAndOptions(): SpreadSheetFacetCfg {
    const { fields, meta } = this.dataSet;
    const { style, dataCell } = this.options;
    // 默认单元格实现
    const defaultCell = (facet: ViewMeta) => new DataCell(facet, this);

    return {
      ...fields,
      ...style,
      ...this.options,
      meta,
      spreadsheet: this,
      dataSet: this.dataSet,
      dataCell: dataCell ?? defaultCell,
    };
  }

  protected buildFacet() {
    const facetCfg = this.getFacetCfgFromDataSetAndOptions();
    this.facet?.destroy();
    this.facet = new PivotFacet(facetCfg);
    this.facet.render();
  }

  protected bindEvents() {
    this.off(S2Event.ROW_CELL_COLLAPSE_TREE_ROWS);
    this.off(S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL);
    // collapse rows in tree mode of SpreadSheet
    this.on(
      S2Event.ROW_CELL_COLLAPSE_TREE_ROWS,
      this.handleRowCellCollapseTreeRows,
    );
    // 收起、展开按钮
    this.on(
      S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL,
      this.handleTreeRowsCollapseAll,
    );
  }

  protected handleRowCellCollapseTreeRows(data: RowCellCollapseTreeRowsType) {
    const { id, isCollapsed } = data;
    const options: Partial<S2Options> = {
      style: {
        collapsedRows: {
          [id]: isCollapsed,
        },
      },
    };
    // post to x-report to store state
    this.emit(S2Event.LAYOUT_COLLAPSE_ROWS, {
      collapsedRows: options.style.collapsedRows,
    });
    this.setOptions(options);
    this.render(false);
    this.emit(S2Event.LAYOUT_AFTER_COLLAPSE_ROWS, {
      collapsedRows: options.style.collapsedRows,
    });
  }

  protected handleTreeRowsCollapseAll(isCollapsed: boolean) {
    const options: Partial<S2Options> = {
      hierarchyCollapse: !isCollapsed,
      style: {
        collapsedRows: {}, // 清空用户操作的缓存
      },
    };
    this.setOptions(options);
    this.render(false);
  }
}

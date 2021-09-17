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

export class TableSheet extends SpreadSheet {
  public getDataSet(options: S2Options) {
    const { dataSet, hierarchyType } = options;
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
  public freezeRowHeader(): boolean {
    return false;
  }

  /**
   * Check if the value is in the columns
   */
  public isValueInCols(): boolean {
    return false;
  }

  protected initPanelGroupChildren(): void {
    super.initPanelGroupChildren();
    this.frozenRowGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_PANEL_FROZEN_ROW,
      zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
    });
    this.frozenColGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_PANEL_FROZEN_COL,
      zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
    });
    this.frozenTrailingRowGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_PANEL_FROZEN_TRAILING_ROW,
      zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
    });
    this.frozenTrailingColGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_PANEL_FROZEN_TRAILING_COL,
      zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
    });
    this.frozenTopGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_PANEL_FROZEN_TOP,
      zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
    });
    this.frozenBottomGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_PANEL_FROZEN_BOTTOM,
      zIndex: PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
    });
  }

  protected getFacetCfgFromDataSetAndOptions(): SpreadSheetFacetCfg {
    const { fields, meta } = this.dataSet;
    const { style, dataCell } = this.options;
    // 默认单元格实现
    const defaultCell = (facet: ViewMeta) => {
      if (this.options.showSeriesNumber && facet.colIndex === 0) {
        return new TableRowCell(facet, this);
      }
      return new TableDataCell(facet, this);
    };
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
    this.facet = new TableFacet(facetCfg);
    this.facet.render();
  }
}

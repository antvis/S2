import { SpreadSheet } from './spread-sheet';
import { TableDataCell, TableRowCell } from '@/cell';
import {
  KEY_GROUP_PANEL_FROZEN_BOTTOM,
  KEY_GROUP_PANEL_FROZEN_COL,
  KEY_GROUP_PANEL_FROZEN_ROW,
  KEY_GROUP_PANEL_FROZEN_TOP,
  KEY_GROUP_PANEL_FROZEN_TRAILING_COL,
  KEY_GROUP_PANEL_FROZEN_TRAILING_ROW,
  PANEL_GROUP_FROZEN_GROUP_Z_INDEX,
} from '@/common/constant';
import { S2Options, SpreadSheetFacetCfg, ViewMeta } from '@/common/interface';
import { TableDataSet } from '@/data-set';
import { TableFacet } from '@/facet';
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
  public freezeRowHeader(): boolean {
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

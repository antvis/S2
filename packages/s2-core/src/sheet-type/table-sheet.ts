import { TableDataCell, TableSeriesNumberCell } from '../cell';
import { S2Event } from '../common/constant';
import type { SortMethod, SortParam, ViewMeta } from '../common/interface';
import { BaseDataSet, TableDataSet } from '../data-set';
import { TableFacet } from '../facet';
import type { Node } from '../facet/layout/node';
import { SpreadSheet } from './spread-sheet';

export class TableSheet extends SpreadSheet {
  public isCustomRowFields() {
    return false;
  }

  public getDataSet(): BaseDataSet {
    const { dataSet } = this.options;

    if (dataSet) {
      return dataSet(this);
    }

    return new TableDataSet(this);
  }

  public enableFrozenHeaders(): boolean {
    const {
      rowCount: frozenRowCount = 0,
      trailingRowCount: frozenTrailingRowCount = 0,
      colCount: frozenColCount = 0,
      trailingColCount: frozenTrailingColCount = 0,
    } = this.options.frozen!;

    return (
      frozenRowCount > 0 ||
      frozenTrailingRowCount > 0 ||
      frozenColCount > 0 ||
      frozenTrailingColCount > 0
    );
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

  protected buildFacet() {
    const defaultCell = (viewMeta: ViewMeta) => {
      if (this.options.seriesNumber?.enable && viewMeta.colIndex === 0) {
        return new TableSeriesNumberCell(viewMeta, this);
      }

      return new TableDataCell(viewMeta, this);
    };

    this.options.dataCell ??= defaultCell;
    this.facet?.destroy();
    this.facet = this.options.facet?.(this) ?? new TableFacet(this);
    this.facet.render();
  }

  public destroy() {
    super.destroy();
    this.off(S2Event.RANGE_SORT);
    this.off(S2Event.RANGE_FILTER);
  }

  public groupSortByMethod = (sortMethod: SortMethod, meta: Node) => {
    const { field } = meta;

    const sortParam: SortParam = {
      sortFieldId: field,
      sortMethod,
    };

    this.updateSortMethodMap(meta.id, sortMethod);
    this.emit(S2Event.RANGE_SORT, [sortParam]);
  };
}

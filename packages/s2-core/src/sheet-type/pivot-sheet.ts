import { SpreadSheet } from './spread-sheet';
import { DataCell } from '@/cell';
import { S2Event } from '@/common/constant';
import { S2Options, SpreadSheetFacetCfg, ViewMeta } from '@/common/interface';
import { RowCellCollapseTreeRowsType } from '@/common/interface/emitter';
import { PivotDataSet } from '@/data-set';
import { CustomTreePivotDataSet } from '@/data-set/custom-tree-pivot-data-set';
import { PivotFacet } from '@/facet';

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
    return !this.isFrozenRowHeader();
  }

  /**
   * Scroll Freeze Row Header
   */
  public isFrozenRowHeader(): boolean {
    return this.options?.frozenRowHeader;
  }

  /**
   * Check if the value is in the columns
   */
  public isValueInCols(): boolean {
    return this.dataSet.fields.valueInCols;
  }

  public clearDrillDownData(rowNodeId?: string, preventRender?: boolean) {
    if (this.dataSet instanceof PivotDataSet) {
      this.dataSet.clearDrillDownData(rowNodeId);
      if (!preventRender) {
        // 重置当前交互
        this.interaction.reset();
        this.render(false);
      }
    }
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

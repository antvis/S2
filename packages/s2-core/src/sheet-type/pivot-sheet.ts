import { last } from 'lodash';
import { SpreadSheet } from './spread-sheet';
import { DataCell } from '@/cell';
import {
  InterceptType,
  S2Event,
  TOOLTIP_OPERATOR_MENUS,
} from '@/common/constant';
import {
  S2Options,
  SortParam,
  SpreadSheetFacetCfg,
  TooltipOperatorOptions,
  ViewMeta,
} from '@/common/interface';
import { Node } from '@/facet/layout/node';
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
    return !this.isFreezeRowHeader();
  }

  /**
   * Scroll Freeze Row Header
   */
  public isFreezeRowHeader(): boolean {
    return this.options?.freezeRowHeader;
  }

  /**
   * Check if the value is in the columns
   */
  public isValueInCols(): boolean {
    return this.dataSet.fields.valueInCols;
  }

  public clearDrillDownData(rowNodeId?: string) {
    if (this.dataSet instanceof PivotDataSet) {
      this.dataSet.clearDrillDownData(rowNodeId);
      this.render(false);
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

  public handleGroupSort(event: MouseEvent, meta: Node) {
    event.stopPropagation();
    this.interaction.addIntercepts([InterceptType.HOVER]);
    const operator: TooltipOperatorOptions = {
      onClick: ({ key }) => {
        const { rows, columns } = this.dataCfg.fields;
        const sortFieldId = this.isValueInCols() ? last(rows) : last(columns);
        const { query, value } = meta;
        const sortParam: SortParam = {
          sortFieldId,
          sortMethod: key as SortParam['sortMethod'],
          sortByMeasure: value,
          query,
        };
        const prevSortParams = this.dataCfg.sortParams.filter(
          (item) => item?.sortFieldId !== sortFieldId,
        );
        this.setDataCfg({
          ...this.dataCfg,
          sortParams: [...prevSortParams, sortParam],
        });
        this.render();
      },
      menus: TOOLTIP_OPERATOR_MENUS.Sort,
    };

    this.showTooltipWithInfo(event, [], {
      operator,
      onlyMenu: true,
    });
  }
}

import { Event as CanvasEvent } from '@antv/g-canvas';
import { clone, last } from 'lodash';
import { SpreadSheet } from './spread-sheet';
import { Node } from '@/facet/layout/node';
import { DataCell } from '@/cell';
import {
  EXTRA_FIELD,
  InterceptType,
  S2Event,
  TOOLTIP_OPERATOR_SORT_MENUS,
} from '@/common/constant';
import {
  S2Options,
  SortMethod,
  SortParam,
  SpreadSheetFacetCfg,
  TooltipOperatorOptions,
  ViewMeta,
} from '@/common/interface';
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
    this.emit(S2Event.LAYOUT_COLLAPSE_ROWS, {
      collapsedRows: options.style.collapsedRows,
      meta: data?.node,
    });

    this.setOptions(options);
    this.render(false);
    this.emit(S2Event.LAYOUT_AFTER_COLLAPSE_ROWS, {
      collapsedRows: options.style.collapsedRows,
      meta: data?.node,
    });
  }

  protected handleTreeRowsCollapseAll(isCollapsed: boolean) {
    const options: Partial<S2Options> = {
      hierarchyCollapse: !isCollapsed,
      style: {
        collapsedRows: null,
      },
    };
    this.setOptions(options);
    this.render(false);
  }

  public groupSortByMethod(sortMethod: SortMethod, meta: Node) {
    const { rows, columns } = this.dataCfg.fields;
    const ifHideMeasureColumn = this.options.style.colCfg.hideMeasureColumn;
    const sortFieldId = this.isValueInCols() ? last(rows) : last(columns);
    const { query, value } = meta;
    const sortQuery = clone(query);
    let sortValue = value;
    // 数值置于列头且隐藏了指标列头的情况, 会默认取第一个指标做组内排序, 需要还原指标列的query, 所以多指标时请不要这么用……
    if (ifHideMeasureColumn && this.isValueInCols()) {
      sortValue = this.dataSet.fields.values[0];
      sortQuery[EXTRA_FIELD] = sortValue;
    }

    const sortParam: SortParam = {
      sortFieldId,
      sortMethod,
      sortByMeasure: sortValue,
      query: sortQuery,
    };
    const prevSortParams = this.dataCfg.sortParams.filter(
      (item) => item?.sortFieldId !== sortFieldId,
    );
    // 触发排序事件
    this.emit(S2Event.RANGE_SORT, [...prevSortParams, sortParam]);
    this.setDataCfg({
      ...this.dataCfg,
      sortParams: [...prevSortParams, sortParam],
    });
    this.render();
  }

  public handleGroupSort(event: CanvasEvent, meta: Node) {
    event.stopPropagation();
    this.interaction.addIntercepts([InterceptType.HOVER]);
    const operator: TooltipOperatorOptions = {
      onClick: ({ key }) => {
        this.groupSortByMethod(key as unknown as SortMethod, meta);
        // 排序事件完成触发
        this.emit(S2Event.RANGE_SORTED, event);
      },
      menus: TOOLTIP_OPERATOR_SORT_MENUS,
    };

    this.showTooltipWithInfo(event, [], {
      operator,
      onlyMenu: true,
    });
  }
}

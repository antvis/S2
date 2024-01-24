import { clone, isString, last } from 'lodash';
import { DataCell } from '../cell';
import { EXTRA_FIELD, S2Event } from '../common/constant';
import type {
  RowCellCollapsedParams,
  RowCellStyle,
  SortMethod,
  SortParam,
  ViewMeta,
} from '../common/interface';
import { BaseDataSet, PivotDataSet } from '../data-set';
import { CustomGridPivotDataSet } from '../data-set/custom-grid-pivot-data-set';
import { PivotFacet } from '../facet';
import type { Node } from '../facet/layout/node';
import { SpreadSheet } from './spread-sheet';

export class PivotSheet extends SpreadSheet {
  public isCustomRowFields(): boolean {
    return this.isCustomHeaderFields('rows');
  }

  public getDataSet(): BaseDataSet {
    const { dataSet } = this.options;

    if (dataSet) {
      return dataSet(this);
    }

    if (this.isCustomRowFields()) {
      return new CustomGridPivotDataSet(this);
    }

    return new PivotDataSet(this);
  }

  public enableFrozenHeaders(): boolean {
    return false;
  }

  public getContentHeight() {
    return this.facet.getContentHeight();
  }

  /**
   * Check if is pivot mode
   */
  public isPivotMode(): boolean {
    return true;
  }

  public isTableMode(): boolean {
    return false;
  }

  public isHierarchyTreeType(): boolean {
    return this.options.hierarchyType === 'tree';
  }

  /**
   * Scroll Freeze Row Header
   */
  public isFrozenRowHeader(): boolean {
    return !!this.options?.frozen?.rowHeader!;
  }

  /**
   * Check if the value is in the columns
   */
  public isValueInCols(): boolean {
    return this.dataSet.fields.valueInCols!;
  }

  public clearDrillDownData(rowNodeId?: string, preventRender?: boolean) {
    if (this.dataSet instanceof PivotDataSet) {
      const cleaned = this.dataSet.clearDrillDownData(rowNodeId);

      if (cleaned && !preventRender) {
        // 重置当前交互
        this.interaction.reset();
        this.render(false);
      }
    }
  }

  protected buildFacet() {
    const defaultCell = (viewMeta: ViewMeta) => new DataCell(viewMeta, this);

    this.options.dataCell ??= defaultCell;
    this.facet?.destroy();
    this.facet = this.options.facet?.(this) ?? new PivotFacet(this);
    this.facet.render();
  }

  protected bindEvents() {
    this.off(S2Event.ROW_CELL_COLLAPSED__PRIVATE);
    this.off(S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE);
    this.on(S2Event.ROW_CELL_COLLAPSED__PRIVATE, this.handleRowCellCollapsed);
    this.on(
      S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE,
      this.handleRowCellToggleCollapseAll,
    );
  }

  protected handleRowCellCollapsed(data: RowCellCollapsedParams) {
    const { isCollapsed, node } = data;
    const { collapseFields: defaultCollapsedFields } =
      this.options.style?.rowCell!;

    const collapseFields: RowCellStyle['collapseFields'] = {
      ...defaultCollapsedFields,
      [node.id]: isCollapsed,
    };

    this.setOptions({
      style: {
        rowCell: {
          collapseAll: false,
          collapseFields,
        },
      },
    });
    this.render(false);
    this.emit(S2Event.ROW_CELL_COLLAPSED, {
      isCollapsed,
      collapseFields,
      node,
    });
  }

  protected handleRowCellToggleCollapseAll(isCollapsed: boolean) {
    const collapseAll = !isCollapsed;

    this.setOptions({
      style: {
        rowCell: {
          collapseAll,
          collapseFields: null,
          expandDepth: null,
        },
      },
    });
    this.render(false);
    this.emit(S2Event.ROW_CELL_ALL_COLLAPSED, collapseAll);
  }

  public groupSortByMethod(sortMethod: SortMethod, meta: Node) {
    const { rows, columns } = this.dataCfg.fields;
    const { hideValue } = this.options.style!.colCell!;
    const sortField = this.isValueInCols() ? last(rows) : last(columns);
    const { query, value } = meta;
    const sortQuery = clone(query);

    let sortValue = value;

    // 数值置于列头且隐藏了指标列头的情况, 会默认取第一个指标做组内排序, 需要还原指标列的 query, 所以多指标时请不要这么用……
    if (hideValue && this.isValueInCols()) {
      sortValue = this.dataSet.fields.values![0];
      sortQuery![EXTRA_FIELD] = sortValue;
    }

    const sortFieldId = isString(sortField) ? sortField : sortField!.field;
    const sortParam: SortParam = {
      sortFieldId,
      sortMethod,
      sortByMeasure: sortValue,
      query: sortQuery,
    };
    const prevSortParams = this.dataCfg.sortParams?.filter(
      (item) => item?.sortFieldId !== sortField,
    )!;

    this.updateSortMethodMap(meta.id, sortMethod, true);

    const sortParams: SortParam[] = [...prevSortParams, sortParam];

    this.emit(S2Event.RANGE_SORT, sortParams);
    this.setDataCfg({
      ...this.dataCfg,
      sortParams,
    });
    this.render();
  }
}

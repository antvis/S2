import type { Event as CanvasEvent } from '@antv/g-canvas';
import { clone, isString, last, some } from 'lodash';
import { DataCell } from '../cell';
import {
  EXTRA_FIELD,
  InterceptType,
  S2Event,
  getTooltipOperatorSortMenus,
} from '../common/constant';
import type {
  Fields,
  RowCellCollapseTreeRowsType,
  S2Options,
  SortMethod,
  SortParam,
  SpreadSheetFacetCfg,
  TooltipOperatorOptions,
  ViewMeta,
} from '../common/interface';
import { PivotDataSet } from '../data-set';
import { CustomGridPivotDataSet } from '../data-set/custom-grid-pivot-data-set';
import { PivotFacet } from '../facet';
import type { Node } from '../facet/layout/node';
import { SpreadSheet } from './spread-sheet';

export class PivotSheet extends SpreadSheet {
  public isCustomHeaderFields(
    fieldType?: keyof Pick<Fields, 'columns' | 'rows'>,
  ): boolean {
    const { fields } = this.dataCfg;

    if (!fieldType) {
      return some(
        [...fields?.rows, ...fields?.columns],
        (field) => !isString(field),
      );
    }

    return some(fields?.[fieldType], (field) => !isString(field));
  }

  public isCustomRowFields(): boolean {
    return this.isCustomHeaderFields('rows');
  }

  public isCustomColumnFields(): boolean {
    return this.isCustomHeaderFields('columns');
  }

  public getDataSet() {
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
      style: {
        hierarchyCollapse: !isCollapsed,
        collapsedRows: null,
        rowExpandDepth: null,
      },
    };
    this.setOptions(options);
    this.render(false);
  }

  public groupSortByMethod(sortMethod: SortMethod, meta: Node) {
    const { rows, columns } = this.dataCfg.fields;
    const { hideMeasureColumn } = this.options.style.colCfg;
    const sortField = this.isValueInCols() ? last(rows) : last(columns);
    const { query, value } = meta;
    const sortQuery = clone(query);

    let sortValue = value;
    // 数值置于列头且隐藏了指标列头的情况, 会默认取第一个指标做组内排序, 需要还原指标列的query, 所以多指标时请不要这么用……
    if (hideMeasureColumn && this.isValueInCols()) {
      sortValue = this.dataSet.fields.values[0];
      sortQuery[EXTRA_FIELD] = sortValue;
    }

    const sortFieldId = isString(sortField) ? sortField : sortField.key;
    const sortParam: SortParam = {
      sortFieldId,
      sortMethod,
      sortByMeasure: sortValue,
      query: sortQuery,
    };
    const prevSortParams = this.dataCfg.sortParams.filter(
      (item) => item?.sortFieldId !== sortField,
    );

    this.updateSortMethodMap(meta.id, sortMethod, true);

    const sortParams: SortParam[] = [...prevSortParams, sortParam];
    // 触发排序事件
    this.emit(S2Event.RANGE_SORT, sortParams);
    this.setDataCfg({
      ...this.dataCfg,
      sortParams,
    });
    this.render();
  }

  public handleGroupSort(event: CanvasEvent, meta: Node) {
    event.stopPropagation();
    this.interaction.addIntercepts([InterceptType.HOVER]);

    const defaultSelectedKeys = this.getMenuDefaultSelectedKeys(meta?.id);

    const operator: TooltipOperatorOptions = {
      onClick: ({ key }) => {
        const sortMethod = key as unknown as SortMethod;
        this.groupSortByMethod(sortMethod, meta);
        this.emit(S2Event.RANGE_SORTED, event);
      },
      menus: getTooltipOperatorSortMenus(),
      defaultSelectedKeys,
    };

    this.showTooltipWithInfo(event, [], {
      operator,
      onlyMenu: true,
      // 确保 tooltip 内容更新 https://github.com/antvis/S2/issues/1716
      forceRender: true,
    });
  }
}

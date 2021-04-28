import EE from '@antv/event-emitter';
import { Canvas, IGroup } from '@antv/g-canvas';
import {
  isString,
  get,
  merge,
  clone,
  find,
  isFunction,
  includes,
  debounce,
} from 'lodash';
import { Store } from '../common/store';
import { ext } from '@antv/matrix-util';
import {
  ColWidthCache,
  DerivedValue,
  safetyDataConfig,
  OffsetConfig,
  Pagination,
  S2DataConfig,
  S2Options,
  SpreadsheetFacetCfg,
  ViewMeta,
  safetyOptions,
} from '../common/interface';
import { Cell } from '../cell';
import {
  KEY_COL_REAL_WIDTH_INFO,
  KEY_GROUP_BACK_GROUND,
  KEY_GROUP_FORE_GROUND,
  KEY_GROUP_HOVER_BOX,
  KEY_GROUP_PANEL_GROUND,
  PANEL_GROUP_HOVER_BOX_GROUP_ZINDEX,
} from '../common/constant';
import { BaseDataSet } from '../data-set';
import { SpreadsheetFacet } from '../facet';
import { Node, BaseInteraction, SpreadSheetTheme } from '../index';
import { getTheme, registerTheme } from '../theme';
import { BaseTooltip } from '../tooltip';
import { BaseFacet } from '../facet/base-facet';
import { BaseParams } from '../data-set/base-data-set';
import { DataDerivedCell } from '../cell';
import { DebuggerUtil } from '../common/debug';
import { isMobile } from '../utils/is-mobile';

const matrixTransform = ext.transform;
export default abstract class BaseSpreadSheet extends EE {
  public static DEBUG_ON = false;

  // dom id
  public dom: HTMLElement;

  // theme config
  public theme: SpreadSheetTheme = getTheme('default');

  public interactions: Map<string, BaseInteraction> = new Map();

  // store some temporary data
  public store: Store = new Store();

  // the original data config
  public dataCfg: S2DataConfig;

  // Spreadsheet's configurations
  public options: S2Options;

  /**
   * processed data structure, include {@link Fields}, {@link Meta}
   * {@link Data}, {@link SortParams}, {@link Pivot}
   */
  public dataSet: BaseDataSet<BaseParams>;

  /**
   * Facet: determine how to render headers/cell
   * There are two facet default
   * {@link DetailFacet} and {@link SpreadsheetFacet}
   */
  public facet: BaseFacet;

  // tooltips to show float dialog({@see HoverInteraction})
  public tooltip: BaseTooltip;

  // the base container, contains all groups
  public container: Canvas;

  // the background group, render bgColor...
  public backgroundGroup: IGroup;

  // facet cell area group, it contains all cross-tab's cell
  public panelGroup: IGroup;

  // contains rowHeader,cornerHeader,colHeader, scroll bars
  public foregroundGroup: IGroup;

  // use to display cell's hover interactions
  public hoverBoxGroup: IGroup;

  public devicePixelRatioMedia: MediaQueryList;

  public viewport = window as typeof window & { visualViewport: Element };

  protected constructor(
    dom: string | HTMLElement,
    dataCfg: S2DataConfig,
    options: S2Options,
  ) {
    super();
    this.dom = isString(dom) ? document.getElementById(dom) : dom;
    this.dataCfg = safetyDataConfig(dataCfg);
    this.options = safetyOptions(options);
    this.initGroups(this.dom, this.options);
    this.bindEvents();
    this.dataSet = this.initDataSet(this.options);
    this.tooltip =
      (options?.initTooltip && options?.initTooltip(this)) ||
      this.initTooltip();
    this.registerInteractions(this.options);
    this.initDevicePixelRatioListener();
    this.initDeviceZoomListener();
  }

  /**
   * Update data config and keep pre-sort operations
   * Group sort params kept in {@see store} and
   * Priority: group sort > advanced sort
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig): void {
    const newDataCfg = clone(dataCfg);
    const lastSortParam = this.store.get('sortParam');
    const { sortParams } = newDataCfg;
    newDataCfg.sortParams = [].concat(lastSortParam || [], sortParams || []);
    this.dataCfg = newDataCfg;
  }

  public setOptions(options: S2Options): void {
    if (this.tooltip) {
      this.tooltip.hide();
    }
    console.info(options);
  }

  /**
   * Create all related groups, contains:
   * 1. container -- base canvas group
   * 2. backgroundGroup
   * 3. panelGroup -- main facet group belongs to
   * 4. foregroundGroup
   * 5. hoverBoxGroup (on panelGroup)
   * @param dom
   * @param options
   * @private
   */
  protected initGroups(dom: HTMLElement, options: S2Options): void {
    const { width, height } = options;

    // base canvas group
    this.container = new Canvas({
      container: dom,
      width,
      height,
      localRefresh: false,
      // autoDraw: false,
    });

    // the main three layer groups
    this.backgroundGroup = this.container.addGroup({
      name: KEY_GROUP_BACK_GROUND,
      zIndex: 0,
    });
    this.panelGroup = this.container.addGroup({
      name: KEY_GROUP_PANEL_GROUND,
      zIndex: 1,
    });
    this.foregroundGroup = this.container.addGroup({
      name: KEY_GROUP_FORE_GROUND,
      zIndex: 2,
    });

    // hover box on panel group
    this.hoverBoxGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_HOVER_BOX,
      zIndex: PANEL_GROUP_HOVER_BOX_GROUP_ZINDEX,
    });
  }

  protected abstract initTooltip(): BaseTooltip;

  protected abstract bindEvents(): void;

  protected initFacet(facetCfg: SpreadsheetFacetCfg): BaseFacet {
    return new SpreadsheetFacet(facetCfg);
  }

  /**
   * 注册交互（组件按自己的场景写交互，继承此方法注册）
   * @param options
   */
  protected abstract registerInteractions(options: S2Options): void;

  protected getCorrectCell(facet: ViewMeta): Cell {
    return this.isValueInCols()
      ? new Cell(facet, this)
      : new DataDerivedCell(facet, this);
  }

  protected abstract initDataSet(
    options: Partial<S2Options>,
  ): BaseDataSet<BaseParams>;

  protected buildFacet(): void {
    const { fields, meta } = this.dataSet;

    const { rows, columns, values, derivedValues } = fields;

    const {
      debug,
      width,
      height,
      style,
      totals,
      hierarchyType,
      hierarchyCollapse,
      pagination,
      hideNodesIds,
      keepOnlyNodesIds,
      dataCell,
      cornerCell,
      rowCell,
      colCell,
      frame,
      layout,
      cornerHeader,
      layoutResult,
      hierarchy,
      layoutArrange,
    } = this.options;

    const {
      cellCfg,
      colCfg,
      rowCfg,
      collapsedRows,
      collapsedCols,
      treeRowsWidth,
    } = style;
    this.dataSet.pivot.updateTotals(totals);

    const defaultCell = (facet: ViewMeta) => this.getCorrectCell(facet);
    DebuggerUtil.getInstance().setDebug(debug);
    // the new facetCfg of facet
    const facetCfg = {
      spreadsheet: this,
      dataSet: this.dataSet,
      hierarchyType,
      collapsedRows,
      collapsedCols,
      hierarchyCollapse,
      meta: meta,
      cols: columns,
      rows,
      cellCfg,
      colCfg,
      width,
      height,
      rowCfg,
      treeRowsWidth,
      pagination,
      values,
      derivedValues,
      dataCell: dataCell || defaultCell,
      cornerCell,
      rowCell,
      colCell,
      frame,
      layout,
      cornerHeader,
      layoutResult,
      hierarchy,
      layoutArrange,
    } as SpreadsheetFacetCfg;

    if (this.facet) {
      // destroy pre-facet if exists
      this.facet.destroy();
    }
    this.facet = this.initFacet(facetCfg);
    // render facet
    this.facet.render();
  }

  public render(reloadData = true, callback?: () => void): void {
    // 有些属性变化是不需要重新训练数据的，比如树结构的收缩
    if (reloadData) {
      this.dataSet.setDataCfg(this.dataCfg);
      // 有数据变化，情况列宽度计算的缓存
      this.store.set(KEY_COL_REAL_WIDTH_INFO, {
        widthInfos: {},
        realWidth: {},
      } as ColWidthCache);
    }

    this.buildFacet();
    if (isFunction(callback)) {
      callback();
    }
  }

  public destroy(): void {
    this.facet.destroy();
    this.tooltip.destroy();
    this.removeDevicePixelRatioListener();
    this.removeDeviceZoomListener();
  }

  /**
   * Preset totalCache by users.
   * @param cache
   */
  public setTotalCache(cache: Map<string, number>): void {
    this.dataSet.pivot.updateTotalCacheGift(cache);
  }

  /**
   * Update theme config, if the {@param type} is exists, re-use it,
   * otherwise create new one {@see theme}
   * @param type string
   * @param theme
   */
  public setTheme(theme: SpreadSheetTheme, type = 'default'): void {
    if (!getTheme(type)) {
      if (theme) {
        this.theme = registerTheme(type, theme);
      } else {
        throw new Error(`Theme type '${type}' not founded.`);
      }
    } else {
      this.theme = merge({}, getTheme(type), theme);
    }
  }

  /**
   * Update pagination config which store in {@see options}
   * @param pagination
   */
  public updatePagination(pagination: Pagination) {
    this.options = merge({}, this.options, {
      pagination,
    });

    // 清空滚动进度
    this.store.set('scrollX', 0);
    this.store.set('scrollY', 0);
  }

  /**
   * 获取当前表格实际内容高度
   */
  public getContentHeight(): number {
    return this.facet.getContentHeight();
  }

  /**
   * 修改交叉表画布大小，不用重新加载数据
   * @param width
   * @param height
   */
  public changeSize(width: number, height: number) {
    this.options = merge({}, this.options, { width, height });
    // resize the canvas
    this.container.changeSize(width, height);
  }

  /**
   * tree type must be in strategy mode
   */
  public isHierarchyTreeType(): boolean {
    return get(this, 'options.hierarchyType', 'grid') === 'tree';
  }

  /**
   * 判断某个维度是否是衍生指标
   * @param field
   */
  public isDerivedValue(field: string): boolean {
    const derivedValues = get(this, 'dataCfg.fields.derivedValues', []);
    return find(derivedValues, (v) => includes(v.derivedValueField, field));
  }

  /**
   * 获取任意度量对应的指标对象（包含主指标和衍生指标）
   * 分别检查每个 主指标和衍生指标
   * @param field
   */
  public getDerivedValue(field: string): DerivedValue {
    const derivedValues = get(this, 'dataCfg.fields.derivedValues', []);
    return (
      find(
        derivedValues,
        (v) => field === v.valueField || includes(v.derivedValueField, field),
      ) || {
        valueField: '',
        derivedValueField: [],
        displayDerivedValueField: [],
      }
    );
  }

  public isColAdaptive(): boolean {
    return (
      get(this, 'options.style.colCfg.colWidthType', 'adaptive') === 'adaptive'
    );
  }

  /**
   * Check if is pivot mode
   */
  public isPivotMode(): boolean {
    return this.options?.mode === 'pivot';
  }

  /**
   * Check whether scroll contains row header
   * For now contains row header in ListSheet mode by default
   */
  public isScrollContainsRowHeader(): boolean {
    return !this.freezeRowHeader() || !this.isPivotMode();
  }

  /**
   * Scroll Freeze Row Header
   */
  public freezeRowHeader(): boolean {
    return this.options?.freezeRowHeader;
  }

  /**
   * Get all panel group cells
   * @param callback to handle each cell if needed
   */
  public getPanelAllCells(callback?: (cell: Cell) => void): Cell[] {
    const children = this.panelGroup.get('children');
    const cells: Cell[] = [];
    children.forEach((child) => {
      if (child instanceof Cell) {
        cells.push(child);
        if (callback) {
          callback(child);
        }
      }
    });
    return cells;
  }

  public getRowNodes(level = -1): Node[] {
    if (level === -1) {
      return this.facet.layoutResult.rowNodes;
    }
    return this.facet.layoutResult.rowNodes.filter(
      (value) => value.level === level,
    );
  }

  public getRealColumnSize(): number {
    return get(this, 'dataCfg.fields.columns', []).length + 1;
  }

  /**
   * get columnNode in levels,
   * @param level -1 = get all
   */
  public getColumnNodes(level = -1): Node[] {
    if (level === -1) {
      return this.facet?.layoutResult.colNodes;
    }
    return this.facet?.layoutResult.colNodes.filter(
      (value) => value.level === level,
    );
  }

  /**
   * Update scroll's offset, the value can be undefined,
   * indicate not update current value
   * @param offsetConfig
   * default offsetX(horizontal scroll need animation)
   * but offsetY(vertical scroll dont need animation)
   */
  public updateScrollOffset(offsetConfig: OffsetConfig): void {
    this.facet.updateScrollOffset(
      merge(
        {},
        {
          offsetX: {
            value: undefined,
            animate: false,
          },
          offsetY: {
            value: undefined,
            animate: false,
          },
        },
        offsetConfig,
      ) as OffsetConfig,
    );
  }

  public isValueInCols(): boolean {
    return this.options.valueInCols;
  }

  private initDevicePixelRatioListener() {
    this.devicePixelRatioMedia = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    if (this.devicePixelRatioMedia?.addEventListener) {
      this.devicePixelRatioMedia.addEventListener(
        'change',
        this.renderByDevicePixelRatioChanged,
      );
    } else {
      this.devicePixelRatioMedia.addListener(
        this.renderByDevicePixelRatioChanged,
      );
    }
  }

  private removeDevicePixelRatioListener() {
    if (this.devicePixelRatioMedia?.removeEventListener) {
      this.devicePixelRatioMedia.removeEventListener(
        'change',
        this.renderByDevicePixelRatioChanged,
      );
    } else {
      this.devicePixelRatioMedia.removeListener(
        this.renderByDevicePixelRatioChanged,
      );
    }
  }

  private initDeviceZoomListener() {
    // VisualViewport support browser zoom & mac touch tablet
    this.viewport?.visualViewport?.addEventListener(
      'resize',
      this.renderByZoomScale,
    );
  }

  private removeDeviceZoomListener() {
    this.viewport?.visualViewport?.removeEventListener(
      'resize',
      this.renderByZoomScale,
    );
  }

  private renderByZoomScale = debounce((e) => {
    if (isMobile()) {
      return;
    }
    const ratio = Math.max(e.target.scale, window.devicePixelRatio);
    if (ratio > 1) {
      this.renderByDevicePixelRatio(ratio);
    }
  }, 350);

  private renderByDevicePixelRatioChanged = () => {
    this.renderByDevicePixelRatio();
  };

  private renderByDevicePixelRatio = (ratio = window.devicePixelRatio) => {
    const { width, height } = this.options;
    const newWidth = Math.floor(width * ratio);
    const newHeight = Math.floor(height * ratio);

    this.container.resetMatrix();
    this.container.set('pixelRatio', ratio);
    this.container.changeSize(newWidth, newHeight);

    matrixTransform(this.container.getMatrix(), [['scale', ratio, ratio]]);

    this.render(false);
  };
}

import { isBoolean, isFunction, isNumber, isString, throttle } from 'lodash';
import { S2Event } from '../../common/constant';
import type {
  S2DataConfig,
  S2Options,
  ScrollOffset,
  StickyHeaderOptions,
} from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import { customMerge } from '../../utils/merge';

enum StickyState {
  /** 未吸顶 (表格在视口下方或已完全滚出) */
  UN_STICKY = 'UN_STICKY',
  /** 完全吸顶 (表头固定在视口顶部) */
  STICKY = 'STICKY',
  /** 吸顶边缘 (表格底部即将离开视口, 表头跟随滚出) */
  STICKY_EDGE = 'STICKY_EDGE',
}

/**
 * Window 级别表头吸顶控制器
 *
 * 在 s2-core 层级通过双实例 + DOM 代理包装实现框架无关的表头吸顶功能
 * 当表格高度超出页面可视区域时, 表头会自动吸附在视口顶部
 */
export class StickyHeaderController {
  private spreadsheet: SpreadSheet;

  /** 吸顶表头的 S2 实例 (仅渲染表头) */
  private stickyS2: SpreadSheet | null = null;

  /** 吸顶表头的容器 DOM */
  private wrapperElement: HTMLDivElement | null = null;

  /** 吸顶表头 S2 的挂载容器 */
  private stickyContainer: HTMLDivElement | null = null;

  private stickyState: StickyState = StickyState.UN_STICKY;

  /** 解除事件监听的回调集合 */
  private disposers: Array<() => void> = [];

  /** 用户配置 */
  private options: StickyHeaderOptions;

  /** 缓存的滚动容器 */
  private scrollContainer: HTMLElement | Window = window;

  /** 布局同步防回环锁 */
  private isSyncing = false;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.options = this.resolveOptions();
    this.scrollContainer = this.resolveScrollContainer();
    this.init();
  }

  public getStickyState(): StickyState {
    return this.stickyState;
  }

  private resolveOptions(): StickyHeaderOptions {
    const cfg = this.spreadsheet.options.interaction?.stickyHeader;

    if (!cfg || isBoolean(cfg)) {
      return {};
    }

    return cfg;
  }

  // ==================== 初始化 ====================

  private init() {
    this.createDOM();
    this.createStickyS2();
    this.bindScrollListener();
    this.bindSyncListeners();
    this.bindInteractionBridge();

    // 首次渲染吸顶表头 (此时主表的 LAYOUT_AFTER_RENDER 已触发过, 需手动触发一次)
    this.renderStickyS2();
  }

  /**
   * 创建吸顶表头容器 DOM
   */
  private createDOM() {
    const mainCanvas = this.spreadsheet.getCanvasElement();

    if (!mainCanvas) {
      return;
    }

    const container = mainCanvas.parentElement!;

    // 确保容器有定位上下文
    const computedPos = window.getComputedStyle(container).position;

    if (computedPos === 'static') {
      container.style.position = 'relative';
    }

    // 创建吸顶表头的外层包装器
    this.wrapperElement = document.createElement('div');
    this.wrapperElement.className = 's2-sticky-header-wrapper';
    Object.assign(this.wrapperElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '10',
      overflow: 'hidden',
      display: 'none',
    });

    // 创建 S2 挂载容器
    this.stickyContainer = document.createElement('div');
    this.wrapperElement.appendChild(this.stickyContainer);

    container.insertBefore(this.wrapperElement, mainCanvas);
  }

  // ==================== 吸顶 S2 实例 ====================

  /**
   * 压缩 S2 数据配置, 仅保留渲染表头的必要数据
   *
   * columns 中指定了列头所使用的维值的 key, 在数据项中对应的值组合起来即为一个列头
   * 对于相同列头值的数据, 只保留一项即可
   */
  private minimizeDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const columns = dataCfg?.fields?.columns;

    if (!columns) {
      return dataCfg;
    }

    const cache: Record<string, unknown> = {};

    dataCfg.data.forEach((item) => {
      const values = columns.map((column) => {
        const key = isString(column)
          ? column
          : (column as { field: string }).field;

        return String(item[key]);
      });

      const cacheKey = values.join('\u0000');

      if (!cache[cacheKey]) {
        cache[cacheKey] = item;
      }
    });

    return { ...dataCfg, data: Object.values(cache) as S2DataConfig['data'] };
  }

  /**
   * 生成吸顶表头的 Options
   *
   * 当 enableInteraction 为 true 时, 保留 resize/tooltip/headerActionIcons 等配置
   * 仅禁用刷选/多选等不适用于表头的交互
   */
  private applyStickyOptions(options: S2Options): S2Options {
    const enableInteraction = this.options.enableInteraction;

    if (enableInteraction) {
      return customMerge(options, {
        style: { dataCell: { height: 0 } },
        interaction: {
          resize: options.interaction?.resize,
          stickyHeader: false,
          brushSelection: false,
          multiSelection: false,
          rangeSelection: false,
          selectedCellMove: false,
        },
        tooltip: {
          enable: true,
          operation: {
            hiddenColumns: false,
          },
        },
      } as Partial<S2Options>);
    }

    return customMerge(options, {
      style: { dataCell: { height: 0 } },
      interaction: {
        resize: false,
        stickyHeader: false,
      },
      tooltip: {
        enable: false,
      },
      headerActionIcons: [],
      showDefaultHeaderActionIcon: false,
    } as Partial<S2Options>);
  }

  /**
   * 基于主表当前配置, 生成吸顶表头的配置
   */
  private toStickyConfig() {
    const { dataCfg, options } = this.spreadsheet;

    return {
      dataCfg: this.minimizeDataCfg(dataCfg),
      options: this.applyStickyOptions(options),
    };
  }

  /**
   * 创建吸顶 S2 实例
   *
   * 核心: 通过 spreadsheet.constructor 创建同类型的 S2 实例 (PivotSheet / TableSheet)
   * 确保和主表使用相同的渲染逻辑
   */
  private createStickyS2() {
    if (!this.stickyContainer) {
      return;
    }

    const { dataCfg, options } = this.toStickyConfig();

    // 利用主表的构造函数创建同类型实例
    const SheetClass = this.spreadsheet.constructor as new (
      dom: HTMLElement,
      dataCfg: S2DataConfig,
      options: S2Options,
    ) => SpreadSheet;

    this.stickyS2 = new SheetClass(this.stickyContainer, dataCfg, options);
  }

  /**
   * 渲染吸顶 S2 并调整到表头大小
   */
  private async renderStickyS2() {
    if (!this.stickyS2) {
      return;
    }

    const { facet } = this.spreadsheet;

    if (!facet) {
      return;
    }

    const mainConfig = this.spreadsheet.getCanvasConfig();
    const headerHeight = facet.cornerBBox?.height ?? 0;
    const width = mainConfig.width ?? 0;

    this.stickyS2.changeSheetSize(width, headerHeight);
    await this.stickyS2.render();
  }

  // ==================== 滚动监听 & 样式计算 ====================

  private getOffsetTop(): number {
    const { offsetTop } = this.options;

    if (isFunction(offsetTop)) {
      return offsetTop();
    }

    if (isNumber(offsetTop)) {
      return offsetTop;
    }

    return 0;
  }

  /**
   * 沿 DOM 树向上查找最近的**实际正在滚动**的祖先容器
   *
   * 仅当某个祖先同时满足以下两个条件时才返回:
   * 1. CSS overflow/overflow-y/overflow-x 为 auto | scroll | overlay
   * 2. scrollHeight > clientHeight (内容确实溢出, 正在产生滚动)
   *
   * 这样可以跳过 Ant Tabs 等 overflow:auto 但内容未溢出的容器
   */
  private getScrollParent(node: HTMLElement | null): HTMLElement | Window {
    if (!node) {
      return window;
    }

    let parent = node.parentElement;

    while (
      parent &&
      parent !== document.body &&
      parent !== document.documentElement
    ) {
      const style = window.getComputedStyle(parent);
      const overflow =
        style.getPropertyValue('overflow') +
        style.getPropertyValue('overflow-y') +
        style.getPropertyValue('overflow-x');

      if (
        /(?:auto|scroll|overlay)/.test(overflow) &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return window;
  }

  private resolveScrollContainer(): HTMLElement | Window {
    if (this.options.scrollContainer) {
      return this.options.scrollContainer;
    }

    const canvas = this.spreadsheet.getCanvasElement();

    return this.getScrollParent(canvas);
  }

  private isWindowScroll(): boolean {
    return this.scrollContainer === window;
  }

  /**
   * 获取主表的位置和尺寸信息
   */
  private getTableBox() {
    const mainCanvas = this.spreadsheet.getCanvasElement();

    if (!mainCanvas) {
      return null;
    }

    const canvasBox = mainCanvas.getBoundingClientRect();
    const { facet } = this.spreadsheet;

    if (!facet) {
      return null;
    }

    const tableTop = canvasBox.top;
    const tableLeft = canvasBox.left;
    const tableWidth = canvasBox.width;
    const headerHeight = facet.cornerBBox?.height ?? 0;
    const canvasHeight = canvasBox.height;
    const containerHeight = facet.getContentHeight();
    const tableHeight = Math.min(containerHeight, canvasHeight);
    const tableBottom = tableTop + tableHeight;

    return {
      tableTop,
      tableLeft,
      tableWidth,
      tableHeight,
      tableBottom,
      headerHeight,
    };
  }

  /**
   * 核心: 计算三态样式并应用到吸顶容器
   *
   * 同时支持 window 滚动和 div 容器滚动两种场景:
   * - window: 使用 position:fixed, top 为视口偏移
   * - div:    使用 position:absolute, top 为相对 S2 容器的偏移
   */
  private syncStyle = () => {
    if (!this.wrapperElement) {
      return;
    }

    const tableBox = this.getTableBox();

    if (!tableBox) {
      return;
    }

    const {
      headerHeight,
      tableBottom,
      tableHeight,
      tableLeft,
      tableWidth,
      tableTop,
    } = tableBox;

    const offsetTop = this.getOffsetTop();

    // 对于 window 滚动, 参考线 = offsetTop (相对视口顶部)
    // 对于 div 滚动,   参考线 = 容器可见顶部 + offsetTop (相对视口)
    const refLine = this.isWindowScroll()
      ? offsetTop
      : (this.scrollContainer as HTMLElement).getBoundingClientRect().top +
        offsetTop;

    const { style } = this.wrapperElement;

    // 1. 未吸顶: 表格顶部在参考线以下, 或表格底部在参考线以上
    if (refLine < tableTop || refLine > tableTop + tableHeight) {
      this.stickyState = StickyState.UN_STICKY;
      style.display = 'none';

      return;
    }

    // 通用属性
    style.display = '';
    style.height = `${headerHeight}px`;

    // 2. 完全吸顶: 表头上边缘已滚出, 但表格底部还未进入吸顶表头区域
    if (tableTop < refLine && refLine < tableBottom - headerHeight) {
      this.stickyState = StickyState.STICKY;

      if (this.isWindowScroll()) {
        // window 滚动: fixed 定位相对视口
        style.position = 'fixed';
        style.top = `${refLine}px`;
        style.left = `${tableLeft}px`;
        style.width = `${tableWidth}px`;
        style.right = '';
      } else {
        // div 滚动: absolute 定位相对 S2 容器
        style.position = 'absolute';
        style.top = `${refLine - tableTop}px`;
        style.left = '0';
        style.right = '0';
        style.width = '';
      }

      return;
    }

    // 3. 吸顶边缘: 表格底部边缘进入表头高度范围, 表头开始跟随滚出
    if (tableBottom - headerHeight <= refLine && refLine <= tableBottom) {
      this.stickyState = StickyState.STICKY_EDGE;
      style.position = 'absolute';
      style.top = `${tableHeight - headerHeight}px`;
      style.left = '0';
      style.right = '0';
      style.width = '';
    }
  };

  private bindScrollListener() {
    const onScroll = throttle(this.syncStyle, 16);

    this.scrollContainer.addEventListener('scroll', onScroll, {
      passive: true,
    });
    this.disposers.push(() => {
      this.scrollContainer.removeEventListener('scroll', onScroll);
    });
  }

  // ==================== 主从同步 ====================

  /**
   * 横向滚动同步: 主表横滑时, 吸顶 S2 的表头跟着同步横滑
   * 布局变更同步: 当主表列宽/表格大小变化时, 重新渲染吸顶表头
   */
  private bindSyncListeners() {
    const { spreadsheet } = this;

    // 1. 横向滚动同步 (参考 StrategySheetPro syncScroll)
    const onGlobalScroll = (position: ScrollOffset) => {
      if (!this.stickyS2?.facet) {
        return;
      }

      this.stickyS2.facet.updateScrollOffset({
        offsetX: { value: position.scrollX, animate: false },
        offsetY: { value: position.scrollY, animate: false },
        rowHeaderOffsetX: {
          value: position.rowHeaderScrollX,
          animate: false,
        },
      });
    };

    spreadsheet.on(S2Event.GLOBAL_SCROLL, onGlobalScroll);
    this.disposers.push(() => {
      spreadsheet.off(S2Event.GLOBAL_SCROLL, onGlobalScroll);
    });

    // 2. 布局变更同步 (参考 StrategySheetPro syncLayout)
    const onLayoutChange = () => {
      if (!this.stickyS2 || this.isSyncing) {
        return;
      }

      this.isSyncing = true;

      try {
        const { dataCfg, options } = this.toStickyConfig();

        this.stickyS2.setDataCfg(dataCfg);
        this.stickyS2.setOptions(options);

        // 调整画布大小到表头大小
        const mainConfig = spreadsheet.getCanvasConfig();

        this.stickyS2.changeSheetSize(
          mainConfig.width,
          spreadsheet.facet.cornerBBox.height,
        );
        this.stickyS2.render(false);

        this.syncStyle();
      } finally {
        this.isSyncing = false;
      }
    };

    const layoutEvents = [S2Event.LAYOUT_AFTER_RENDER, S2Event.LAYOUT_RESIZE];

    layoutEvents.forEach((event) => {
      spreadsheet.on(event, onLayoutChange);
    });
    this.disposers.push(() => {
      layoutEvents.forEach((event) => {
        spreadsheet.off(event, onLayoutChange);
      });
    });
  }

  // ==================== 交互桥接 ====================

  /**
   * 交互桥接: 监听副表的语义事件, 转译为主表的等效操作
   *
   * - Resize: 提取 style 应用到主表, 主表 render 后 onLayoutChange 自动同步副表
   * - Sort: RANGE_SORT 是命令事件, 主表 facet 内部直接处理
   * - Collapse: ROW_CELL_COLLAPSED__PRIVATE 是命令事件, PivotSheet 内部直接处理
   */
  private bindInteractionBridge() {
    if (!this.options.enableInteraction || !this.stickyS2) {
      return;
    }

    const { stickyS2, spreadsheet } = this;

    // 1. Resize 桥接 (列宽/行高/列头高)
    //    副表 resize 交互完成后会 emit LAYOUT_RESIZE 并携带 ResizeParams
    //    提取其中的 style 应用到主表, 主表 render 后 onLayoutChange 会自动同步副表
    stickyS2.on(S2Event.LAYOUT_RESIZE, async (resizeDetail) => {
      if (resizeDetail.style) {
        spreadsheet.setOptions({ style: resizeDetail.style });
        await spreadsheet.render(false);
      }

      spreadsheet.emit(S2Event.LAYOUT_RESIZE, resizeDetail);
    });

    // 2. 排序桥接
    //    透视表排序通过 groupSortByMethod → setDataCfg({ sortParams }) 完成
    //    RANGE_SORT 在透视表中仅是通知事件, 不足以触发排序
    //    需要直接将 sortParams apply 到主表 dataCfg
    stickyS2.on(S2Event.RANGE_SORT, async (sortParams) => {
      spreadsheet.setDataCfg({
        ...spreadsheet.dataCfg,
        sortParams,
      });
      await spreadsheet.render();
      spreadsheet.emit(S2Event.RANGE_SORT, sortParams);
    });

    // 3. 树节点展开/折叠桥接 (单个节点)
    //    ROW_CELL_COLLAPSED 是通知事件, 需要转发为 __PRIVATE 命令事件
    stickyS2.on(S2Event.ROW_CELL_COLLAPSED, (params) => {
      spreadsheet.emit(S2Event.ROW_CELL_COLLAPSED__PRIVATE, params);
      this.scrollToTableTop();
    });

    // 4. 角头全量展开/折叠桥接
    //    副表 handleRowCellToggleCollapseAll 已经做了 !isCollapsed 取反
    //    emit ROW_CELL_ALL_COLLAPSED 携带的是最终状态 collapseAll
    //    不能再通过 __PRIVATE (内含取反) 转发, 否则会双重取反
    //    直接将最终状态 apply 到主表
    stickyS2.on(S2Event.ROW_CELL_ALL_COLLAPSED, async (collapseAll) => {
      spreadsheet.setOptions({
        style: {
          rowCell: {
            collapseAll,
            collapseFields: null,
            expandDepth: null,
          },
        },
      });
      await spreadsheet.render(false);
      spreadsheet.emit(S2Event.ROW_CELL_ALL_COLLAPSED, collapseAll);
      this.scrollToTableTop();
    });
  }

  /**
   * 折叠/展开后滚动到表格顶部
   * 折叠操作会大幅改变表格高度, 原位置可能导致用户迷失
   */
  private scrollToTableTop() {
    const canvas = this.spreadsheet.getCanvasElement();

    canvas?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }

  // ==================== 生命周期 ====================

  public destroy() {
    this.disposers.forEach((dispose) => dispose());
    this.disposers = [];

    if (this.stickyS2) {
      this.stickyS2.destroy();
      this.stickyS2 = null;
    }

    if (this.wrapperElement) {
      this.wrapperElement.remove();
      this.wrapperElement = null;
    }

    this.stickyContainer = null;
    this.stickyState = StickyState.UN_STICKY;
  }
}

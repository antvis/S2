import type {
  FederatedPointerEvent as CanvasEvent,
  DisplayObject,
  PointLike,
} from '@antv/g';
import {
  find,
  findLast,
  first,
  forEach,
  get,
  includes,
  isEmpty,
  isEqual,
  map,
  merge,
} from 'lodash';
import { BaseCell } from '../cell/base-cell';
import {
  CellType,
  EXTRA_COLUMN_FIELD,
  EXTRA_FIELD,
  S2Event,
} from '../common/constant';
import { InteractionStateName } from '../common/constant/interaction';
import { GuiIcon } from '../common/icons';
import type { GuiIconCfg } from '../common/icons/gui-icon';
import type {
  CellMeta,
  Condition,
  ConditionMappingResult,
  FormatResult,
  HeaderActionIconOptions,
  HeaderActionNameOptions,
  InternalFullyHeaderActionIcon,
  TextTheme,
} from '../common/interface';
import type { BaseHeaderConfig } from '../facet/header';
import type { Node } from '../facet/layout/node';
import { includeCell } from '../utils/cell/data-cell';
import {
  getActionIconConfig,
  groupIconsByPosition,
} from '../utils/cell/header-cell';
import { renderIcon } from '../utils/g-renders';
import { getSortTypeIcon } from '../utils/sort-action';

export abstract class HeaderCell<
  T extends BaseHeaderConfig = BaseHeaderConfig,
> extends BaseCell<Node> {
  protected headerConfig: T;

  protected actionIconConfig: InternalFullyHeaderActionIcon | undefined;

  protected treeIcon: GuiIcon | undefined;

  protected treeLeafNodeAlignDot: DisplayObject | undefined;

  protected actionIcons: GuiIcon[];

  protected hasDefaultHiddenIcon: boolean;

  protected conditionIconMappingResult: HeaderActionNameOptions | undefined;

  /** left icon 绘制起始坐标 */
  protected leftIconPosition: PointLike;

  /** right icon 绘制起始坐标 */
  protected rightIconPosition: PointLike;

  protected abstract isBolderText(): boolean;

  public getHeaderConfig() {
    return this.headerConfig || ({} as T);
  }

  public isShallowRender() {
    return this.headerConfig.shallowRender!;
  }

  protected shouldInit() {
    return super.shouldInit() && !this.isShallowRender();
  }

  protected handleRestOptions(...[headerConfig]: [T, unknown]) {
    this.headerConfig = { ...headerConfig };

    const { value, query } = this.meta;
    const sortParams = this.spreadsheet.dataCfg.sortParams || [];
    // 该单元格是否为需要展示排序 icon 单元格
    const isSortCell = this.isSortCell();
    const sortParam = find(
      [...sortParams].reverse(),
      (item) =>
        isSortCell &&
        item?.sortByMeasure === value &&
        isEqual(get(item, 'query'), query),
    );
    const type = getSortTypeIcon(sortParam, isSortCell);

    this.headerConfig.sortParam = {
      ...this.headerConfig.sortParam!,
      ...(sortParam || { query }),
      type,
    };
  }

  protected initCell() {
    this.resetTextAndConditionIconShapes();
    this.actionIcons = [];
    this.hasDefaultHiddenIcon = false;
    this.generateIconConfig();
  }

  protected generateIconConfig() {
    this.conditionIconMappingResult = this.getIconConditionResult();

    const { sortParam } = this.getHeaderConfig();

    // 为什么有排序参数就不展示 actionIcon 了？背景不清楚，先照旧处理
    if (this.showSortIcon()) {
      this.actionIconConfig = {
        icons: [{ name: get(sortParam, 'type', 'none'), position: 'right' }],
        belongsCell: this.cellType,
        isSortIcon: true,
      };
    } else {
      this.actionIconConfig = getActionIconConfig(
        this.spreadsheet.options.headerActionIcons,
        this.meta,
        this.cellType,
      );
    }

    this.groupedIcons = groupIconsByPosition(
      this.actionIconConfig?.icons ?? [],
      this.conditionIconMappingResult,
    );
  }

  protected getFormattedFieldValue(): FormatResult {
    const { isTotalRoot, isGrandTotals, value } = this.meta;

    const formatter = this.spreadsheet.dataSet.getFieldFormatter(
      this.meta.field,
    );

    /**
     * 如果是 table mode，列头不需要被格式化
     * 树状模式下，小计是父维度本身，需要被格式化，此时只有总计才不需要被格式化
     * 平铺模式下，总计/小计 文字单元格，不需要被格式化
     * 自定义树模式下，没有总计小计概念，isTotals 均为 false, 所以不受影响
     */
    let shouldFormat = true;

    if (this.spreadsheet.isTableMode()) {
      shouldFormat = false;
    } else if (this.spreadsheet.isHierarchyTreeType()) {
      shouldFormat = !(isGrandTotals && isTotalRoot);
    } else {
      shouldFormat = !isTotalRoot;
    }

    const formattedValue =
      shouldFormat && formatter
        ? formatter(value, undefined, this.meta)
        : value;

    return {
      formattedValue,
      value,
    };
  }

  protected showSortIcon() {
    const { options, dataCfg } = this.spreadsheet;
    const isEmptyValues = isEmpty(dataCfg.fields.values);

    if (options.showDefaultHeaderActionIcon && !isEmptyValues) {
      const { sortParam } = this.getHeaderConfig();
      const query = this.meta.query;

      // sortParam 的 query，和 type 本身可能会 undefined
      return (
        query &&
        isEqual(sortParam?.query, query) &&
        sortParam?.type &&
        sortParam?.type !== 'none'
      );
    }

    return false;
  }

  protected getActionIconStyle(
    options: Partial<HeaderActionIconOptions>,
  ): Partial<GuiIconCfg> {
    const { icon } = this.getStyle()!;
    const conditionStyle = this.getTextConditionMappingResult();
    const defaultTextFill = conditionStyle?.fill || this.getTextStyle().fill!;

    return {
      width: icon?.size,
      height: icon?.size,
      // 优先级: 单个 icon 颜色配置 > 全部 icon 颜色配置 > 主题 icon 颜色配置 > 文本默认颜色
      fill: options?.fill || icon?.fill || defaultTextFill,
      cursor: 'pointer',
    };
  }

  // 是否设置为默认隐藏 action icon，默认隐藏的交互为 hover 后可见
  protected hasDefaultHideActionIcon() {
    return this.hasDefaultHiddenIcon;
  }

  protected addActionIcon(options: HeaderActionIconOptions) {
    const { x, y, name, defaultHide, onClick, onHover, isSortIcon } = options;

    const icon = new GuiIcon({
      ...this.getActionIconStyle(options),
      name,
      x,
      y,
    });

    // 默认隐藏，hover 可见
    icon.setAttribute('visibility', defaultHide ? 'hidden' : 'visible');

    icon.addEventListener('mouseover', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER, event);
      onHover?.({
        hovering: true,
        name,
        meta: this.meta,
        event,
      });
    });

    icon.addEventListener('mouseleave', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER_OFF, event);
      onHover?.({
        hovering: false,
        name,
        meta: this.meta,
        event,
      });
    });

    icon.addEventListener('click', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);

      if (isSortIcon) {
        this.spreadsheet.handleGroupSort(event, this.meta);

        return;
      }

      onClick?.({
        name,
        meta: this.meta,
        event,
      });
    });

    this.actionIcons.push(icon);
    this.appendChild(icon);
  }

  protected drawActionAndConditionIcons() {
    if (isEmpty(this.groupedIcons.left) && isEmpty(this.groupedIcons.right)) {
      return;
    }

    if (!this.leftIconPosition || !this.rightIconPosition) {
      return;
    }

    forEach(this.groupedIcons, (icons, position) => {
      const { size, margin } = this.getStyle()!.icon!;

      const iconMargin = position === 'left' ? margin!.right! : margin!.right!;
      const iconPosition =
        position === 'left' ? this.leftIconPosition : this.rightIconPosition;

      forEach(icons, (icon, i) => {
        const x = iconPosition.x + (size! + iconMargin) * i;
        const y = iconPosition.y;

        if (icon.isConditionIcon) {
          this.conditionIconShape = renderIcon(this, {
            x,
            y,
            name: icon.name,
            width: size,
            height: size,
            fill: icon.fill,
          });
          this.addConditionIconShape(this.conditionIconShape);

          return;
        }

        const { onClick, onHover, defaultHide, isSortIcon } =
          this.actionIconConfig!;

        const defaultHideHandler = icon.defaultHide ?? defaultHide;
        const iconDefaultHide =
          typeof defaultHideHandler === 'function'
            ? defaultHideHandler(this.meta, icon.name)
            : defaultHideHandler;

        if (iconDefaultHide) {
          this.hasDefaultHiddenIcon = true;
        }

        this.addActionIcon({
          name: icon.name,
          fill: icon.fill,
          x,
          y,
          defaultHide: iconDefaultHide,
          onClick: icon.onClick ?? onClick,
          onHover: icon.onHover ?? onHover,
          isSortIcon,
        });
      });
    });
  }

  protected isSortCell() {
    // 数值置于列头, 排序 icon 绘制在列头叶子节点; 置于行头, 排序 icon 绘制在行头叶子节点
    const isValueInCols = this.meta.spreadsheet?.isValueInCols?.();
    const isMaxLevel = this.meta.level === this.meta.hierarchy?.maxLevel;

    if (isValueInCols) {
      return isMaxLevel && this.cellType === CellType.COL_CELL;
    }

    return isMaxLevel && this.cellType === CellType.ROW_CELL;
  }

  protected handleByStateName(
    cells: CellMeta[],
    stateName: InteractionStateName,
  ) {
    if (includeCell(cells, this)) {
      this.updateByState(stateName);
    }
  }

  protected handleSearchResult(cells: CellMeta[]) {
    if (!includeCell(cells, this)) {
      return;
    }

    const targetCell = find(
      cells,
      (cell: CellMeta) => cell?.['isTarget'],
    ) as CellMeta;

    if (targetCell.id === this.getMeta().id) {
      this.updateByState(InteractionStateName.HIGHLIGHT);
    } else {
      this.updateByState(InteractionStateName.SEARCH_RESULT);
    }
  }

  protected handleHover(cells: CellMeta[]) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.HOVER);
      if (this.hasDefaultHideActionIcon()) {
        // hover 只会有一个 cell
        this.toggleActionIcon(cells?.[0]?.id);
      }
    }
  }

  protected handleSelect(cells: CellMeta[], nodes: Node[] = []) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.SELECTED);
    }

    const selectedNodeIds = map(nodes, 'id');

    if (includes(selectedNodeIds, this.meta.id)) {
      this.updateByState(InteractionStateName.SELECTED);
    }
  }

  protected getTextStyle(): TextTheme {
    const textOverflowStyle = this.getCellTextWordWrapStyle();
    const { text, bolderText, measureText } = this.getStyle()!;
    let style: TextTheme | undefined;

    if (this.isMeasureField()) {
      style = measureText || text;
    } else if (this.isBolderText()) {
      style = bolderText;
    } else {
      style = text;
    }

    return this.getContainConditionMappingResultTextStyle({
      ...textOverflowStyle,
      ...style,
    });
  }

  public getBackgroundColor() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getStyle()?.cell || {};

    return merge(
      { backgroundColor, backgroundColorOpacity },
      this.getBackgroundConditionFill(),
    );
  }

  public toggleActionIcon(id: string) {
    if (this.getMeta().id === id) {
      const visibleActionIcons: GuiIcon[] = [];

      forEach(this.actionIcons, (icon) => {
        // 仅存储当前不可见的 icon
        if (icon.parsedStyle.visibility !== 'visible') {
          icon.setAttribute('visibility', 'visible');
          visibleActionIcons.push(icon);
        }
      });
      this.spreadsheet.store.set('visibleActionIcons', visibleActionIcons);
    }
  }

  protected getIconPosition(): PointLike {
    return this.leftIconPosition || this.rightIconPosition;
  }

  public update() {
    const { interaction } = this.spreadsheet;
    const stateInfo = interaction?.getState();
    const cells = interaction?.getCells([
      CellType.CORNER_CELL,
      CellType.COL_CELL,
      CellType.ROW_CELL,
      CellType.SERIES_NUMBER_CELL,
    ]);

    if (!first(cells)) {
      return;
    }

    switch (stateInfo?.stateName) {
      case InteractionStateName.SELECTED:
      case InteractionStateName.ROW_CELL_BRUSH_SELECTED:
      case InteractionStateName.COL_CELL_BRUSH_SELECTED:
        this.handleSelect(cells, stateInfo?.nodes);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(cells);
        break;
      case InteractionStateName.SEARCH_RESULT:
        this.handleSearchResult(cells);
        break;
      default:
        this.handleByStateName(cells, stateInfo?.stateName!);
        break;
    }
  }

  public updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName, this);
  }

  public hideInteractionShape() {
    super.hideInteractionShape();
  }

  public isMeasureField() {
    return [EXTRA_FIELD, EXTRA_COLUMN_FIELD].includes(this.meta.field);
  }

  public mappingValue<Result>(
    condition: Condition<Result>,
  ): ConditionMappingResult<Result> {
    const value = this.getMeta().value;

    return condition.mapping(value, this.meta, this);
  }

  public findFieldCondition<Con extends Condition>(
    conditions: Con[] = [],
  ): Con | undefined {
    return findLast(conditions, (item) =>
      item.field instanceof RegExp
        ? item.field.test(this.meta.field)
        : item.field === this.meta.field,
    );
  }

  public getTreeIcon() {
    return this.treeIcon;
  }

  public getActionIcons() {
    return this.actionIcons || [];
  }
}

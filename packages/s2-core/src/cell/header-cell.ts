import type { Event as CanvasEvent, IShape } from '@antv/g-canvas';
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
} from 'lodash';
import { BaseCell } from '../cell/base-cell';
import {
  CellTypes,
  EXTRA_COLUMN_FIELD,
  EXTRA_FIELD,
  S2Event,
} from '../common/constant';
import { InteractionStateName } from '../common/constant/interaction';
import { GuiIcon } from '../common/icons';
import type {
  CellMeta,
  Condition,
  FormatResult,
  HeaderActionIconOptions,
  MappingResult,
  SortParam,
  TextTheme,
} from '../common/interface';
import type { BaseHeaderConfig } from '../facet/header/base';
import type { Node } from '../facet/layout/node';
import { includeCell } from '../utils/cell/data-cell';
import { getActionIconConfig } from '../utils/cell/header-cell';
import { getSortTypeIcon } from '../utils/sort-action';
import { renderRect } from '../utils/g-renders';

export abstract class HeaderCell extends BaseCell<Node> {
  protected headerConfig: BaseHeaderConfig;

  protected treeIcon: GuiIcon | undefined;

  protected treeLeafNodeAlignDot: IShape | undefined;

  protected actionIcons: GuiIcon[];

  protected hasDefaultHiddenIcon: boolean;

  protected abstract isBolderText(): boolean;

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = { ...headerConfig };
    const { value, query } = this.meta;
    const sortParams = this.spreadsheet.dataCfg.sortParams;
    const isSortCell = this.isSortCell(); // 改单元格是否为需要展示排序 icon 单元格
    const sortParam: SortParam = find(
      [...sortParams].reverse(),
      (item) =>
        isSortCell &&
        item?.sortByMeasure === value &&
        isEqual(get(item, 'query'), query),
    );
    const type = getSortTypeIcon(sortParam, isSortCell);
    this.headerConfig.sortParam = {
      ...this.headerConfig.sortParam,
      ...(sortParam || { query }),
      type,
    };
  }

  protected initCell() {
    this.resetTextAndConditionIconShapes();
    this.actionIcons = [];
    this.hasDefaultHiddenIcon = false;
  }

  protected getInteractiveBorderShapeStyle(border: number) {
    const { x, y, height, width } = this.getCellArea();
    return {
      x: x + border,
      y: y + border,
      width: width - border * 2,
      height: height - border * 2,
    };
  }

  protected getFormattedFieldValue(): FormatResult {
    const { label, isTotalRoot, isGrandTotals } = this.meta;

    const formatter = this.spreadsheet.dataSet.getFieldFormatter(
      this.meta.field,
    );

    // 如果是 table mode，列头不需要被格式化
    // 树状模式下，小计是父维度本身，需要被格式化，此时只有总计才不需要被格式化
    // 平铺模式下，总计/小计 文字单元格，不需要被格式化
    // 自定义树模式下，没有总计小计概念，isTotals 均为 false, 所以不受影响
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
        ? formatter(label, undefined, this.meta)
        : label;
    return {
      formattedValue,
      value: label,
    };
  }

  /**
   * 获取操作 icons
   */
  protected getActionIconCfg() {
    return getActionIconConfig(
      this.spreadsheet.options.headerActionIcons,
      this.meta,
      this.cellType,
    );
  }

  protected showSortIcon() {
    const { options, dataCfg } = this.spreadsheet;
    const isEmptyValues = isEmpty(dataCfg.fields.values);

    if (options.showDefaultHeaderActionIcon && !isEmptyValues) {
      const { sortParam } = this.headerConfig;
      const query = this.meta.query;
      // sortParam的query，和type本身可能会 undefined
      return (
        query &&
        isEqual(sortParam?.query, query) &&
        sortParam?.type &&
        sortParam?.type !== 'none'
      );
    }

    return false;
  }

  protected getActionIconsCount() {
    if (this.showSortIcon()) {
      return 1;
    }
    const actionIconCfg = this.getActionIconCfg();
    if (actionIconCfg) {
      const iconNames = actionIconCfg.iconNames;
      return iconNames.length;
    }
    return 0;
  }

  protected getActionIconsWidth() {
    const { size, margin } = this.getStyle().icon;
    return (size + margin.left) * this.getActionIconsCount();
  }

  // 绘制排序icon
  protected drawSortIcons() {
    if (!this.showSortIcon()) {
      return;
    }

    const { icon, text } = this.getStyle();
    const fill = this.getTextConditionFill(text);
    const { sortParam } = this.headerConfig;
    const position = this.getIconPosition();
    const sortIcon = new GuiIcon({
      name: get(sortParam, 'type', 'none'),
      ...position,
      width: icon.size,
      height: icon.size,
      fill,
    });
    sortIcon.on('click', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
      this.spreadsheet.handleGroupSort(event, this.meta);
    });
    this.add(sortIcon);
    this.actionIcons.push(sortIcon);
  }

  // 是否设置为默认隐藏 action icon，默认隐藏的交互为 hover 后可见
  protected hasDefaultHideActionIcon() {
    return this.hasDefaultHiddenIcon;
  }

  protected addActionIcon(options: HeaderActionIconOptions) {
    const { x, y, iconName, defaultHide, action, onClick, onHover } = options;
    const { icon: iconTheme, text: textTheme } = this.getStyle();
    const fill = this.getTextConditionFill(textTheme);
    // 主题 icon 颜色配置优先，若无则默认为文本条件格式颜色优先
    const actionIconColor = iconTheme?.fill || fill;

    const icon = new GuiIcon({
      name: iconName,
      x,
      y,
      width: iconTheme?.size,
      height: iconTheme?.size,
      fill: actionIconColor,
    });

    // 默认隐藏，hover 可见
    icon.set('visible', !defaultHide);
    icon.on('mouseover', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER, event);
      onHover?.({
        hovering: true,
        iconName,
        meta: this.meta,
        event,
      });
    });
    icon.on('mouseleave', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER_OFF, event);
      onHover?.({
        hovering: false,
        iconName,
        meta: this.meta,
        event,
      });
    });
    icon.on('click', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
      (onClick || action)?.({
        iconName,
        meta: this.meta,
        event,
      });
    });

    this.actionIcons.push(icon);
    this.add(icon);
  }

  protected drawActionIcons() {
    if (this.showSortIcon()) {
      this.drawSortIcons();
      return;
    }

    const actionIconCfg = this.getActionIconCfg();
    if (!actionIconCfg) {
      return;
    }

    const { iconNames, action, onClick, onHover, defaultHide } = actionIconCfg;

    const position = this.getIconPosition(iconNames.length);

    const { size, margin } = this.getStyle().icon;
    forEach(iconNames, (iconName, i) => {
      const x = position.x + i * size + i * margin.left;
      const y = position.y;

      const iconDefaultHide =
        typeof defaultHide === 'function'
          ? defaultHide(this.meta, iconName)
          : defaultHide;
      if (iconDefaultHide) {
        this.hasDefaultHiddenIcon = true;
      }

      this.addActionIcon({
        iconName,
        x,
        y,
        defaultHide: iconDefaultHide,
        action,
        onClick,
        onHover,
      });
    });
  }

  protected drawBackgroundShape() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getBackgroundColor();

    this.backgroundShape = renderRect(this, {
      ...this.getCellArea(),
      fill: backgroundColor,
      fillOpacity: backgroundColorOpacity,
    });
  }

  protected isSortCell() {
    // 数值置于列头, 排序 icon 绘制在列头叶子节点; 置于行头, 排序 icon 绘制在行头叶子节点
    const isValueInCols = this.meta.spreadsheet?.isValueInCols?.();
    const isMaxLevel = this.meta.level === this.meta.hierarchy?.maxLevel;
    if (isValueInCols) {
      return isMaxLevel && this.cellType === CellTypes.COL_CELL;
    }
    return isMaxLevel && this.cellType === CellTypes.ROW_CELL;
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
      (cell: CellMeta) => cell?.isTarget,
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

  protected handleSelect(cells: CellMeta[], nodes: Node[]) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.SELECTED);
    }

    const selectedNodeIds = map(nodes, 'id');
    if (includes(selectedNodeIds, this.meta.id)) {
      this.updateByState(InteractionStateName.SELECTED);
    }
  }

  protected getTextStyle(): TextTheme {
    const { text, bolderText, measureText } = this.getStyle();
    let style: TextTheme;
    if (this.isMeasureField()) {
      style = measureText || text;
    } else if (this.isBolderText()) {
      style = bolderText;
    } else {
      style = text;
    }
    const fill = this.getTextConditionFill(style);

    return { ...style, fill };
  }

  public getBackgroundColor() {
    const { backgroundColor, backgroundColorOpacity } =
      this.getStyle()?.cell || {};
    return this.getBackgroundColorByCondition(
      backgroundColor,
      backgroundColorOpacity,
    );
  }

  protected getBackgroundColorByCondition(
    backgroundColor: string,
    backgroundColorOpacity: number,
  ) {
    let fill = backgroundColor;
    // get background condition fill color
    const bgCondition = this.findFieldCondition(this.conditions?.background);
    if (bgCondition && bgCondition.mapping) {
      const attrs = this.mappingValue(bgCondition);
      if (attrs) {
        fill = attrs.fill;
      }
    }
    return { backgroundColor: fill, backgroundColorOpacity };
  }

  public toggleActionIcon(id: string) {
    if (this.getMeta().id === id) {
      const visibleActionIcons: GuiIcon[] = [];
      forEach(this.actionIcons, (icon) => {
        // 仅存储当前不可见的 icon
        if (!icon.get('visible')) {
          icon.set('visible', true);
          visibleActionIcons.push(icon);
        }
      });
      this.spreadsheet.store.set('visibleActionIcons', visibleActionIcons);
    }
  }

  public update() {
    const { interaction } = this.spreadsheet;
    const stateInfo = interaction?.getState();
    const cells = interaction?.getCells([
      CellTypes.CORNER_CELL,
      CellTypes.COL_CELL,
      CellTypes.ROW_CELL,
    ]);

    if (!first(cells)) {
      return;
    }

    switch (stateInfo?.stateName) {
      case InteractionStateName.SELECTED:
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
        this.handleByStateName(cells, stateInfo?.stateName);
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

  public mappingValue(condition: Condition): MappingResult {
    const value = this.getMeta().label;
    return condition?.mapping(value, this.meta);
  }

  public findFieldCondition(conditions: Condition[]): Condition {
    return findLast(conditions, (item) => {
      return item.field instanceof RegExp
        ? item.field.test(this.meta.field)
        : item.field === this.meta.field;
    });
  }
}

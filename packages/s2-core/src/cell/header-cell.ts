import type {
  FederatedPointerEvent as CanvasEvent,
  DisplayObject,
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
  InternalFullyHeaderActionIcon,
  MappingResult,
  TextTheme,
} from '../common/interface';
import type { BaseHeaderConfig } from '../facet/header';
import type { Node } from '../facet/layout/node';
import { includeCell } from '../utils/cell/data-cell';
import {
  getActionIconConfig,
  getActionIconTotalWidth,
} from '../utils/cell/header-cell';
import { getSortTypeIcon } from '../utils/sort-action';

export abstract class HeaderCell extends BaseCell<Node> {
  protected headerConfig: BaseHeaderConfig;

  protected actionIconConfig: InternalFullyHeaderActionIcon | undefined;

  protected treeIcon: GuiIcon | undefined;

  protected treeLeafNodeAlignDot: DisplayObject | undefined;

  protected actionIcons: GuiIcon[];

  protected hasDefaultHiddenIcon: boolean;

  protected abstract isBolderText(): boolean;

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
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

    this.generateIconConfig();
  }

  protected initCell() {
    this.resetTextAndConditionIconShapes();
    this.actionIcons = [];
    this.hasDefaultHiddenIcon = false;
  }

  protected generateIconConfig() {
    const { sortParam } = this.headerConfig;
    // 为什么有排序参数就不展示 actionIcon 了？背景不清楚，先照旧处理

    if (this.showSortIcon()) {
      this.actionIconConfig = {
        iconNames: [
          { name: get(sortParam, 'type', 'none'), position: 'right' },
        ],
        belongsCell: this.cellType,
        isSortIcon: true,
      };

      return;
    }

    this.actionIconConfig = getActionIconConfig(
      this.spreadsheet.options.headerActionIcons,
      this.meta,
      this.cellType,
    );
  }

  protected getFormattedFieldValue(): FormatResult {
    const { value, field } = this.meta;

    const formatter = this.spreadsheet.dataSet.getFieldFormatter(field);
    // TODO: formatter 简化成两个参数 formatter(value, this,meta)
    const formattedValue = formatter!
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
    return this.actionIconConfig?.iconNames?.length ?? 0;
  }

  protected getActionIconsWidth() {
    return getActionIconTotalWidth(
      this.actionIconConfig,
      this.getStyle()!.icon!,
    );
  }

  protected getActionIconStyle() {
    const { icon } = this.getStyle()!;
    const fill = this.getTextConditionFill(this.getTextStyle().fill!);

    return {
      width: icon?.size,
      height: icon?.size,
      // 主题 icon 颜色配置优先，若无则默认为文本条件格式颜色优先
      fill: icon?.fill || fill,
    };
  }

  // 是否设置为默认隐藏 action icon，默认隐藏的交互为 hover 后可见
  protected hasDefaultHideActionIcon() {
    return this.hasDefaultHiddenIcon;
  }

  protected addActionIcon(options: HeaderActionIconOptions) {
    const { x, y, iconName, defaultHide, onClick, onHover, isSortIcon } =
      options;

    const icon = new GuiIcon({
      name: iconName,
      x,
      y,
      ...this.getActionIconStyle(),
    });

    // 默认隐藏，hover 可见
    icon.setAttribute('visibility', defaultHide ? 'hidden' : 'visible');
    if (onHover) {
      icon.addEventListener('mouseover', (event: CanvasEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER, event);
        onHover({
          hovering: true,
          iconName,
          meta: this.meta,
          event,
        });
      });

      icon.addEventListener('mouseleave', (event: CanvasEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER_OFF, event);
        onHover({
          hovering: false,
          iconName,
          meta: this.meta,
          event,
        });
      });
    }

    if (isSortIcon) {
      icon.addEventListener('click', (event: CanvasEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
        this.spreadsheet.handleGroupSort(event, this.meta);
      });
    } else if (onClick) {
      icon.addEventListener('click', (event: CanvasEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
        onClick({
          iconName,
          meta: this.meta,
          event,
        });
      });
    }

    this.actionIcons.push(icon);
    this.appendChild(icon);
  }

  protected drawActionIcons() {
    if (!this.actionIconConfig) {
      return;
    }

    const { iconNames, onClick, onHover, defaultHide, isSortIcon } =
      this.actionIconConfig;

    const position = this.getIconPosition(iconNames.length);

    const { size, margin } = this.getStyle()!.icon!;

    forEach(iconNames, (iconName, i) => {
      const x = position.x + i * size! + i * margin!.left!;
      const y = position.y;

      const iconDefaultHide =
        typeof defaultHide === 'function'
          ? defaultHide(this.meta, iconName.name)
          : defaultHide;

      if (iconDefaultHide) {
        this.hasDefaultHiddenIcon = true;
      }

      this.addActionIcon({
        iconName: iconName.name,
        x,
        y,
        defaultHide: iconDefaultHide,
        onClick,
        onHover,
        isSortIcon,
      });
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
    const { text, bolderText, measureText } = this.getStyle()!;
    let style: TextTheme | undefined;

    if (this.isMeasureField()) {
      style = measureText || text;
    } else if (this.isBolderText()) {
      style = bolderText;
    } else {
      style = text;
    }

    // 优先级：默认字体颜色（已经根据背景反色后的） < 用户配置字体颜色
    const fill = this.getTextConditionFill(
      this.getDefaultTextFill(style!.fill!),
    );

    return { ...style, fill };
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

  public update() {
    const { interaction } = this.spreadsheet;
    const stateInfo = interaction?.getState();
    const cells = interaction?.getCells([
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

  public mappingValue(condition: Condition): MappingResult {
    const value = this.getMeta().value;

    return condition?.mapping(value, this.meta)!;
  }

  public findFieldCondition(conditions: Condition[]): Condition | undefined {
    return findLast(conditions, (item) =>
      item.field instanceof RegExp
        ? item.field.test(this.meta.field)
        : item.field === this.meta.field,
    );
  }

  public getTreeIcon() {
    return this.treeIcon;
  }
}

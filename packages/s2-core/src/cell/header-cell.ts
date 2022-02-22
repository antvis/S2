import { Event as CanvasEvent } from '@antv/g-canvas';
import { first, map, includes, find, isEqual, get, forEach } from 'lodash';
import { shouldShowActionIcons } from 'src/utils/cell/header-cell';
import { EXTRA_FIELD } from '@/common/constant/basic';
import { BaseCell } from '@/cell/base-cell';
import { InteractionStateName } from '@/common/constant/interaction';
import { GuiIcon } from '@/common/icons';
import {
  HeaderActionIcon,
  HeaderActionIconProps,
  CellMeta,
  FormatResult,
} from '@/common/interface';
import { BaseHeaderConfig } from '@/facet/header/base';
import { Node } from '@/facet/layout/node';
import { includeCell } from '@/utils/cell/data-cell';
import { S2Event } from '@/common/constant';
import { CellTypes } from '@/common/constant';
import { getSortTypeIcon } from '@/utils/sort-action';
import { SortParam } from '@/common/interface';

export abstract class HeaderCell extends BaseCell<Node> {
  protected headerConfig: BaseHeaderConfig;

  protected treeIcon: GuiIcon | undefined;

  protected actionIcons: GuiIcon[];

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = { ...headerConfig };
    const { value, query } = this.meta;
    const sortParams = this.spreadsheet.dataCfg.sortParams;
    const isSortCell = this.isSortCell(); // 改单元格是否为需要展示排序 icon 单元格
    const sortParam: SortParam = find(
      sortParams.reverse(),
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
    this.actionIcons = [];
  }

  // 头部cell不需要使用formatter进行格式化，formatter只针对于data cell
  protected getFormattedFieldValue(): FormatResult {
    const { label, field } = this.meta;

    if (!isEqual(field, EXTRA_FIELD)) {
      return {
        formattedValue: label,
        value: label,
      };
    }

    const fieldName = this.spreadsheet.dataSet.getFieldName(label);

    return {
      formattedValue: fieldName || label,
      value: label,
    };
  }

  protected showActionIcons(actionIconCfg: HeaderActionIcon) {
    return shouldShowActionIcons(actionIconCfg, this.meta, this.cellType);
  }

  protected getActionIconCfg() {
    return find(
      this.spreadsheet.options.headerActionIcons,
      (headerActionIcon: HeaderActionIcon) =>
        this.showActionIcons(headerActionIcon),
    );
  }

  protected showSortIcon() {
    if (this.spreadsheet.options.showDefaultHeaderActionIcon) {
      const { sortParam } = this.headerConfig;
      const query = this.meta.query;
      // sortParam的query，和type本身可能会 undefined
      return (
        query &&
        isEqual(get(sortParam, 'query'), query) &&
        get(sortParam, 'type') &&
        get(sortParam, 'type') !== 'none'
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
    const { sortParam } = this.headerConfig;
    const position = this.getIconPosition();
    const sortIcon = new GuiIcon({
      name: get(sortParam, 'type', 'none'),
      ...position,
      width: icon.size,
      height: icon.size,
      fill: text.fill,
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
    const actionIconCfg = this.getActionIconCfg();
    return actionIconCfg?.defaultHide;
  }

  protected addActionIcon(
    iconName: string,
    x: number,
    y: number,
    size: number,
    action: (prop: HeaderActionIconProps) => void,
    defaultHide?: boolean,
  ) {
    const { text } = this.getStyle();
    const icon = new GuiIcon({
      name: iconName,
      x,
      y,
      width: size,
      height: size,
      fill: text.fill,
    });
    // 默认隐藏，hover 可见
    icon.set('visible', !defaultHide);
    icon.on('mouseover', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER, event);
    });
    icon.on('click', (event: CanvasEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
      action({
        iconName: iconName,
        meta: this.meta,
        event: event,
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
    if (!actionIconCfg) return;
    const { iconNames, action, defaultHide } = actionIconCfg;

    const position = this.getIconPosition(iconNames.length);

    const { size, margin } = this.getStyle().icon;
    forEach(iconNames, (iconName, key) => {
      const x = position.x + key * size + key * margin.left;
      this.addActionIcon(iconName, x, position.y, size, action, defaultHide);
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

  public toggleActionIcon(id: string) {
    if (this.getMeta().id === id) {
      const visibleActionIcons: GuiIcon[] = [];
      // 理论上每次只会显示一个 header cell 的所有 actionIcon（大部分情况下只会有一个）
      forEach(this.actionIcons, (icon) => {
        icon.set('visible', true);
        visibleActionIcons.push(icon);
      });
      this.spreadsheet.store.set('visibleActionIcons', visibleActionIcons);
    }
  }

  public update() {
    const { interaction } = this.spreadsheet;
    const stateInfo = interaction?.getState();
    const cells = interaction?.getCells();

    if (!first(cells)) return;

    switch (stateInfo?.stateName) {
      case InteractionStateName.SELECTED:
        this.handleSelect(cells, stateInfo?.nodes);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(cells);
        break;
      default:
        break;
    }
  }

  public updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName, this);
  }

  public hideInteractionShape() {
    super.hideInteractionShape();
  }
}

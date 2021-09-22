import { Event } from '@antv/g-canvas';
import {
  first,
  map,
  includes,
  find,
  isEqual,
  get,
  last,
  isEmpty,
  forEach,
  filter,
  each,
} from 'lodash';
import { BaseCell } from '@/cell/base-cell';
import { InteractionStateName } from '@/common/constant/interaction';
import { GuiIcon } from '@/common/icons';
import { S2CellType, HeaderActionIcon } from '@/common/interface';
import { BaseHeaderConfig } from '@/facet/header/base';
import { Node } from '@/facet/layout/node';
import { includeCell } from '@/utils/cell/data-cell';
import {
  EXTRA_FIELD,
  ID_SEPARATOR,
  InterceptType,
  S2Event,
  TOOLTIP_OPERATOR_MENUS,
} from '@/common/constant';
import { getSortTypeIcon } from '@/utils/sort-action';
import { TooltipOperatorOptions, SortParam } from '@/common/interface';

export abstract class HeaderCell extends BaseCell<Node> {
  protected headerConfig: BaseHeaderConfig;

  protected treeIcon: GuiIcon | undefined;

  protected actionIcons: GuiIcon[];

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = headerConfig;
    const { value, query } = this.meta;
    const sortParams = this.spreadsheet.dataCfg.sortParams;
    const isValueCell = this.isValueCell(); // 是否是数值节点
    const sortParam: SortParam = find(sortParams.reverse(), (item) =>
      isValueCell
        ? item?.sortByMeasure === value && isEqual(get(item, 'query'), query)
        : isEqual(get(item, 'query'), query),
    );

    const type = getSortTypeIcon(sortParam, isValueCell);
    this.headerConfig.sortParam = {
      ...this.headerConfig.sortParam,
      ...(sortParam || { query }),
      type,
    };
  }

  protected initCell() {
    this.actionIcons = [];
  }

  protected getActionIconCfg() {
    return filter(
      this.spreadsheet.options.headerActionIcons,
      (headerActionIcon: HeaderActionIcon) =>
        headerActionIcon?.belongCell === this.cellType,
    );
  }

  protected getIconPosition() {
    const textCfg = this.textShape.cfg.attrs;
    return {
      x: textCfg.x + this.actualTextWidth + this.getStyle().icon.margin.left,
      y: textCfg.y,
    };
  }

  protected drawActionIcons() {
    // 每种 header cell 类型只取第一个配置
    const actionIcons = this.getActionIconCfg()[0];

    if (!actionIcons) return;
    const {
      iconNames,
      display,
      action,
      customDisplayByLabelName,
      defaultHide,
    } = actionIcons;
    if (customDisplayByLabelName) {
      const { labelNames, mode } = customDisplayByLabelName;
      const ids = labelNames.map(
        (labelName) => `root${ID_SEPARATOR}${labelName}`,
      );

      if (
        (mode === 'omit' && ids.includes(this.meta.id)) ||
        (mode === 'pick' && !ids.includes(this.meta.id))
      )
        return;
    }

    const showIcon = () => {
      if (!display) return true;
      const level = this.meta.level;
      const rowLevel = display?.level;
      switch (display?.operator) {
        case '<':
          return level < rowLevel;
        case '<=':
          return level <= rowLevel;
        case '=':
          return level === rowLevel;
        case '>':
          return level > rowLevel;
        case '>=':
          return level >= rowLevel;
        default:
          break;
      }
    };

    if (!isEmpty(iconNames) && showIcon()) {
      const position = this.getIconPosition();
      const { size } = this.getStyle().icon;

      for (let i = 0; i < iconNames.length; i++) {
        const icon = new GuiIcon({
          name: iconNames[i],
          x: position.x,
          y: position.y,
          width: size,
          height: size,
        });
        icon.set('visible', !defaultHide);
        // icon.on('hover', (event: Event) => {
        //   this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_HOVER, event);
        // });
        icon.on('click', (event: Event) => {
          this.spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
          action(iconNames[i], this.meta, event);
        });

        this.actionIcons.push(icon);
        this.add(icon);
      }
    }
  }

  protected isValueCell() {
    return this.meta.key === EXTRA_FIELD;
  }

  protected handleGroupSort(event, meta) {
    event.stopPropagation();
    this.spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);
    const operator: TooltipOperatorOptions = {
      onClick: ({ key }) => {
        const { rows, columns } = this.spreadsheet.dataCfg.fields;
        const sortFieldId = this.spreadsheet.isValueInCols()
          ? last(rows)
          : last(columns);
        const { query, value } = meta;
        const sortParam: SortParam = {
          sortFieldId,
          sortMethod: key as SortParam['sortMethod'],
          sortByMeasure: value,
          query,
        };
        const prevSortParams = this.spreadsheet.dataCfg.sortParams.filter(
          (item) => item?.sortFieldId !== sortFieldId,
        );
        this.spreadsheet.setDataCfg({
          ...this.spreadsheet.dataCfg,
          sortParams: [...prevSortParams, sortParam],
        });
        this.spreadsheet.render();
      },
      menus: TOOLTIP_OPERATOR_MENUS.Sort,
    };

    this.spreadsheet.showTooltipWithInfo(event, [], {
      operator,
      onlyMenu: true,
    });
  }

  private handleHover(cells: S2CellType[]) {
    this.toggleActionIcon(false);
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.HOVER);
      this.toggleActionIcon(true);
    }
  }

  private handleSelect(cells: S2CellType[], nodes: Node[]) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.SELECTED);
    }
    const selectedNodeIds = map(nodes, 'id');
    if (includes(selectedNodeIds, this.meta.id)) {
      this.updateByState(InteractionStateName.SELECTED);
    }
  }

  public toggleActionIcon(visible: boolean) {
    if (this.getActionIconCfg()[0]?.defaultHide) {
      forEach(this.actionIcons, (icon) => icon.set('visible', visible));
    }
  }

  public update() {
    const stateInfo = this.spreadsheet.interaction.getState();
    const cells = this.spreadsheet.interaction.getActiveCells();

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

  updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName, this);
  }

  public hideInteractionShape() {
    super.hideInteractionShape();
    if (
      this.spreadsheet.interaction.getCurrentStateName() ===
      InteractionStateName.HOVER
    ) {
      each(this.actionIcons, (icon) => icon.set('visible', false));
    }
  }
}

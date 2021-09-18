import { first, map, includes, find, isEqual, get, last } from 'lodash';
import { getSelectedCellMeta } from 'src/utils/interaction/select-event';
import { BaseCell } from '@/cell/base-cell';
import { InteractionStateName } from '@/common/constant/interaction';
import { GuiIcon } from '@/common/icons';
import { SelectedCellMeta } from '@/common/interface';
import { BaseHeaderConfig } from '@/facet/header/base';
import { Node } from '@/facet/layout/node';
import { includeCell } from '@/utils/cell/data-cell';
import { EXTRA_FIELD, InterceptType, ORDER_OPTIONS } from '@/common/constant';
import { getSortTypeIcon } from '@/utils/sort-action';
import { TooltipOperatorOptions, SortParam } from '@/common/interface';
import { SortMethod } from '@/index';

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

  protected isValueCell() {
    return this.meta.key === EXTRA_FIELD;
  }

  protected handleGroupSort(event, meta) {
    event.stopPropagation();
    this.spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);
    const operator: TooltipOperatorOptions = {
      onClick: (method: SortMethod) => {
        const { rows, columns } = this.spreadsheet.dataCfg.fields;
        const sortFieldId = this.spreadsheet.isValueInCols()
          ? last(rows)
          : last(columns);
        const { query, value } = meta;
        const sortParam = {
          sortFieldId,
          sortMethod: method,
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
      menus: ORDER_OPTIONS,
    };

    this.spreadsheet.showTooltipWithInfo(event, [], {
      operator,
      onlyMenu: true,
    });
  }

  private handleHover(cells: SelectedCellMeta[]) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.HOVER, this);
    }
  }

  private handleSelect(cells: SelectedCellMeta[], nodes: Node[]) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.SELECTED, this);
    }
    const selectedNodeIds = map(nodes, 'id');
    if (includes(selectedNodeIds, this.meta.id)) {
      this.updateByState(InteractionStateName.SELECTED, this);
    }
  }

  public update() {
    const { interaction } = this.spreadsheet;
    const stateInfo = interaction.getState();
    const cells = interaction.getSelectedCells();
    const hoverdCells = interaction.getHoveredCells();

    if (!first(cells)) return;

    switch (stateInfo?.stateName) {
      case InteractionStateName.SELECTED:
        this.handleSelect(cells, stateInfo?.nodes);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(hoverdCells.map((item) => getSelectedCellMeta(item)));
        break;
      default:
        break;
    }
  }
}

import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { isEmpty } from 'lodash';
import type { CornerCell } from '../../../cell';
import {
  CellType,
  CornerNodeType,
  InteractionName,
  type CellMeta,
  type Data,
  type S2CellType,
} from '../../../common';
import {
  InteractionStateName,
  InterceptType,
  S2Event,
} from '../../../common/constant';
import type { Node } from '../../../facet/layout/node';
import {
  BaseEvent,
  type BaseEventImplement,
} from '../../../interaction/base-event';

export class CornerCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindCornerCellClick();
  }

  private bindCornerCellClick() {
    this.spreadsheet.on(S2Event.CORNER_CELL_CLICK, (event) => {
      const cornerCell = this.spreadsheet.getCell<CornerCell>(event.target);

      if (!cornerCell) {
        return;
      }

      const cornerCellMeta = cornerCell.getMeta() as Node;

      switch (cornerCellMeta?.cornerType) {
        case CornerNodeType.Row:
          this.onRowCornerClick(cornerCellMeta?.field, event);

          break;
        case CornerNodeType.Col:
          this.onColCornerClick(cornerCellMeta?.field, event);

          break;
        case CornerNodeType.Series:
          this.onSeriesCornerClick(cornerCellMeta?.field, event);

          break;
        default:
          break;
      }
    });
  }

  private onRowCornerClick(field: string, event: CanvasEvent) {
    const rowNodes = this.getSelectedRowNodes(field);

    this.selectCells(rowNodes, event);
  }

  private onColCornerClick(field: string, event: CanvasEvent) {
    const colNodes = this.getSelectedColNodes(field);

    this.selectCells(colNodes, event);
  }

  private onSeriesCornerClick(field: string, event: CanvasEvent) {
    const seriesNodes = this.spreadsheet.facet.getSeriesNumberNodes();

    this.selectCells(seriesNodes, event);
  }

  private getSelectedRowNodes(field: string) {
    const { facet } = this.spreadsheet;

    // 树状模式只有一列
    if (this.spreadsheet.isHierarchyTreeType()) {
      return facet.getRowNodes();
    }

    if (!this.spreadsheet.isCustomRowFields()) {
      return facet.getRowNodesByField(field);
    }

    // 自定义行头 field 都是独立的, 需要根据 level 区查找.
    const sampleNode = facet.getRowNodesByField(field)[0];

    return facet.getRowNodes(sampleNode?.level);
  }

  private getSelectedColNodes(field: string) {
    const { facet } = this.spreadsheet;

    if (!this.spreadsheet.isCustomColumnFields()) {
      return facet.getColNodesByField(field);
    }

    // 自定义列头 field 都是独立的, 需要根据 level 区查找.
    const sampleNode = facet.getColNodesByField(field)[0];

    return facet.getColNodes(sampleNode?.level);
  }

  private getCellMetas(nodes: Node[], cellType: CellType): CellMeta[] {
    return nodes.map((node) => {
      return {
        id: node.id,
        // 选中角头而高亮的行头, 不需要联动数值单元格, 所以索引设置为 -1
        colIndex: -1,
        rowIndex: -1,
        type: cellType,
      };
    });
  }

  private emitSelectEvent(event: CanvasEvent, targetCell: S2CellType) {
    this.spreadsheet.interaction.emitSelectEvent({
      event,
      targetCell,
      interactionName: InteractionName.CORNER_CELL_CLICK,
    });
  }

  private selectCells(nodes: Node[], event: CanvasEvent) {
    const { interaction } = this.spreadsheet;
    const sample = nodes[0]?.belongsCell;
    const cells = this.getCellMetas(nodes, sample?.cellType!);
    const cornerCell = this.spreadsheet.getCell<CornerCell>(event.target)!;

    if (sample && interaction.isSelectedCell(sample)) {
      interaction.reset();
      this.emitSelectEvent(event, cornerCell);

      return;
    }

    if (isEmpty(nodes) || isEmpty(cells)) {
      return;
    }

    interaction.addIntercepts([InterceptType.HOVER]);
    interaction.changeState({
      cells,
      stateName: InteractionStateName.SELECTED,
    });
    interaction.highlightNodes(nodes, InteractionStateName.SELECTED);
    cornerCell?.updateByState(InteractionStateName.SELECTED);

    this.showTooltip(event);
    this.emitSelectEvent(event, cornerCell);
  }

  private showTooltip(event: CanvasEvent) {
    // 角头的选中是维值, 不需要计算数值总和, 显示 [`xx 项已选中`] 即可
    const selectedData = this.spreadsheet.interaction.getActiveCells();
    const operator = this.getTooltipOperator(event);

    this.spreadsheet.showTooltipWithInfo(event, [], {
      operator,
      data: {
        summaries: [
          {
            selectedData: selectedData as unknown as Data[],
            name: '',
            value: null,
          },
        ],
      },
    });
  }
}

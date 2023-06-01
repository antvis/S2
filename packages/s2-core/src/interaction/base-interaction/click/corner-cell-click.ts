import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { isEmpty } from 'lodash';
import { CellType, type CellMeta, type Data } from '../../../common';
import {
  InteractionStateName,
  InterceptType,
  S2Event,
} from '../../../common/constant';
import {
  BaseEvent,
  type BaseEventImplement,
} from '../../../interaction/base-event';
import type { Node } from '../../../facet/layout/node';

export class CornerCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindCornerCellClick();
  }

  private bindCornerCellClick() {
    this.spreadsheet.on(S2Event.CORNER_CELL_CLICK, (event) => {
      const { interaction, facet } = this.spreadsheet;
      const cornerCell = this.spreadsheet.getCell(event.target);

      if (!cornerCell) {
        return;
      }

      // 获取当前角头所对应那一列的行头单元格节点
      const cornerCellMeta = cornerCell.getMeta();
      const rowNodes = cornerCellMeta?.field
        ? facet.getRowNodesByField(cornerCellMeta?.field)
        : [];
      const sample = rowNodes[0]?.belongsCell;
      const cells = this.getRowCells(rowNodes);

      if (sample && interaction.isSelectedCell(sample)) {
        interaction.reset();
        this.spreadsheet.emit(
          S2Event.GLOBAL_SELECTED,
          interaction.getActiveCells(),
        );

        return;
      }

      if (isEmpty(rowNodes) || isEmpty(cells)) {
        return;
      }

      interaction.addIntercepts([InterceptType.HOVER]);
      interaction.changeState({
        cells,
        stateName: InteractionStateName.SELECTED,
      });
      interaction.highlightNodes(rowNodes);

      this.showTooltip(event);
      this.spreadsheet.emit(
        S2Event.GLOBAL_SELECTED,
        interaction.getActiveCells(),
      );
    });
  }

  private getRowCells(nodes: Node[]): CellMeta[] {
    return nodes.map((node) => {
      return {
        id: node.id,
        // 选中角头而高亮的行头, 不需要联动数值单元格, 所以索引设置为 -1
        colIndex: -1,
        rowIndex: -1,
        type: CellType.ROW_CELL,
      };
    });
  }

  private showTooltip(event: CanvasEvent) {
    // 角头的选中是维值, 不需要计算数值总和, 显示 [`xx 项已选中`] 即可
    const selectedData = this.spreadsheet.interaction.getActiveCells();

    this.spreadsheet.showTooltipWithInfo(event, [], {
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

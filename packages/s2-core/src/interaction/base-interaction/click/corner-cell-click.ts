import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { isEmpty } from 'lodash';
import {
  CellType,
  type CellMeta,
  type Data,
  CornerNodeType,
} from '../../../common';
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
      const cornerCell = this.spreadsheet.getCell(event.target);

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

  private selectCells(nodes: Node[], event: CanvasEvent) {
    const { interaction } = this.spreadsheet;
    const sample = nodes[0]?.belongsCell;
    const cells = this.getCellMetas(nodes, sample?.cellType!);

    if (sample && interaction.isSelectedCell(sample)) {
      interaction.reset();
      this.spreadsheet.emit(
        S2Event.GLOBAL_SELECTED,
        interaction.getActiveCells(),
      );

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
    interaction.highlightNodes(nodes);

    this.showTooltip(event);
    this.spreadsheet.emit(
      S2Event.GLOBAL_SELECTED,
      interaction.getActiveCells(),
    );
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

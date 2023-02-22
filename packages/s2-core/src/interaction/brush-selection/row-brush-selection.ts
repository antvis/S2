import { map } from 'lodash';
import { RowCell } from '../../cell';
import { InterceptType, S2Event } from '../../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
} from '../../common/constant/interaction';
import type { OnUpdateCells, ViewMeta } from '../../common/interface';
import type { Node } from '../../facet/layout/node';
import { getCellMeta } from '../../utils/interaction/select-event';
import { BaseBrushSelection } from './base-brush-selection';

export class RowBrushSelection extends BaseBrushSelection {
  protected bindMouseDown() {
    this.spreadsheet.on(S2Event.ROW_CELL_MOUSE_DOWN, (event) => {
      super.mouseDown(event);
    });
  }

  protected isPointInCanvas(point: { x: number; y: number }) {
    // 获取行头的区域范围
    const { height: maxY } = this.spreadsheet.facet.getCanvasHW();
    const { minX, height: minY, maxX } = this.spreadsheet.facet.cornerBBox;

    return (
      point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
    );
  }

  protected bindMouseMove() {
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_MOVE, (event) => {
      if (
        this.brushSelectionStage === InteractionBrushSelectionStage.UN_DRAGGED
      ) {
        return;
      }

      this.setBrushSelectionStage(InteractionBrushSelectionStage.DRAGGED);
      const pointInCanvas = this.spreadsheet.container.getPointByEvent(event);

      if (this.autoBrushScroll(pointInCanvas)) {
        return;
      }

      this.renderPrepareSelected(pointInCanvas);
    });
  }

  protected setDisplayedCells() {
    this.displayedCells = this.spreadsheet.interaction.getAllRowHeaderCells();
  }

  protected isInBrushRange = (meta: ViewMeta | Node) => {
    // start、end 都是相对位置
    const { start, end } = this.getBrushRange();
    const { scrollY, hRowScrollX } = this.spreadsheet.facet.getScrollOffset();

    const { cornerBBox } = this.spreadsheet.facet;
    // 绝对位置，不随滚动条变化
    const { x = 0, y = 0, width = 0, height = 0 } = meta;

    return this.rectanglesIntersect(
      {
        // 行头过长时，可以单独进行滚动，所以需要加上滚动的距离
        minX: start.x + hRowScrollX,
        // 由于刷选的时候，是以行头的左上角为起点，所以需要减去角头的宽度，在滚动后需要加上滚动条的偏移量
        minY: start.y - cornerBBox.height + scrollY,
        maxX: end.x + hRowScrollX,
        maxY: end.y - cornerBBox.height + scrollY,
      },
      {
        minX: x,
        maxX: x + width,
        minY: y,
        maxY: y + height,
      },
    );
  };

  // 最终刷选的cell
  protected updateSelectedCells() {
    const selectedRowNodes = this.getSelectedRowNodes();
    const scrollBrushRangeCells =
      this.getScrollBrushRangeCells(selectedRowNodes);
    const selectedCellMetas = map(scrollBrushRangeCells, getCellMeta);

    this.spreadsheet.interaction.changeState({
      cells: selectedCellMetas,
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: this.onUpdateCells,
    });

    this.emitBrushSelectionEvent(
      S2Event.ROW_CELL_BRUSH_SELECTION,
      scrollBrushRangeCells,
    );
  }

  protected addBrushIntercepts() {
    this.spreadsheet.interaction.addIntercepts([
      InterceptType.ROW_BRUSH_SELECTION,
    ]);
  }

  protected onUpdateCells: OnUpdateCells = (root) => {
    return root.updateCells(root.getAllRowHeaderCells());
  };

  private getSelectedRowNodes = (): Node[] => {
    return this.spreadsheet.getRowNodes().filter(this.isInBrushRange);
  };

  private getScrollBrushRangeCells(nodes: Node[]) {
    return nodes.map((node) => {
      const visibleCell = this.getVisibleBrushRangeCells(node.id);

      if (visibleCell) {
        return visibleCell;
      }

      return new RowCell(node, this.spreadsheet);
    });
  }
}

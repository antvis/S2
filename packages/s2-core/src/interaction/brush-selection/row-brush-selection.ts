import type { Point } from '@antv/g-canvas';
import { isNil, last, map } from 'lodash';
import { RowCell } from '../../cell';
import { InterceptType, S2Event } from '../../common/constant';
import {
  InteractionBrushSelectionStage,
  InteractionStateName,
  ScrollDirection,
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

  protected isPointInCanvas(point: Point) {
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

      if (this.autoBrushScroll(pointInCanvas, true)) {
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
    const { scrollY, rowHeaderScrollX } =
      this.spreadsheet.facet.getScrollOffset();
    const { cornerBBox } = this.spreadsheet.facet;
    // 绝对位置，不随滚动条变化
    const { x = 0, y = 0, width = 0, height = 0 } = meta;

    return this.rectanglesIntersect(
      {
        // 行头过长时，可以单独进行滚动，所以需要加上滚动的距离
        minX: start.x + rowHeaderScrollX,
        // 由于刷选的时候，是以行头的左上角为起点，所以需要减去角头的宽度，在滚动后需要加上滚动条的偏移量
        minY: start.y - cornerBBox.height + scrollY,
        maxX: end.x + rowHeaderScrollX,
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

  // 最终刷选的 cells
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

  protected getWillScrollToRowIndex = (dir: ScrollDirection): number => {
    // 行头叶子节点, 按默认逻辑处理即可
    if (!isNil(this.endBrushPoint.rowIndex)) {
      return this.getDefaultWillScrollToRowIndex(dir);
    }

    /**
     * 行头的非叶子节点滚动刷选, 以当前节点所对应 [可视范围] 内叶子节点为基准
     * 例: 当前刷选 [浙江省] 行头的这一列, 向 🔽 滚动以 [纸张] 为准, 向 🔼滚动以 [桌子] 为准
       ---------------------------------------
     * |       | 杭州市 | 家具    | 🔼 [桌子]   |
     * |       |       |        | 沙发   |
     * |       |       | 办公用品 | 笔    |
     * |       |       |         | 纸张  |
     * | 浙江省 |       |         |      |
     * |       | 绍兴市 | 家具     | 桌子  |
     * |       |       |         | 沙发  |
     * |       |       | 办公用品 | 笔    |
     * |       |       |         | 🔽 [纸张] |
     * -------------------------------------
     */
    const rowCell = this.spreadsheet.interaction.getAllRowHeaderCells();
    const firstLeafCell = rowCell.find((cell) => {
      const meta = cell.getMeta();
      return meta.isLeaf;
    });
    const lastLeafCell = last(rowCell);
    const visibleCell =
      dir === ScrollDirection.TRAILING ? lastLeafCell : firstLeafCell;
    const lastRowIndex = visibleCell?.getMeta()?.rowIndex ?? 0;
    const nextRowIndex = lastRowIndex + this.getWillScrollRowIndexDiff(dir);
    return this.validateYIndex(nextRowIndex);
  };
}

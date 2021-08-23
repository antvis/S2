import { BaseCell } from '@/cell/base-cell';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { S2CellType, ViewMeta, ViewMetaIndex } from '@/common/interface';
import { CellCondition } from '@/condition/cell-condition';
import { renderLine, renderRect } from '@/utils/g-renders';
import { first, get, includes, isEmpty, isEqual, map } from 'lodash';

/**
 * DataCell for panelGroup area
 * ----------------------------
 * |                  |       |
 * |interval      text| icon  |
 * |                  |       |
 * ----------------------------
 * There are four conditions(]{@see BaseCell.conditions}) to determine how to render
 * 1、background color
 * 2、icon align in right with size {@link ICON_SIZE}
 * 3、left rect area is interval(in left) and text(in right)
 */
export class DataCell extends BaseCell<ViewMeta> {
  protected cellCondition: CellCondition;

  public get cellType() {
    return CellTypes.DATA_CELL;
  }

  protected handlePrepareSelect(cells: S2CellType[]) {
    if (includes(cells, this)) {
      this.updateByState(InteractionStateName.PREPARE_SELECT);
    }
  }

  protected handleSelect(cells: S2CellType[]) {
    const currentCellType = cells?.[0]?.cellType;
    switch (currentCellType) {
      // 列多选
      case CellTypes.COL_CELL:
        this.changeRowColSelectState('colIndex');
        break;
      // 行多选
      case CellTypes.ROW_CELL:
        this.changeRowColSelectState('rowIndex');
        break;
      // 单元格单选/多选
      case CellTypes.DATA_CELL:
        if (includes(cells, this)) {
          this.updateByState(InteractionStateName.SELECTED);
        } else if (this.spreadsheet.options.selectedCellsSpotlight) {
          this.updateByState(InteractionStateName.UNSELECTED);
        }
        break;
      default:
        break;
    }
  }

  protected handleHover(cells: S2CellType[]) {
    const currentHoverCell = first(cells) as S2CellType;
    if (currentHoverCell.cellType !== CellTypes.DATA_CELL) {
      this.hideInteractionShape();
      return;
    }

    if (this.spreadsheet.options.hoverHighlight) {
      // 如果当前是hover，要绘制出十字交叉的行列样式

      const currentColIndex = this.meta.colIndex;
      const currentRowIndex = this.meta.rowIndex;
      // 当视图内的 cell 行列 index 与 hover 的 cell 一致，绘制hover的十字样式
      if (
        currentColIndex === currentHoverCell?.getMeta().colIndex ||
        currentRowIndex === currentHoverCell?.getMeta().rowIndex
      ) {
        this.updateByState(InteractionStateName.HOVER);
      } else {
        // 当视图内的 cell 行列 index 与 hover 的 cell 不一致，隐藏其他样式
        this.hideInteractionShape();
      }
    }

    if (isEqual(currentHoverCell, this)) {
      this.updateByState(InteractionStateName.HOVER_FOCUS);
    }
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    const cells = this.spreadsheet.interaction.getActiveCells();

    if (isEmpty(cells) || !stateName) {
      return;
    }

    switch (stateName) {
      case InteractionStateName.PREPARE_SELECT:
        this.handlePrepareSelect(cells);
        break;
      case InteractionStateName.SELECTED:
        this.handleSelect(cells);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(cells);
        break;
      default:
        break;
    }
  }

  public setMeta(viewMeta: ViewMeta) {
    super.setMeta(viewMeta);
    this.initCell();
  }

  protected initCell() {
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();
    this.drawConditionsShapes();
    this.drawInteractiveBorderShape();
    this.drawBorderShape();
    this.update();
  }

  protected drawConditionsShapes() {
    const { spreadsheet, meta, theme } = this;
    const { conditions } = this.spreadsheet.options;
    this.cellCondition = new CellCondition(
      spreadsheet,
      meta,
      theme,
      conditions,
    );
    this.add(this.cellCondition);
  }

  public getBackgroundColor(): string {
    const crossBackgroundColor = this.theme.dataCell.cell.crossBackgroundColor;
    if (
      this.spreadsheet.isPivotMode() &&
      crossBackgroundColor &&
      this.meta.rowIndex % 2 === 0
    ) {
      // 隔行颜色的配置
      // 偶数行展示灰色背景，因为index是从0开始的
      return crossBackgroundColor;
    }

    return this.theme.dataCell.cell.backgroundColor;
  }

  /**
   * Draw cell background
   */
  protected drawBackgroundShape() {
    const { x, y, height, width } = this.meta;
    const stroke = 'transparent';
    const bgColor = this.getBackgroundColor();

    this.backgroundShape = renderRect(this, {
      x,
      y,
      width,
      height,
      fill: bgColor,
      stroke,
    });
  }

  /**
   * 绘制hover悬停，刷选的外框
   */
  protected drawInteractiveBorderShape() {
    // 往内缩一个像素，避免和外边框重叠
    const margin = 1;
    const { x, y, height, width } = this.meta;
    this.stateShapes.set(
      'interactiveBorderShape',
      renderRect(this, {
        x: x + margin,
        y: y + margin,
        width: width - margin * 2,
        height: height - margin * 2,
        fill: 'transparent',
        stroke: 'transparent',
      }),
    );
  }

  /**
   * Draw interactive color
   */
  protected drawInteractiveBgShape() {
    const { x, y, height, width } = this.meta;
    this.stateShapes.set(
      'interactiveBgShape',
      renderRect(this, {
        x,
        y,
        width,
        height,
        fill: 'transparent',
        stroke: 'transparent',
      }),
    );
  }

  // dataCell根据state 改变当前样式，
  private changeRowColSelectState(index: ViewMetaIndex) {
    const currentIndex = get(this.meta, index);
    const nodes = this.spreadsheet.interaction.getState()?.nodes;
    const selectedIndexes = map(nodes, (node) => get(node, index));
    if (includes(selectedIndexes, currentIndex)) {
      this.updateByState(InteractionStateName.SELECTED);
    } else if (this.spreadsheet.options.selectedCellsSpotlight) {
      this.updateByState(InteractionStateName.UNSELECTED);
    } else {
      this.hideInteractionShape();
    }
  }

  /**
   * Render cell border controlled by verticalBorder & horizontalBorder
   * @private
   */
  protected drawBorderShape() {
    const { x, y, height, width } = this.meta;
    const { cell } = this.theme.dataCell;

    // horizontal border
    renderLine(
      this,
      {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y,
      },
      {
        stroke: cell.horizontalBorderColor,
        lineWidth: cell.horizontalBorderWidth,
        opacity: cell.horizontalBorderColorOpacity,
      },
    );

    // vertical border
    renderLine(
      this,
      {
        x1: x + width,
        y1: y,
        x2: x + width,
        y2: y + height,
      },
      {
        stroke: cell.verticalBorderColor,
        lineWidth: cell.verticalBorderWidth,
        opacity: cell.horizontalBorderColorOpacity,
      },
    );
  }

  public updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName);
    this.cellCondition.updateConditionsByState(stateName);
  }

  public clearUnselectedState() {
    super.clearUnselectedState();
    this.cellCondition.clearUnselectedState();
  }
}

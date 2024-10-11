import { Group, Line, Rect } from '@antv/g';
import type { FrameConfig } from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import { floor } from '../../utils/math';
import { renderLine } from '.././../utils/g-renders';
import type { FrozenFacet } from '../frozen-facet';
import { translateGroup } from '../utils';

export class Frame extends Group {
  declare cfg: FrameConfig;

  public cornerRightBorder: Line;

  public cornerBottomBorder: Line;

  constructor(cfg: FrameConfig) {
    super();
    this.cfg = cfg;
    this.render();
  }

  public layout() {
    // corner 底部的横线条
    this.addCornerBottomBorder();
    // corner 右边的竖线条
    this.addCornerRightBorder();
    // 一级纵向分割线两侧的 shadow
    this.addSplitLineShadow();
  }

  /**
   * 渲染
   */
  public render(): void {
    this.removeChildren();
    this.layout();
  }

  public static getHorizontalBorderWidth(spreadsheet: SpreadSheet): number {
    const { horizontalBorderWidth } = spreadsheet.theme?.splitLine!;

    return horizontalBorderWidth!;
  }

  public static getVerticalBorderWidth(spreadsheet: SpreadSheet): number {
    const { splitLine, cornerCell, colCell, dataCell } = spreadsheet.theme;

    if (spreadsheet.isPivotMode()) {
      return splitLine?.verticalBorderWidth!;
    }

    /**
     * 明细表需要在最左侧绘制一条边框
     * 以前是用gridInfo处理, gridInfo会在每一个列单元格的加一条右侧竖线作为边框分隔
     * 并且对于第一列还要加一个左侧的竖线作为边框
     * 这会导致：如果边框设置的很大，可以明显的看到第一个单元格的内容区域比其他的小，且会有左侧内容遮挡
     *
     * 现在借助 centerFrame 来绘制左侧的边框，不对单元格的内容造成占位
     * 在开启序号时，左侧头部序号单元格所使用的是 cornerCell 的主题，否则使用 colCell 的主题
     */
    return Math.max(
      dataCell!.cell!.verticalBorderWidth!,
      spreadsheet.options.seriesNumber?.enable
        ? cornerCell!.cell!.verticalBorderWidth!
        : colCell!.cell!.verticalBorderWidth!,
    );
  }

  public onBorderScroll(scrollX: number): void {
    this.cfg.scrollX = scrollX;
    const { position } = this.cfg;

    translateGroup(this, position.x - scrollX, 0);
    this.render();
  }

  public onChangeShadowVisibility(scrollX: number, maxScrollX: number) {
    const { colCount, trailingColCount } = (
      this.cfg.spreadsheet.facet as FrozenFacet
    ).getFrozenOptions();

    this.cfg.showViewportLeftShadow = colCount === 0 && scrollX > 0;
    // baseFacet#renderHScrollBar render condition
    this.cfg.showViewportRightShadow =
      trailingColCount === 0 && floor(scrollX) < floor(maxScrollX);

    this.render();
  }

  private addCornerRightBorder() {
    const { cornerWidth, cornerHeight, viewportHeight, position, spreadsheet } =
      this.cfg;
    const {
      verticalBorderColor,
      verticalBorderColorOpacity,
      horizontalBorderWidth,
    } = spreadsheet.theme?.splitLine!;

    const frameVerticalWidth = Frame.getVerticalBorderWidth(spreadsheet);
    const x = position.x + cornerWidth + frameVerticalWidth! / 2;

    // 表头和表身的单元格背景色不同, 分割线不能一条线拉通, 不然视觉不协调.
    // 分两条线绘制, 默认和分割线所在区域对应的单元格边框颜色保持一致
    const {
      verticalBorderColor: headerVerticalBorderColor,
      verticalBorderColorOpacity: headerVerticalBorderColorOpacity,
    } =
      spreadsheet.options.seriesNumber?.enable || spreadsheet.isPivotMode()
        ? spreadsheet.theme.cornerCell!.cell!
        : spreadsheet.theme.colCell!.cell!;

    renderLine(this, {
      x1: x,
      y1: position.y,
      x2: x,
      y2: position.y + cornerHeight,
      stroke: verticalBorderColor || headerVerticalBorderColor,
      lineWidth: frameVerticalWidth,
      strokeOpacity:
        verticalBorderColorOpacity || headerVerticalBorderColorOpacity,
    });

    const {
      verticalBorderColor: cellVerticalBorderColor,
      verticalBorderColorOpacity: cellVerticalBorderColorOpacity,
    } = spreadsheet.theme.dataCell!.cell!;

    renderLine(this, {
      x1: x,
      y1: position.y + cornerHeight + horizontalBorderWidth!,
      x2: x,
      y2: position.y + cornerHeight + horizontalBorderWidth! + viewportHeight,
      stroke: verticalBorderColor || cellVerticalBorderColor,
      lineWidth: frameVerticalWidth,
      strokeOpacity:
        verticalBorderColorOpacity || cellVerticalBorderColorOpacity,
    });
  }

  private addCornerBottomBorder() {
    const cfg = this.cfg;
    const {
      cornerWidth,
      cornerHeight,
      viewportWidth,
      position,
      scrollX = 0,
      spreadsheet,
    } = cfg;
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      horizontalBorderColorOpacity,
    } = spreadsheet.theme?.splitLine!;

    const {
      horizontalBorderColor: headerHorizontalBorderColor,
      horizontalBorderColorOpacity: headerHorizontalBorderColorOpacity,
    } =
      spreadsheet.options.seriesNumber?.enable || spreadsheet.isPivotMode()
        ? spreadsheet.theme.cornerCell!.cell!
        : spreadsheet.theme.colCell!.cell!;

    const x1 = position.x;
    const x2 =
      x1 +
      cornerWidth +
      Frame.getVerticalBorderWidth(spreadsheet)! +
      viewportWidth +
      (spreadsheet.isFrozenRowHeader() ? 0 : scrollX);
    const y = position.y + cornerHeight + horizontalBorderWidth! / 2;

    this.cornerBottomBorder = renderLine(this, {
      x1,
      y1: y,
      x2,
      y2: y,
      stroke: horizontalBorderColor || headerHorizontalBorderColor,
      lineWidth: horizontalBorderWidth,
      opacity:
        horizontalBorderColorOpacity || headerHorizontalBorderColorOpacity,
    });
  }

  private addSplitLineShadow() {
    const cfg = this.cfg;
    const { spreadsheet } = cfg;
    const splitLine = spreadsheet.theme?.splitLine;

    if (
      !spreadsheet.isPivotMode() ||
      !splitLine?.showShadow ||
      !spreadsheet.isFrozenRowHeader()
    ) {
      return;
    }

    this.addSplitLineLeftShadow();
    this.addSplitLineRightShadow();
  }

  private addSplitLineLeftShadow() {
    if (!this.cfg.showViewportLeftShadow) {
      return;
    }

    const { cornerWidth, cornerHeight, viewportHeight, position, spreadsheet } =
      this.cfg;
    const { shadowColors, shadowWidth, horizontalBorderWidth } =
      spreadsheet.theme?.splitLine!;
    const x =
      position.x + cornerWidth + Frame.getVerticalBorderWidth(spreadsheet)!;
    const y = position.y;

    this.appendChild(
      new Rect({
        style: {
          x,
          y,
          width: shadowWidth!,
          height: cornerHeight + horizontalBorderWidth! + viewportHeight,
          fill: `l (0) 0:${shadowColors?.left} 1:${shadowColors?.right}`,
        },
      }),
    );
  }

  private addSplitLineRightShadow() {
    if (!this.cfg.showViewportRightShadow) {
      return;
    }

    const {
      cornerWidth,
      cornerHeight,
      viewportHeight,
      viewportWidth,
      position,
      spreadsheet,
    } = this.cfg;
    const { shadowColors, shadowWidth, horizontalBorderWidth } =
      spreadsheet.theme?.splitLine!;
    const x =
      position.x +
      cornerWidth +
      Frame.getVerticalBorderWidth(spreadsheet)! +
      viewportWidth -
      shadowWidth!;
    const y = position.y;

    this.appendChild(
      new Rect({
        style: {
          x,
          y,
          width: shadowWidth!,
          height: cornerHeight + horizontalBorderWidth! + viewportHeight,
          fill: `l (0) 0:${shadowColors?.right} 1:${shadowColors?.left}`,
        },
      }),
    );
  }
}

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

  protected getCornerRightBorderSizeForPivotMode() {
    const { cornerHeight, viewportHeight, position, spreadsheet } = this.cfg;

    const { horizontalBorderWidth } = spreadsheet.theme?.splitLine!;

    const y = position.y;
    const height = cornerHeight + horizontalBorderWidth! + viewportHeight;

    return { y, height };
  }

  protected addCornerRightHeadBorder() {
    const { cornerWidth, cornerHeight, position, spreadsheet } = this.cfg;
    const { verticalBorderColor, verticalBorderColorOpacity } =
      spreadsheet.theme?.splitLine!;
    const frameVerticalWidth = Frame.getVerticalBorderWidth(spreadsheet);
    const frameHorizontalWidth = Frame.getHorizontalBorderWidth(spreadsheet);
    const x = position.x + cornerWidth + frameVerticalWidth! / 2;

    // 表头和表身的单元格背景色不同, 分割线不能一条线拉通, 不然视觉不协调.
    // 分两条线绘制, 默认和分割线所在区域对应的单元格边框颜色保持一致
    const {
      verticalBorderColor: headerVerticalBorderColor,
      verticalBorderColorOpacity: headerVerticalBorderColorOpacity,
      backgroundColor,
      backgroundColorOpacity,
    } = spreadsheet.options.seriesNumber?.enable || spreadsheet.isPivotMode()
      ? spreadsheet.theme.cornerCell!.cell!
      : spreadsheet.theme.colCell!.cell!;

    /**
     * G 6.0 颜色混合模式有调整, 相同颜色的 Line 在不同背景色绘制, 实际渲染的颜色会不一致
     * 在绘制分割线前, 先填充一个和单元格相同的底色, 保证分割线和单元格边框表现一致
     */
    [
      { stroke: backgroundColor, strokeOpacity: backgroundColorOpacity },
      {
        stroke: verticalBorderColor || headerVerticalBorderColor,
        strokeOpacity:
          verticalBorderColorOpacity || headerVerticalBorderColorOpacity,
      },
    ].forEach(({ stroke, strokeOpacity }) => {
      renderLine(this, {
        x1: x,
        y1: position.y,
        x2: x,
        y2: position.y + cornerHeight + frameHorizontalWidth,
        lineWidth: frameVerticalWidth,
        stroke,
        strokeOpacity,
      });
    });
  }

  protected addCornerRightBorder() {
    const { cornerWidth, cornerHeight, viewportHeight, position, spreadsheet } =
      this.cfg;
    const { verticalBorderColor, verticalBorderColorOpacity } =
      spreadsheet.theme?.splitLine!;
    const frameVerticalWidth = Frame.getVerticalBorderWidth(spreadsheet);
    const frameHorizontalWidth = Frame.getHorizontalBorderWidth(spreadsheet);
    const x = position.x + cornerWidth + frameVerticalWidth! / 2;

    // 表头和表身的单元格背景色不同, 分割线不能一条线拉通, 不然视觉不协调.
    // 分两条线绘制, 默认和分割线所在区域对应的单元格边框颜色保持一致
    this.addCornerRightHeadBorder();

    const {
      verticalBorderColor: cellVerticalBorderColor,
      verticalBorderColorOpacity: cellVerticalBorderColorOpacity,
      backgroundColor: cellBackgroundColor,
      backgroundColorOpacity: cellBackgroundColorOpacity,
    } = spreadsheet.theme.dataCell!.cell!;

    [
      {
        stroke: cellBackgroundColor,
        strokeOpacity: cellBackgroundColorOpacity,
      },
      {
        stroke: verticalBorderColor || cellVerticalBorderColor,
        strokeOpacity:
          verticalBorderColorOpacity || cellVerticalBorderColorOpacity,
      },
    ].forEach(({ stroke, strokeOpacity }) => {
      renderLine(this, {
        x1: x,
        y1: position.y + cornerHeight + frameHorizontalWidth!,
        x2: x,
        y2: position.y + cornerHeight + frameHorizontalWidth! + viewportHeight,
        lineWidth: frameVerticalWidth,
        stroke,
        strokeOpacity,
      });
    });
  }

  protected addCornerBottomBorder() {
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

  protected addSplitLineShadow() {
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

  protected addSplitLineLeftShadow() {
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

  protected addSplitLineRightShadow() {
    if (!this.cfg.showViewportRightShadow) {
      return;
    }

    const { cornerWidth, viewportWidth, position, spreadsheet } = this.cfg;
    const { shadowColors, shadowWidth } = spreadsheet.theme?.splitLine!;
    const x =
      position.x +
      cornerWidth +
      Frame.getVerticalBorderWidth(spreadsheet)! +
      viewportWidth -
      shadowWidth!;

    const { y, height } = this.getCornerRightBorderSizeForPivotMode();

    this.appendChild(
      new Rect({
        style: {
          x,
          y,
          width: shadowWidth!,
          height,
          fill: `l (0) 0:${shadowColors?.right} 1:${shadowColors?.left}`,
        },
      }),
    );
  }
}

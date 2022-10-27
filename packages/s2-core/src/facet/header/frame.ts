import { Group } from '@antv/g-canvas';
import { renderLine } from '.././../utils/g-renders';
import type { FrameConfig } from '../../common/interface';
import { translateGroup } from '../utils';

export class Frame extends Group {
  declare cfg: FrameConfig;

  constructor(cfg: FrameConfig) {
    super(cfg);
    this.render();
  }

  public layout() {
    // corner底部的横线条
    this.addCornerBottomBorder();
    // corner右边的竖线条
    this.addCornerRightBorder();
    // 一级纵向分割线两侧的shadow
    this.addSplitLineShadow();
  }

  /**
   * 渲染
   */
  public render(): void {
    this.clear();
    this.layout();
  }

  public onBorderScroll(scrollX: number): void {
    this.cfg.scrollX = scrollX;
    const { position } = this.cfg;
    translateGroup(this, position.x - scrollX, 0);
    this.render();
  }

  public onChangeShadowVisibility(scrollX: number, maxScrollX: number) {
    this.cfg.showViewportLeftShadow = scrollX > 0;
    // baseFacet#renderHScrollBar render condition
    this.cfg.showViewportRightShadow =
      Math.floor(scrollX) < Math.floor(maxScrollX);

    this.render();
  }

  private addCornerRightBorder() {
    const cfg = this.cfg;
    // 是否是透视表
    const { isPivotMode } = cfg;
    // 明细表啥也不要
    if (!isPivotMode) {
      return;
    }
    const { cornerWidth, cornerHeight, viewportHeight, position, spreadsheet } =
      cfg;
    const {
      verticalBorderWidth,
      verticalBorderColor,
      verticalBorderColorOpacity,
      horizontalBorderWidth,
    } = spreadsheet.theme?.splitLine;
    const x = position.x + cornerWidth + horizontalBorderWidth / 2;
    const y1 = position.y;
    const y2 =
      position.y + cornerHeight + horizontalBorderWidth + viewportHeight;
    renderLine(
      this,
      { x1: x, y1, x2: x, y2 },
      {
        stroke: verticalBorderColor,
        lineWidth: verticalBorderWidth,
        opacity: verticalBorderColorOpacity,
      },
    );
  }

  private addCornerBottomBorder() {
    const cfg = this.cfg;
    const {
      cornerWidth,
      cornerHeight,
      viewportWidth,
      position,
      scrollX,
      scrollContainsRowHeader,
      spreadsheet,
    } = cfg;
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      horizontalBorderColorOpacity,
      verticalBorderWidth,
    } = spreadsheet.theme?.splitLine;
    const x1 = position.x;
    const x2 =
      x1 +
      cornerWidth +
      verticalBorderWidth +
      viewportWidth +
      (scrollContainsRowHeader ? scrollX : 0);
    const y = position.y + cornerHeight + horizontalBorderWidth / 2;

    renderLine(
      this,
      {
        x1,
        y1: y,
        x2,
        y2: y,
      },
      {
        stroke: horizontalBorderColor,
        lineWidth: horizontalBorderWidth,
        opacity: horizontalBorderColorOpacity,
      },
    );
  }

  private addSplitLineShadow() {
    const cfg = this.cfg;
    const { isPivotMode, spreadsheet } = cfg;
    const splitLine = spreadsheet.theme?.splitLine;

    if (
      !isPivotMode ||
      !splitLine.showShadow ||
      !spreadsheet.isFrozenRowHeader()
    ) {
      return;
    }

    // do render...
    this.addSplitLineLeftShadow();
    this.addSplitLineRightShadow();
  }

  private addSplitLineLeftShadow() {
    if (!this.cfg.showViewportLeftShadow) {
      return;
    }

    const { cornerWidth, cornerHeight, viewportHeight, position, spreadsheet } =
      this.cfg;
    const {
      shadowColors,
      shadowWidth,
      verticalBorderWidth,
      horizontalBorderWidth,
    } = spreadsheet.theme?.splitLine;
    const x = position.x + cornerWidth + verticalBorderWidth;
    const y = position.y;
    this.addShape('rect', {
      attrs: {
        x,
        y,
        width: shadowWidth,
        height: cornerHeight + horizontalBorderWidth + viewportHeight,
        fill: `l (0) 0:${shadowColors?.left} 1:${shadowColors?.right}`,
      },
    });
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
    const {
      shadowColors,
      shadowWidth,
      verticalBorderWidth,
      horizontalBorderWidth,
    } = spreadsheet.theme?.splitLine;
    const x =
      position.x +
      cornerWidth +
      verticalBorderWidth +
      viewportWidth -
      shadowWidth;
    const y = position.y;
    this.addShape('rect', {
      attrs: {
        x,
        y,
        width: shadowWidth,
        height: cornerHeight + horizontalBorderWidth + viewportHeight,
        fill: `l (0) 0:${shadowColors?.right} 1:${shadowColors?.left}`,
      },
    });
  }
}

import { Group } from '@antv/g-canvas';
import { translateGroup } from '@/facet/utils';
import { FrameConfig } from '@/common/interface';

export class Frame extends Group {
  cfg: FrameConfig;

  constructor(cfg: FrameConfig) {
    super(cfg);
    this.render();
  }

  public layout() {
    // corner底部的横线条
    this.addCornerBottomBorder();
    // corner右边的竖线条
    this.addCornerRightBorder();
    // 一级纵向分割线右侧的shadow
    this.addSplitLineRightShadow();
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

  public onChangeShadowVisibility(
    scrollX: number,
    maxScrollX: number,
    cornerRightShadow: boolean,
  ) {
    const visible = scrollX < maxScrollX;
    if (cornerRightShadow) {
      this.cfg.showCornerRightShadow = visible;
    } else {
      this.cfg.showViewPortRightShadow = visible;
    }
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
    const { width, height, viewportHeight, position, spreadsheet } = cfg;
    const splitLine = spreadsheet.theme?.splitLine;
    const x = position.x + width;
    const y1 = position.y;
    const y2 = position.y + height + viewportHeight;
    this.addShape('line', {
      attrs: {
        x1: x,
        y1,
        x2: x,
        y2,
        stroke: splitLine.verticalBorderColor,
        lineWidth: splitLine.verticalBorderWidth,
        opacity: splitLine.verticalBorderColorOpacity,
      },
    });
  }

  private addCornerBottomBorder() {
    const cfg = this.cfg;
    const {
      width,
      height,
      viewportWidth,
      position,
      scrollX,
      scrollContainsRowHeader,
      spreadsheet,
    } = cfg;
    const splitLine = spreadsheet.theme?.splitLine;
    const x1 = position.x;
    const x2 =
      x1 + width + viewportWidth + (scrollContainsRowHeader ? scrollX : 0);
    const y = position.y + height - 1;
    this.addShape('line', {
      attrs: {
        x1,
        y1: y,
        x2,
        y2: y,
        stroke: splitLine.horizontalBorderColor,
        lineWidth: splitLine.horizontalBorderWidth,
        opacity: splitLine.horizontalBorderColorOpacity,
      },
    });
  }

  private addSplitLineRightShadow() {
    const cfg = this.cfg;
    const {
      width,
      height,
      viewportHeight,
      position,
      isPivotMode,
      spreadsheet,
      showViewPortRightShadow,
    } = cfg;

    if (!isPivotMode) {
      return;
    }
    const splitLine = spreadsheet.theme?.splitLine;
    if (
      splitLine.showShadow &&
      showViewPortRightShadow &&
      this.cfg.spreadsheet.isFrozenRowHeader()
    ) {
      const x = position.x + width;
      const y = position.y;
      this.addShape('rect', {
        attrs: {
          x,
          y,
          width: splitLine.shadowWidth,
          height: viewportHeight + height,
          fill: `l (0) 0:${splitLine.shadowColors?.left} 1:${splitLine.shadowColors?.right}`,
        },
      });
    }
  }
}

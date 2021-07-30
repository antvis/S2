import { Group } from '@antv/g-canvas';
import _ from 'lodash';
import { translateGroup } from '../utils';

export class Frame extends Group {
  constructor(cfg: any) {
    super(cfg);
    this.render();
  }

  public layout() {
    // corner底部的横线条
    this.addCornerBottomBorder();
    // corner右边的竖线条
    this.addCornerRightBorder();
    // viewport/panel右边的渐变框
    this.addViewPortRightShadowIfNeeded();
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
    // 是否是交叉表
    const { isPivotMode } = cfg;
    // 明细表啥也不要
    if (!isPivotMode) {
      return;
    }
    const { width, height, viewportHeight, position, spreadsheet } = cfg;
    const splitLine = _.get(spreadsheet, 'theme.splitLine');
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
        opacity: splitLine.verticalBorderOpacity,
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
    const splitLine = _.get(spreadsheet, 'theme.splitLine');
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
        opacity: splitLine.horizontalBorderOpacity,
      },
    });
  }

  private addViewPortRightShadowIfNeeded() {
    const cfg = this.cfg;
    const {
      width,
      height,
      viewportWidth,
      viewportHeight,
      position,
      showViewPortRightShadow,
      scrollX,
      spreadsheet,
    } = cfg;
    const splitLine = _.get(spreadsheet, 'theme.splitLine');
    if (splitLine.showRightShadow || showViewPortRightShadow) {
      const x =
        position.x +
        width +
        viewportWidth -
        splitLine.shadowWidth +
        (scrollX || 0);
      const y = position.y + height;
      this.addShape('rect', {
        attrs: {
          x,
          y,
          width: splitLine.shadowWidth,
          height: viewportHeight,
          fill: `l (0) 0:${splitLine.shadowColors[0]} 1:${splitLine.shadowColors[1]}`,
        },
      });
    }
  }

  private addSplitLineRightShadow() {
    const cfg = this.cfg;
    const {
      width,
      height,
      viewportHeight,
      position,
      spreadsheet,
      showViewPortRightShadow,
    } = cfg;
    const splitLine = _.get(spreadsheet, 'theme.splitLine');
    if (
      splitLine.showRightShadow &&
      showViewPortRightShadow &&
      this.cfg.spreadsheet.freezeRowHeader()
    ) {
      const x = position.x + width;
      const y = position.y;
      this.addShape('rect', {
        attrs: {
          x,
          y,
          width: splitLine.shadowWidth,
          height: viewportHeight + height,
          fill: `l (0) 0:${splitLine.shadowColors[1]} 1:${splitLine.shadowColors[0]}`,
        },
      });
    }
  }
}

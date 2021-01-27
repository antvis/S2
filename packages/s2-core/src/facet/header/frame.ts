import { Group } from '@antv/g-canvas';
import * as _ from '@antv/util';
import { translateGroup } from '../utils';

export class Frame extends Group {
  private shadowWidth = 8;

  constructor(cfg: any) {
    super(cfg);
    this.render();
  }

  public layout() {
    // corner右边的竖线条
    this.addCornerRightBorder();
    // corner/row右边的渐变框 --- 这个是和行头滚动条相关的shadow
    this.addCornerRightShadowIfNeeded();
    // 这个是整个垂直中线右侧的shadow（TODO 待统一命名）
    this.addCenterRightShadow();
    // viewport/panel右边的渐变框
    this.addViewPortRightShadowIfNeeded();
    // corner底部的横线条
    this.addBottomBorder();
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
    const { isSpreadsheetType } = cfg;
    // 明细表啥也不要
    if (!isSpreadsheetType) {
      return;
    }
    const { width, height, viewportHeight, position } = cfg;
    const x = position.x + width;
    const y1 = position.y;
    const y2 = position.y + height + viewportHeight;
    this.addShape('line', {
      attrs: {
        x1: x,
        y1,
        x2: x,
        y2,
        stroke: _.get(cfg.spreadsheet, 'theme.center.verticalBorderColor'),
        lineWidth: _.get(cfg.spreadsheet, 'theme.center.verticalBorderWidth'),
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
    } = cfg;
    if (showViewPortRightShadow) {
      const x =
        position.x + width + viewportWidth - this.shadowWidth + (scrollX || 0);
      const y = position.y + height;
      this.addShape('rect', {
        attrs: {
          x,
          y,
          width: this.shadowWidth,
          height: viewportHeight,
          fill: 'l (0) 0:rgba(0,0,0,0) 1:rgba(0,0,0,0.04)',
        },
      });
    }
  }

  private addCornerRightShadowIfNeeded() {
    const cfg = this.cfg;
    const {
      width,
      height,
      viewportHeight,
      position,
      showCornerRightShadow,
    } = cfg;
    if (
      showCornerRightShadow ||
      _.get(cfg.spreadsheet, 'theme.center.showCornerRightShadow')
    ) {
      const x = position.x + width - this.shadowWidth;
      const y = position.y + height;
      this.addShape('rect', {
        attrs: {
          x,
          y,
          width: this.shadowWidth,
          height: viewportHeight,
          fill: 'l (0) 0:rgba(0,0,0,0) 1:rgba(0,0,0,0.04)',
        },
      });
    }
  }

  private addCenterRightShadow() {
    const cfg = this.cfg;
    const { width, height, viewportHeight, position } = cfg;
    if (_.get(cfg.spreadsheet, 'theme.center.showCenterRightShadow')) {
      const x = position.x + width;
      const y = position.y;
      this.addShape('rect', {
        attrs: {
          x,
          y,
          width: _.get(cfg.spreadsheet, 'theme.center.centerRightShadowWidth'),
          height: viewportHeight + height,
          fill: 'l (0) 0:rgba(0,0,0,0.04) 1:rgba(0,0,0,0)',
        },
      });
    }
  }

  private addBottomBorder() {
    const cfg = this.cfg;
    const {
      width,
      height,
      viewportWidth,
      position,
      scrollX,
      scrollContainsRowHeader,
    } = cfg;
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
        stroke: _.get(cfg.spreadsheet, 'theme.center.horizontalBorderColor'),
        lineWidth: _.get(cfg.spreadsheet, 'theme.center.horizontalBorderWidth'),
      },
    });
  }
}

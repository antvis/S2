import { ColCell } from '@/cell';

export class CustomColCell extends ColCell {
  private lineConfig = {};

  private lineConfigStyle = {};

  initCell() {
    super.initCell();
    this.drawLeftBorder();
  }

  handleRestOptions(...[headerConfig, lineConfig, lineConfigStyle]) {
    this.headerConfig = headerConfig;
    this.lineConfig = lineConfig || {};
    this.lineConfigStyle = lineConfigStyle || {};
  }

  getCellArea() {
    const { x, y, height, width, parent } = this.meta;
    const tagHeight = 30; // 指标高度
    const tagWidth = 120; // 指标宽度
    if (parent?.id === 'root') {
      return {
        x,
        y: y + (height - tagHeight),
        height: tagHeight,
        width: tagWidth,
      };
    }
    return { x, y, height, width };
  }

  // 绘制背景
  drawBackgroundShape() {
    const { parent } = this.meta;
    if (parent?.id === 'root' && this.lineConfigStyle.stroke) {
      this.backgroundShape = this.addShape('rect', {
        attrs: {
          ...this.getCellArea(),
          fill: this.lineConfigStyle.stroke,
        },
      });
    } else {
      super.drawBackgroundShape();
    }
  }

  // 交互显示
  drawInteractiveBgShape() {
    const { parent } = this.meta;
    if (parent?.id === 'root') {
      return;
    }
    super.drawInteractiveBgShape();
  }

  // 绘制文本
  drawTextShape() {
    const { value, parent } = this.meta;
    if (parent?.id === 'root') {
      const position = this.getTextPosition();
      const textStyle = this.getTextStyle();
      this.textShape = this.addShape('text', {
        attrs: {
          x: position.x,
          y: position.y,
          text: value,
          fill: this.lineConfigStyle.stroke ? '#FFF' : textStyle.fill,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });
    } else {
      super.drawTextShape();
    }
  }

  drawLeftBorder() {
    const { x, y, children, parent, colIndex, value, height } = this.meta;
    const groupCache = this?.spreadsheet?.store?.get('groupCache') || {};
    const indexCache = this?.spreadsheet?.store?.get('indexCache') || {};
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      verticalBorderColorOpacity,
    } = this.getStyle().cell;
    if (parent?.id === 'root') {
      this.addShape('line', {
        attrs: {
          x1: x,
          y1: y + 10,
          x2: x,
          y2: y + height,
          stroke: this.lineConfigStyle.stroke || horizontalBorderColor,
          lineWidth: this.lineConfigStyle.lineWidth || horizontalBorderWidth,
        },
      });
      groupCache[children?.[0]?.value] = 1;
      this?.spreadsheet?.store?.set('groupCache', groupCache);
    } else if (groupCache[value]) {
      this.addShape('line', {
        attrs: {
          x1: x,
          y1: y,
          x2: x,
          y2: y + height,
          stroke: this.lineConfigStyle.stroke || horizontalBorderColor,
          lineWidth: this.lineConfigStyle.lineWidth || horizontalBorderWidth,
        },
      });
    }
    if (parent?.parent?.id === 'root') {
      if (this.lineConfig[value]) {
        indexCache[colIndex + 1] = 1;
        this.spreadsheet?.store?.set('indexCache', indexCache);
      }
      if (indexCache[colIndex]) {
        this.addShape('line', {
          attrs: {
            x1: x,
            y1: y,
            x2: x,
            y2: y + height,
            stroke: this.lineConfigStyle.stroke || horizontalBorderColor,
            lineWidth: this.lineConfigStyle.lineWidth || horizontalBorderWidth,
            opacity: this.lineConfigStyle.opacity || verticalBorderColorOpacity,
          },
        });
      }
    }
  }
}

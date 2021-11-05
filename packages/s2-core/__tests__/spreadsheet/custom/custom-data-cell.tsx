import { DataCell } from '@/cell';
import { ID_SEPARATOR } from '@/common/constant';
import { measureTextWidth } from '@/utils/text';

export class CustomDataCell extends DataCell {
  private lineConfig = {};

  private lineConfigStyle = {};

  private customConditions = {};

  private textConfig = {};

  initCell() {
    super.initCell();
    this.drawLeftBorder();
    this.drawRightBorder();
  }

  handleRestOptions(options) {
    const { lineConfig, lineConfigStyle, conditions, textConfig } = options;
    this.lineConfig = lineConfig;
    this.lineConfigStyle = lineConfigStyle;
    this.customConditions = conditions;
    this.textConfig = textConfig;
  }

  // 自定义icon显示
  getIconStyle() {
    const tagName = Object.keys(this.customConditions).find((item) =>
      this.meta.colId?.includes(`root${ID_SEPARATOR}${item}${ID_SEPARATOR}`),
    );
    if (tagName) {
      this.conditions = {
        ...this.conditions,
        ...(this.customConditions?.[tagName] || []),
      };
    }
    return super.getIconStyle();
  }

  drawTextShape() {
    const { fieldValue } = this.meta;
    const tagName = Object.keys(this.textConfig).find((item) =>
      this.meta.colId?.includes(`root${ID_SEPARATOR}${item}${ID_SEPARATOR}`),
    );

    if (tagName) {
      const { getCustomFormattedValue, getCustomTextStyle } =
        this.textConfig[tagName] || {};
      const { formattedValue: defaultFormattedValue } =
        this.getFormattedFieldValue();
      let formattedValue = defaultFormattedValue;
      if (getCustomFormattedValue) {
        formattedValue = getCustomFormattedValue(fieldValue);
      }
      const textStyle = this.getTextStyle();
      this.actualTextWidth = measureTextWidth(formattedValue, textStyle);
      const position = this.getTextPosition();

      this.textShape = this.addShape('text', {
        attrs: {
          x: position.x,
          y: position.y,
          text: formattedValue,
          ...textStyle,
          ...(getCustomTextStyle(fieldValue, textStyle) || {}),
        },
      });
    } else {
      super.drawTextShape();
    }
  }

  drawLeftBorder() {
    const { x, y, colIndex, valueField, height } = this.meta;
    const indexCache = this.spreadsheet.store.get('dataIndexCache') || {};
    const valueLength = this.spreadsheet.dataCfg.fields.values.length;
    const currentConfig = this.lineConfig[valueField];
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      verticalBorderColorOpacity,
    } = this.getStyle().cell;

    if (colIndex % valueLength === 0) {
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
    if (currentConfig) {
      indexCache[colIndex + 1] = 1;
      this.spreadsheet?.store?.set('dataIndexCache', indexCache);
    }
  }

  drawRightBorder() {
    const { x, y, width, valueField, colIndex, height } = this.meta;
    const valueLength = this.spreadsheet.dataCfg.fields.values.length;
    const currentConfig = this.lineConfig[valueField];
    const {
      horizontalBorderColor,
      horizontalBorderWidth,
      verticalBorderColorOpacity,
    } = this.getStyle().cell;
    if (currentConfig) {
      this.addShape('line', {
        attrs: {
          x1: x + width,
          y1: y,
          x2: x + width,
          y2: y + height,
          stroke: this.lineConfigStyle.stroke || horizontalBorderColor,
          lineWidth: this.lineConfigStyle.lineWidth || horizontalBorderWidth,
          opacity: this.lineConfigStyle.opacity || verticalBorderColorOpacity,
        },
      });
    }
    if ((colIndex + 1) % valueLength === 0) {
      this.addShape('line', {
        attrs: {
          x1: x + width,
          y1: y,
          x2: x + width,
          y2: y + height,
          stroke: this.lineConfigStyle.stroke || horizontalBorderColor,
          lineWidth: this.lineConfigStyle.lineWidth || horizontalBorderWidth,
        },
      });
    }
  }
}

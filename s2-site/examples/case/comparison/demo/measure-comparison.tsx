/* eslint-disable max-classes-per-file */
import React from 'react';
import ReactDOM from 'react-dom';
import {
  ColCell,
  DataCell,
  CornerCell,
  Frame,
  ID_SEPARATOR,
  measureTextWidth,
} from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const UP_COLOR = '#F46649';
const DOWN_COLOR = '#2AA491';
const TAG_HEIGHT = 20; // 指标高度
const TAG_WIDTH = 80; // 指标宽度

class CustomColCell extends ColCell {
  lineConfig = {};

  lineConfigStyle = {};

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
    if (parent?.id === 'root') {
      return {
        x,
        y: y + (height - TAG_HEIGHT),
        height: TAG_HEIGHT,
        width: TAG_WIDTH,
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
          y1: y + height - TAG_HEIGHT,
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

class CustomDataCell extends DataCell {
  lineConfig = {};

  lineConfigStyle = {};

  customConditions = {};

  textConfig = {};

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
    const { x, y, width, valueField, colIndex, height, spreadsheet } =
      this.meta;
    const valueLength = spreadsheet.dataCfg.fields.values.length;
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
    const tagLength = [...(spreadsheet.dataSet.colPivotMeta || [])].length;
    const shouldAddRightLine =
      (colIndex + 1) % valueLength === 0 &&
      colIndex + 1 !== tagLength * valueLength; // 除了表格最后一列,每个 tag 最后一个子列加 right line
    if (shouldAddRightLine) {
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

class CustomFrame extends Frame {
  layout() {
    super.layout();
    // corner右边的竖线条
    this.addCornerRightBorder();
  }

  addCornerRightBorder() {
    const {
      width,
      height,
      viewportHeight,
      position,
      spreadsheet,
      lineConfigStyle,
    } = this.cfg;
    const {
      verticalBorderColor,
      verticalBorderWidth,
      verticalBorderColorOpacity,
    } = spreadsheet.theme?.splitLine || {};
    const x = position.x + width;
    const y1 = position.y;
    const y2 = position.y + height + viewportHeight;
    const { scrollX } = spreadsheet.facet.getScrollOffset();

    if (scrollX > 0) {
      // 滚动时使用默认的颜色
      this.addShape('line', {
        attrs: {
          x1: x,
          y1: y1 + height / 2 - TAG_HEIGHT,
          x2: x,
          y2,
          stroke: verticalBorderColor,
          lineWidth: verticalBorderWidth,
          opacity: verticalBorderColorOpacity,
        },
      });
    } else {
      this.addShape('line', {
        attrs: {
          x1: x,
          y1: y1 + height / 2 - TAG_HEIGHT,
          x2: x,
          y2,
          stroke: lineConfigStyle?.stroke || verticalBorderColor,
          lineWidth: lineConfigStyle?.lineWidth || verticalBorderWidth,
        },
      });
    }
  }

  addSplitLineRightShadow() {
    const {
      width,
      height,
      viewportHeight,
      position,
      isPivotMode,
      spreadsheet,
      showViewPortRightShadow,
    } = this.cfg;

    const { scrollX } = spreadsheet.facet.getScrollOffset();
    if (!isPivotMode || scrollX === 0) {
      return;
    }
    // 滚动时使用默认的颜色
    const { showRightShadow, shadowWidth, shadowColors } =
      spreadsheet.theme?.splitLine || {};
    if (
      showRightShadow &&
      showViewPortRightShadow &&
      spreadsheet.isFrozenRowHeader()
    ) {
      const x = position.x + width;
      const y = position.y;
      this.addShape('rect', {
        attrs: {
          x,
          y: y + height / 2,
          width: shadowWidth,
          height: viewportHeight + height - height / 2,
          fill: `l (0) 0:${shadowColors?.left} 1:${shadowColors?.right}`,
        },
      });
    }
  }
}

class CustomCornelCell extends CornerCell {
  drawTextShape() {
    if (this.meta.cornerType === 'col') {
      return;
    }
    super.drawTextShape();
  }

  drawBackgroundShape() {
    const { backgroundColorOpacity, backgroundColor } = this.getStyle().cell;
    const attrs = {
      ...this.getCellArea(),
      fill: this.meta.cornerType === 'col' ? '#FFF' : backgroundColor,
      opacity: backgroundColorOpacity,
    };
    this.backgroundShape = this.addShape('rect', {
      attrs,
    });
  }

  drawBorderShape() {}
}

fetch('https://assets.antv.antgroup.com/s2/index-comparison.json')
  .then((res) => res.json())
  .then((data) => {
    const s2DataConfig = {
      fields: {
        rows: ['type'],
        columns: ['tag'],
        values: ['price', 'uv', 'pv', 'click_uv'],
      },
      meta: [
        {
          field: 'type',
          name: '服装服饰',
        },
        {
          field: 'price',
          name: '销售量',
        },
        {
          field: 'uv',
          name: '搜索uv',
        },
        {
          field: 'pv',
          name: '搜索pv',
        },
        {
          field: 'click_uv',
          name: '点击uv',
        },
      ],
      data,
    };
    const getIcon = (fieldValue) => {
      return parseFloat(fieldValue) > 0
        ? 'CellUp'
        : fieldValue < 0
        ? 'CellDown'
        : '';
    };
    const conditionsIcon = [
      {
        field: 'price',
        mapping(fieldValue) {
          return {
            icon: getIcon(fieldValue),
          };
        },
      },
      {
        field: 'uv',
        mapping(fieldValue) {
          return {
            icon: getIcon(fieldValue),
          };
        },
      },
      {
        field: 'click_uv',
        mapping(fieldValue) {
          return {
            icon: getIcon(fieldValue),
          };
        },
      },
    ];
    // 自定义文字样式
    const getCustomTextStyle = (value, textStyle) => {
      return {
        fill:
          parseFloat(value) > 0
            ? UP_COLOR
            : parseFloat(value) < 0
            ? DOWN_COLOR
            : textStyle?.fill,
      };
    };
    // 列分组竖线样式配置
    const lineConfigStyle = {
      stroke: '#3471F9',
      lineWidth: 1,
      opacity: 0.5,
    };
    // 列分组配置
    const lineConfig = {
      price: 1,
      pv: 1,
    };
    const s2Options = {
      width: 600,
      height: 480,
      showDefaultHeaderActionIcon: false,
      tooltip: {
        showTooltip: false,
      },
      colCell: (node, spreadsheet, ...restOptions) => {
        return new CustomColCell(
          node,
          spreadsheet,
          ...restOptions,
          lineConfig,
          lineConfigStyle,
        );
      },
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta.spreadsheet, {
          lineConfig,
          lineConfigStyle,
          conditions: {
            周环比差值: {
              icon: conditionsIcon,
            },
            周环比率: {
              icon: conditionsIcon,
            },
          },
          textConfig: {
            周环比差值: {
              // 自定义文字样式
              getCustomTextStyle,
            },
            周环比率: {
              // 自定义文字formatted
              getCustomFormattedValue: (value) => {
                return `${parseFloat(value)?.toFixed(4) * 100}%`;
              },
              // 自定义文字样式
              getCustomTextStyle,
            },
          },
        });
      },
      cornerCell: (node, s2, headConfig) => {
        return new CustomCornelCell(node, s2, headConfig);
      },
      frame: (cfg) => {
        return new CustomFrame({ ...cfg, lineConfigStyle });
      },
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        sheetType="pivot"
      />,
      document.getElementById('container'),
    );
  });

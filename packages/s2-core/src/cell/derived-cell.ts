import { Group } from '@antv/g-canvas';
import { get } from 'lodash';
import { measureTextWidth, getEllipsisText } from '../utils/text';
import { GuiIcon } from '../common/icons';
import { STRATEGY_ICON_WIDTH, STRATEGY_PADDING } from '../common/constant';
import { renderRect } from '../utils/g-renders';
import { SpreadSheet } from 'src/sheet-type';

/**
 * Create By Bruce Too
 * On 2020-05-27
 * 衍生指标的设计
 * _ _ _ _ _ _ _ _ _ _
 * |      |           |
 * | icon | 衍生值     |
 * | _ _ _|_ _ _ _ _ _|
 */
export interface DerivedCellParams {
  x: number;
  y: number;
  height: number;
  width: number;
  up: boolean;
  text: string;
  spreadsheet: SpreadSheet;
}

export class DerivedCell extends Group {
  public constructor(params: DerivedCellParams) {
    super(params);
    this.initCell(params);
  }

  private initCell(params: DerivedCellParams) {
    const { x, y, text, up, spreadsheet, height, width } = params;
    let icon = 'CellUp';
    if (up) {
      icon = 'CellUp';
    } else {
      icon = 'CellDown';
    }

    if (SpreadSheet.DEBUG_ON) {
      renderRect(x, y, width, height, '#f11', 0, this);
    }

    const showIcon = spreadsheet.options.style.colCfg.showDerivedIcon;
    const textStyle = get(spreadsheet, 'theme.view.text');
    if (!text) {
      this.addShape('text', {
        attrs: {
          x: x + width,
          y: y + height / 2,
          text: '-',
          ...textStyle,
          textAlign: 'end',
        },
      });
      return;
    }

    // 1. 文本居右
    const textX = x + width;
    const textY = y + height / 2;
    let maxTextWidth = width;
    let renderText;
    if (showIcon) {
      maxTextWidth = width - STRATEGY_ICON_WIDTH + STRATEGY_PADDING / 2;
      // 显示icon去掉负号
      renderText = getEllipsisText(text + '', maxTextWidth, textStyle).replace(
        '-',
        '',
      );
    } else {
      renderText = getEllipsisText(text + '', maxTextWidth, textStyle);
    }
    this.addShape('text', {
      attrs: {
        x: textX,
        y: textY,
        text: renderText,
        ...textStyle,
        textAlign: 'end',
        fill: up ? '#F46649' : '#2AA491',
      },
    });

    if (showIcon) {
      // 2. 红涨绿跌 icon
      const textWidth = measureTextWidth(renderText, textStyle);
      const padding = STRATEGY_PADDING / 2;
      const iconWH = STRATEGY_ICON_WIDTH;
      const iconX = x + width - textWidth - padding - iconWH;
      const iconY = y + height / 2 - iconWH / 2;
      this.add(
        new GuiIcon({
          type: icon,
          x: iconX,
          y: up ? iconY - 1 : iconY,
          width: iconWH,
          height: iconWH,
          fill: up ? '#F46649' : '#2AA491',
        }),
      );
    }
  }
}

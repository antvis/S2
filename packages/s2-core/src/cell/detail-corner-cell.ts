/**
 * Create By Bruce Too
 * On 2019-12-03
 */
import { getEllipsisText, measureTextWidth } from '../utils/text';
import * as _ from 'lodash';
import {
  DEFAULT_PADDING,
  ICON_RADIUS,
  KEY_SERIES_NUMBER_NODE,
} from '../common/constant';
import { addDetailTypeSortIcon } from '../facet/layout/util/add-detail-type-sort-icon';
import { CornerCell } from '.';

export class DetailCornerCell extends CornerCell {
  protected drawCellText() {
    const { position } = this.headerConfig;
    const {
      label,
      x,
      y,
      width: cellWidth,
      height: cellHeight,
      key,
      seriesNumberWidth,
    } = this.meta;

    const seriesNumberW = seriesNumberWidth || 0;
    const textStyle = _.get(
      this.headerConfig,
      'spreadsheet.theme.header.bolderText',
    );
    const text = getEllipsisText(label, cellWidth - seriesNumberW, textStyle);
    let textAlign = 'end';
    let textX =
      position.x + x + cellWidth - DEFAULT_PADDING * 2 - ICON_RADIUS * 2;
    const iconX = textX + DEFAULT_PADDING;
    if (key === KEY_SERIES_NUMBER_NODE) {
      textAlign = 'center';
      textX = position.x + x + cellWidth / 2;
    }
    const textY = position.y + y + cellHeight / 2;
    // first line
    this.addShape('text', {
      attrs: {
        x: textX,
        y: textY,
        text,
        textAlign,
        ...textStyle,
        appendInfo: {
          isCornerHeaderText: true, // 标记为行头文本，方便做链接跳转直接识别
          cellData: this.meta,
        },
      },
    });

    // listSheet type and not series number node
    if (key !== KEY_SERIES_NUMBER_NODE) {
      addDetailTypeSortIcon(
        this,
        this.headerConfig.spreadsheet,
        iconX,
        textY,
        key,
      );
    }
  }
}

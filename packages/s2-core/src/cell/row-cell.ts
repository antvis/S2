import type { SimpleBBox } from '@antv/g-canvas';
import { getAdjustPosition } from '../utils/text-absorption';
import { getFrozenRowCfgPivot } from '../facet/utils';
import type { BaseHeaderConfig } from '../facet/header/base';
import { BaseRowCell } from './base-row-cell';

/**
 * Adapting the frozen first row for cells pivot table
 */
export class RowCell extends BaseRowCell {
  /**
   * To indicate whether the current node is a frozen node
   *
   * PS: It is a specific config for the cell node, so it should not be extended in the headerConfig.
   */
  protected frozenRowCell: boolean;

  protected handleRestOptions(
    ...[headerConfig, ...options]: [BaseHeaderConfig, boolean]
  ) {
    super.handleRestOptions(headerConfig, options);
    this.frozenRowCell = options[0];
  }

  protected getAdjustTextAreaHeight(
    textArea: SimpleBBox,
    scrollY: number,
    viewportHeight: number,
  ): number {
    const correctY = textArea.y - this.getFrozenFirstRowHeight();
    let adjustTextAreaHeight = textArea.height;
    if (
      !this.spreadsheet.facet.vScrollBar &&
      correctY + textArea.height > scrollY + viewportHeight
    ) {
      adjustTextAreaHeight = scrollY + viewportHeight - correctY;
    }
    return adjustTextAreaHeight;
  }

  protected calculateTextY({
    textArea,
    adjustTextAreaHeight,
  }: {
    textArea: SimpleBBox;
    adjustTextAreaHeight: number;
  }): number {
    const { scrollY, viewportHeight } = this.headerConfig;
    const { fontSize } = this.getTextStyle();
    return getAdjustPosition(
      textArea.y,
      adjustTextAreaHeight,
      // viewportLeft: start at the frozen row position
      scrollY + this.getFrozenFirstRowHeight(),
      viewportHeight,
      fontSize,
    );
  }

  protected getResizeClipAreaBBox(): SimpleBBox {
    return {
      ...super.getResizeClipAreaBBox(),
      y: this.getFrozenFirstRowHeight(),
    };
  }

  private getFrozenFirstRowHeight(): number {
    if (this.frozenRowCell) {
      // frozen row cell
      return 0;
    }
    const { spreadsheet } = this.headerConfig;
    const { facet } = spreadsheet;
    const { frozenRowHeight } = getFrozenRowCfgPivot(
      spreadsheet.options,
      facet?.layoutResult?.rowNodes,
    );
    return frozenRowHeight;
  }
}

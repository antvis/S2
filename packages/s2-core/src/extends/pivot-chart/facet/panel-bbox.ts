import { PanelBBox as OriginPanelBBox } from '@antv/s2';
import { head } from 'lodash';

export class PanelBBox extends OriginPanelBBox {
  protected override getPanelHeight(): number {
    const scrollBarSize = this.spreadsheet.theme.scrollBar!.size;
    const { height: canvasHeight } = this.spreadsheet.options;

    const { colAxisNodes } = this.layoutResult;
    const colAxisHeight = head(colAxisNodes)?.height ?? 0;

    const panelHeight = Math.max(
      0,
      canvasHeight! - this.y - scrollBarSize! - colAxisHeight,
    );

    return panelHeight;
  }
}

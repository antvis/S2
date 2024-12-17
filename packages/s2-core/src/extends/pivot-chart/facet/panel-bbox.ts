import { PanelBBox as OriginPanelBBox } from '@antv/s2';

export class PanelBBox extends OriginPanelBBox {
  protected override getPanelHeight(): number {
    const { height: canvasHeight } = this.spreadsheet.options;

    const { axisColsHierarchy } = this.layoutResult;
    const colAxisHeight = axisColsHierarchy?.height ?? 0;

    const panelHeight = Math.max(0, canvasHeight! - this.y - colAxisHeight);

    return panelHeight;
  }
}

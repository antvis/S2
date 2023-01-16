import type { SpreadSheet } from '../../sheet-type';

export interface FrameConfig {
  position: {
    x: number;
    y: number;
  };
  scrollX?: number;
  cornerWidth: number;
  cornerHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  showViewportLeftShadow: boolean;
  showViewportRightShadow: boolean;
  spreadsheet: SpreadSheet;
}

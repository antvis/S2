import { SpreadSheet } from '@/sheet-type';
export interface FrameConfig {
  position: {
    x: number;
    y: number;
  };
  scrollX?: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
  showViewportLeftShadow: boolean;
  showViewportRightShadow: boolean;
  scrollContainsRowHeader: boolean;
  isPivotMode: boolean;
  spreadsheet: SpreadSheet;
}

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
  showViewPortLeftShadow: boolean;
  showViewPortRightShadow: boolean;
  scrollContainsRowHeader: boolean;
  isPivotMode: boolean;
  spreadsheet: SpreadSheet;
}

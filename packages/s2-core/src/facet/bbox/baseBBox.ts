import { BBox } from '@antv/g-canvas';
import { BaseFacet } from '@/facet/base-facet';
import { LayoutResult } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';

// BBox相同数据结构，便于已有逻辑的直接复用
export abstract class BaseBBox implements BBox {
  protected spreadsheet: SpreadSheet;

  protected facet: BaseFacet;

  protected layoutResult: LayoutResult;

  x = 0;

  y = 0;

  minX = 0;

  minY = 0;

  maxX = 0;

  maxY = 0;

  width = 0;

  height = 0;

  // 记录未裁剪时的原始宽高
  originalWidth = 0;

  originalHeight = 0;

  // 视口宽高，数据少时可能小于 bbox 的宽高
  viewportHeight = 0;

  viewportWidth = 0;

  constructor(facet: BaseFacet, autoCalculateBBoxWhenCreated = false) {
    this.facet = facet;
    this.spreadsheet = facet.spreadsheet;
    this.layoutResult = facet.layoutResult;

    if (autoCalculateBBoxWhenCreated) {
      this.calculateBBox();
    }
  }

  abstract calculateBBox(): void;
}

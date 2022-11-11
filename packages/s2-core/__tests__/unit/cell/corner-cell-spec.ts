/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createPivotSheet } from 'tests/util/helpers';
import { CornerCell } from './../../../src/cell/corner-cell';
import type { Node } from '@/facet/layout/node';
import type { SpreadSheet } from '@/sheet-type';

describe('Corner Cell Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = createPivotSheet({ width: 200, height: 200 });
    s2.render();
  });

  const node = {
    isLeaf: false,
    x: 0,
    y: 0,
    height: 30,
    width: 200,
  } as unknown as Node;

  test('should call drawTextShape after called drawCellText', () => {
    const cornerCell = new CornerCell(node, s2, {
      position: {},
    });

    const drawTextShapeSpy = jest
      // @ts-ignore
      .spyOn(cornerCell, 'drawTextShape')
      .mockImplementationOnce(() => true);

    // @ts-ignore
    cornerCell.drawCellText();

    expect(drawTextShapeSpy).toHaveBeenCalledTimes(1);
  });
});

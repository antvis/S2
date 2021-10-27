import { getTextPosition } from '@/utils/text';
import { CellBoxCfg } from '@/common/interface';

describe('Text Utils Tets', () => {
  describe('getTextPosition', () => {
    it('returns the "leftTop" text position', () => {
      const props = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        textAlign: 'left',
        textBaseline: 'top',
        padding: {
          top: 12,
          right: 8,
          bottom: 12,
          left: 8,
        },
      } as CellBoxCfg;
      const results = getTextPosition(props);
      expect(results).toEqual({
        x: 8,
        y: 12,
      });
    });
    it('returns the "rightBottom" text position', () => {
      const props = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        textAlign: 'right',
        textBaseline: 'bottom',
        padding: {
          top: 12,
          right: 8,
          bottom: 12,
          left: 8,
        },
      } as CellBoxCfg;
      const results = getTextPosition(props);
      expect(results).toEqual({
        x: 92,
        y: 88,
      });
    });
  });
  it('returns the "centerMiddle" text position', () => {
    const props = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      textAlign: 'center',
      textBaseline: 'middle',
      padding: {
        top: 12,
        right: 8,
        bottom: 12,
        left: 8,
      },
    } as CellBoxCfg;
    const results = getTextPosition(props);
    expect(results).toEqual({
      x: 50,
      y: 50,
    });
  });
});

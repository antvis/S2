import {
  CellBorderPosition,
  CellClipBox,
  type IconTheme,
} from '@/common/interface';
import type { SimpleBBox } from '@/engine';
import {
  getCellBoxByType,
  getHorizontalTextIconPosition,
} from '@/utils/cell/cell';

describe('Cell Content Test', () => {
  const cfg = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
  const cellStyle = {
    horizontalBorderWidth: 10,
    verticalBorderWidth: 20,
    padding: {
      top: 12,
      right: 12,
      bottom: 8,
      left: 8,
    },
  };

  test('should return border area', () => {
    const results = getCellBoxByType(
      cfg,
      [CellBorderPosition.LEFT, CellBorderPosition.TOP],
      cellStyle,
      CellClipBox.BORDER_BOX,
    );

    expect(results).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  });
  test('should return padding area', () => {
    const results = getCellBoxByType(
      cfg,
      [CellBorderPosition.LEFT, CellBorderPosition.TOP],
      cellStyle,
      CellClipBox.PADDING_BOX,
    );

    expect(results).toEqual({
      x: 20,
      y: 10,
      width: 80,
      height: 90,
    });
  });
  test('should return content area', () => {
    const results = getCellBoxByType(
      cfg,
      [CellBorderPosition.LEFT, CellBorderPosition.TOP],
      cellStyle,
      CellClipBox.CONTENT_BOX,
    );

    expect(results).toEqual({
      x: 28,
      y: 22,
      width: 60,
      height: 70,
    });
  });
});

describe('Text and Icon area Test', () => {
  const contentBBox: SimpleBBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  const iconStyle: IconTheme = {
    margin: {
      left: 10,
      right: 10,
    },
    size: 10,
  };

  test.each([
    {
      textAlign: 'left',
      result: {
        leftIconX: 0,
        textX: 0,
        rightIconX: 50,
      },
    },
    {
      textAlign: 'center',
      result: {
        leftIconX: 25,
        textX: 50,
        rightIconX: 75,
      },
    },
    {
      textAlign: 'right',
      result: {
        leftIconX: 50,
        textX: 100,
        rightIconX: 100,
      },
    },
  ])(
    'should return correct coordinates when textAlign is %s without icon',
    ({ textAlign, result }) => {
      expect(
        getHorizontalTextIconPosition({
          bbox: contentBBox,
          textAlign: textAlign as any,
          textWidth: 50,
          iconStyle,
          groupedIcons: { left: [], right: [] },
        }),
      ).toEqual(result);
    },
  );

  test.each([
    {
      textAlign: 'left',
      result: {
        leftIconX: 0,
        textX: 20,
        rightIconX: 70,
      },
    },
    {
      textAlign: 'center',
      result: {
        leftIconX: 15,
        textX: 60,
        rightIconX: 85,
      },
    },
    {
      textAlign: 'right',
      result: {
        leftIconX: 30,
        textX: 100,
        rightIconX: 100,
      },
    },
  ])(
    'should return correct coordinates when textAlign is %s with left icons',
    ({ textAlign, result }) => {
      expect(
        getHorizontalTextIconPosition({
          bbox: contentBBox,
          textAlign: textAlign as any,
          textWidth: 50,
          iconStyle,
          groupedIcons: {
            left: [{ name: 'left', position: 'left' }],
            right: [],
          },
        }),
      ).toEqual(result);
    },
  );

  test.each([
    {
      textAlign: 'left',
      result: {
        leftIconX: 0,
        textX: 0,
        rightIconX: 60,
      },
    },
    {
      textAlign: 'center',
      result: {
        leftIconX: 15,
        textX: 40,
        rightIconX: 75,
      },
    },
    {
      textAlign: 'right',
      result: {
        leftIconX: 30,
        textX: 80,
        rightIconX: 90,
      },
    },
  ])(
    'should return correct coordinates when textAlign is %s with right icons',
    ({ textAlign, result }) => {
      expect(
        getHorizontalTextIconPosition({
          bbox: contentBBox,
          textAlign: textAlign as any,
          textWidth: 50,
          iconStyle,
          groupedIcons: {
            left: [],
            right: [{ name: 'right', position: 'right' }],
          },
        }),
      ).toEqual(result);
    },
  );

  test.each([
    {
      textAlign: 'left',
      result: {
        leftIconX: 0,
        textX: 20,
        rightIconX: 80,
      },
    },
    {
      textAlign: 'center',
      result: {
        leftIconX: 5,
        textX: 50,
        rightIconX: 85,
      },
    },
    {
      textAlign: 'right',
      result: {
        leftIconX: 10,
        textX: 80,
        rightIconX: 90,
      },
    },
  ])(
    'should return correct coordinates when textAlign is %s with left and right icons',
    ({ textAlign, result }) => {
      expect(
        getHorizontalTextIconPosition({
          bbox: contentBBox,
          textAlign: textAlign as any,
          textWidth: 50,
          iconStyle,
          groupedIcons: {
            left: [{ name: 'left', position: 'left' }],
            right: [{ name: 'right', position: 'right' }],
          },
        }),
      ).toEqual(result);
    },
  );
});

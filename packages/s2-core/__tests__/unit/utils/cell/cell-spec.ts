import { CellBorderPosition, CellClipBox } from '@/common/interface';
import type { SimpleBBox } from '@/engine';
import {
  getCellBoxByType,
  getMaxTextWidth,
  getFixedTextIconPosition,
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

describe('Max Text Width Calculation Test', () => {
  test('should  return max text width without icon', () => {
    expect(getMaxTextWidth(100)).toEqual(100);
  });

  test('should  return max text width with icon', () => {
    expect(
      getMaxTextWidth(100, {
        size: 10,
        margin: { left: 10, right: 8 },
      }),
    ).toEqual(72);
  });
});

describe('Text and Icon area Test', () => {
  const contentBBox: SimpleBBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  test('should return text when there is no icon cfg', () => {
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'left',
          textBaseline: 'top',
        },
        textWidth: 50,
      }),
    ).toEqual({
      text: {
        x: 0,
        y: 0,
      },
      icon: {
        x: 50,
        y: 0,
      },
    });
  });

  test('should return text when text is right and icon is right', () => {
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'right',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      }),
    ).toEqual({
      text: {
        x: 72,
        y: 0,
      },
      icon: {
        x: 82,
        y: 0,
      },
    });

    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'right',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        iconCount: 2,
      }),
    ).toEqual({
      text: {
        x: 52,
        y: 0,
      },
      icon: {
        x: 62,
        y: 0,
      },
    });
  });

  test('should return text when text is right and icon is left', () => {
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'right',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      }),
    ).toEqual({
      text: {
        x: 100,
        y: 0,
      },
      icon: {
        x: 32,
        y: 0,
      },
    });

    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'right',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        iconCount: 2,
      }),
    ).toEqual({
      text: {
        x: 100,
        y: 0,
      },
      icon: {
        x: 12,
        y: 0,
      },
    });
  });

  test('should return text when text is center and icon is left', () => {
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'center',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      }),
    ).toEqual({
      text: {
        x: 59,
        y: 0,
      },
      icon: {
        x: 16,
        y: 0,
      },
    });

    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'center',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        iconCount: 2,
      }),
    ).toEqual({
      text: {
        x: 69,
        y: 0,
      },
      icon: {
        x: 6,
        y: 0,
      },
    });
  });

  test('should return text when text is center and icon is right', () => {
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'center',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      }),
    ).toEqual({
      text: {
        x: 40,
        y: 0,
      },
      icon: {
        x: 75,
        y: 0,
      },
    });

    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'center',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        iconCount: 2,
      }),
    ).toEqual({
      text: {
        x: 30,
        y: 0,
      },
      icon: {
        x: 65,
        y: 0,
      },
    });
  });

  test('should return text when text is left and icon is left', () => {
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'left',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      }),
    ).toEqual({
      text: {
        x: 28,
        y: 0,
      },
      icon: {
        x: 10,
        y: 0,
      },
    });

    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'left',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        iconCount: 2,
      }),
    ).toEqual({
      text: {
        x: 48,
        y: 0,
      },
      icon: {
        x: 10,
        y: 0,
      },
    });
  });

  test('should return text when text is left and icon is right', () => {
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'left',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      }),
    ).toEqual({
      text: {
        x: 0,
        y: 0,
      },
      icon: {
        x: 60,
        y: 0,
      },
    });
    expect(
      getFixedTextIconPosition({
        bbox: contentBBox,
        textStyle: {
          textAlign: 'left',
          textBaseline: 'top',
        },
        textWidth: 50,
        iconStyle: {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        iconCount: 2,
      }),
    ).toEqual({
      text: {
        x: 0,
        y: 0,
      },
      icon: {
        x: 60,
        y: 0,
      },
    });
  });
});

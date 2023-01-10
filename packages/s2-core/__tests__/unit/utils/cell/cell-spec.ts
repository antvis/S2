import {
  CellBorderPosition,
  CellClipBox,
  type CellTheme,
} from '@/common/interface';
import type { AreaRange } from '@/common/interface/scroll';
import type { SimpleBBox } from '@/engine';
import {
  getCellBoxByType,
  getMaxTextWidth,
  getTextAndFollowingIconPosition,
  getTextAreaRange,
  getBorderPositionAndStyle,
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
  const content: SimpleBBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  test('should return text when there is no icon cfg', () => {
    expect(
      getTextAndFollowingIconPosition(
        content,
        {
          textAlign: 'left',
          textBaseline: 'top',
        },
        50,
      ),
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
      getTextAndFollowingIconPosition(
        content,
        {
          textAlign: 'right',
          textBaseline: 'top',
        },
        50,
        {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
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
      getTextAndFollowingIconPosition(
        content,
        {
          textAlign: 'right',
          textBaseline: 'top',
        },
        50,
        {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        2,
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'right',
          textBaseline: 'top',
        },
        50,
        {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'right',
          textBaseline: 'top',
        },
        50,
        {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        2,
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'center',
          textBaseline: 'top',
        },
        50,
        {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'center',
          textBaseline: 'top',
        },
        50,
        {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        2,
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'center',
          textBaseline: 'top',
        },
        50,
        {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'center',
          textBaseline: 'top',
        },
        50,
        {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        2,
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'left',
          textBaseline: 'top',
        },
        50,
        {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'left',
          textBaseline: 'top',
        },
        50,
        {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        2,
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'left',
          textBaseline: 'top',
        },
        50,
        {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
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
      getTextAndFollowingIconPosition(
        content,

        {
          textAlign: 'left',
          textBaseline: 'top',
        },
        50,
        {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
        2,
      ),
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

describe('Horizontal Scrolling Text Position Test', () => {
  const content: AreaRange = {
    start: 0,
    width: 100,
  };
  const textWidth = 20;

  test('should get center position when content is larger than viewport', () => {
    expect(
      getTextAreaRange(
        {
          start: 20,
          width: 50,
        },
        content,
        textWidth,
      ).start,
    ).toEqual(45);
  });

  test('should get center position when content is on the left of viewport', () => {
    // reset width is enough
    expect(
      getTextAreaRange(
        {
          start: 50,
          width: 100,
        },
        content,
        textWidth,
      ).start,
    ).toEqual(75);

    // reset width isn't enough
    expect(
      getTextAreaRange(
        {
          start: 90,
          width: 100,
        },
        content,
        textWidth,
      ).start,
    ).toEqual(90);
  });

  test('should get center position when content is on the right of viewport', () => {
    // reset width is enough
    expect(
      getTextAreaRange(
        {
          start: -50,
          width: 100,
        },
        content,
        textWidth,
      ).start,
    ).toEqual(25);

    // reset width isn't enough
    expect(
      getTextAreaRange(
        {
          start: -90,
          width: 100,
        },
        content,
        textWidth,
      ).start,
    ).toEqual(10);
  });

  test('should get center position when content is inside of viewport', () => {
    expect(
      getTextAreaRange(
        {
          start: -50,
          width: 200,
        },
        content,
        textWidth,
      ).start,
    ).toEqual(50);
  });

  test('should get border position', () => {
    const contentBox = {
      x: 0,
      y: 0,
      width: 200,
      height: 50,
    };
    const style = {
      verticalBorderColorOpacity: 1,
      verticalBorderColor: '#000',
      verticalBorderWidth: 2,
      horizontalBorderColor: '#000',
      horizontalBorderColorOpacity: 1,
      horizontalBorderWidth: 2,
    };

    expect(
      getBorderPositionAndStyle(
        CellBorderPosition.LEFT,
        contentBox,
        style as CellTheme,
      ).position,
    ).toEqual({
      x1: 1,
      y1: 0,
      x2: 1,
      y2: 50,
    });

    expect(
      getBorderPositionAndStyle(
        CellBorderPosition.RIGHT,
        contentBox,
        style as CellTheme,
      ).position,
    ).toEqual({
      x1: 199,
      y1: 0,
      x2: 199,
      y2: 50,
    });

    expect(
      getBorderPositionAndStyle(
        CellBorderPosition.TOP,
        contentBox,
        style as CellTheme,
      ).position,
    ).toEqual({
      x1: 0,
      y1: 1,
      x2: 200,
      y2: 1,
    });

    expect(
      getBorderPositionAndStyle(
        CellBorderPosition.BOTTOM,
        contentBox,
        style as CellTheme,
      ).position,
    ).toEqual({
      x1: 0,
      y1: 49,
      x2: 200,
      y2: 49,
    });
  });
});

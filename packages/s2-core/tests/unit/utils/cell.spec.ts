import {
  getContentArea,
  getMaxTextWidth,
  getTextAndIconPosition,
} from '@/utils/cell';
import { SimpleBBox } from '@antv/g-canvas';

describe('Cell Content Test', () => {
  test('should return content area', () => {
    const cfg = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    const padding = {
      top: 12,
      right: 12,
      bottom: 8,
      left: 8,
    };
    const results = getContentArea(cfg, padding);

    expect(results).toEqual({
      x: 8,
      y: 12,
      width: 80,
      height: 80,
    });
  });
});

describe('Max Text Width Calculation Test', () => {
  test('should  return max text width without icon', () => {
    expect(getMaxTextWidth(100)).toEqual(100);
  });

  test('should  return max text width with left icon', () => {
    expect(
      getMaxTextWidth(100, {
        position: 'left',
        size: 10,
        margin: { left: 10, right: 8 },
      }),
    ).toEqual(82);
  });

  test('should  return max text width with right icon', () => {
    expect(
      getMaxTextWidth(100, {
        position: 'right',
        size: 10,
        margin: { left: 10, right: 8 },
      }),
    ).toEqual(80);
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
      getTextAndIconPosition(content, 50, {
        textAlign: 'left',
        textBaseline: 'top',
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
      getTextAndIconPosition(
        content,
        50,
        {
          textAlign: 'right',
          textBaseline: 'top',
        },
        {
          position: 'right',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
    ).toEqual({
      text: {
        x: 80,
        y: 0,
      },
      icon: {
        x: 90,
        y: 0,
      },
    });
  });

  test('should return text when text is right and icon is left', () => {
    expect(
      getTextAndIconPosition(
        content,
        50,
        {
          textAlign: 'right',
          textBaseline: 'top',
        },
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
  });

  test('should return text when text is center and icon is left', () => {
    expect(
      getTextAndIconPosition(
        content,
        50,
        {
          textAlign: 'center',
          textBaseline: 'top',
        },
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
  });

  test('should return text when text is left and icon is left', () => {
    expect(
      getTextAndIconPosition(
        content,
        50,
        {
          textAlign: 'left',
          textBaseline: 'top',
        },
        {
          position: 'left',
          size: 10,
          margin: { left: 10, right: 8 },
        },
      ),
    ).toEqual({
      text: {
        x: 18,
        y: 0,
      },
      icon: {
        x: 0,
        y: 0,
      },
    });
  });
});

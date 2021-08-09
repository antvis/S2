import {
  getContentArea,
  getIconPosition,
  getTextAndIconArea,
  getTextPosition,
} from '@/utils/data-cell';
import { SimpleBBox } from '@antv/g-canvas';

describe('Data Cell Content Test', () => {
  test('should return content area', () => {
    const cfg = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      padding: {
        top: 12,
        right: 12,
        bottom: 8,
        left: 8,
      },
    };
    const results = getContentArea(cfg);

    expect(results).toEqual({
      x: 8,
      y: 12,
      width: 80,
      height: 80,
    });
  });
});

describe('Text and Icon area Test', () => {
  const bbox: SimpleBBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
  test('should return text when there is no icon cfg', () => {
    expect(getTextAndIconArea(bbox)).toEqual({
      text: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      icon: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    });
  });

  test('should return text when icon position is right', () => {
    expect(
      getTextAndIconArea(bbox, {
        iconPosition: 'right',
        size: 10,
        margin: {
          left: 4,
          right: 6,
        },
      }),
    ).toEqual({
      text: {
        x: 0,
        y: 0,
        width: 86,
        height: 100,
      },
      icon: {
        x: 90,
        y: 0,
        width: 10,
        height: 100,
      },
    });
  });
  test('should return text when icon position is left', () => {
    expect(
      getTextAndIconArea(bbox, {
        iconPosition: 'left',
        size: 10,
        margin: {
          left: 4,
          right: 6,
        },
      }),
    ).toEqual({
      text: {
        x: 16,
        y: 0,
        width: 84,
        height: 100,
      },
      icon: {
        x: 0,
        y: 0,
        width: 10,
        height: 100,
      },
    });
  });
});

describe('Text Position Test', () => {
  const bbox = { x: 0, y: 0, width: 100, height: 100 };

  test('should return "leftTop" area', () => {
    const results = getTextPosition(bbox, {
      textAlign: 'left',
      textBaseline: 'top',
    });

    expect(results).toEqual({
      x: 0,
      y: 0,
    });
  });

  test('should return "centerMiddle" area', () => {
    const results = getTextPosition(bbox, {
      textAlign: 'center',
      textBaseline: 'middle',
    });

    expect(results).toEqual({
      x: 50,
      y: 50,
    });
  });

  test('should return "rightBottom" area', () => {
    const results = getTextPosition(bbox, {
      textAlign: 'right',
      textBaseline: 'bottom',
    });

    expect(results).toEqual({
      x: 100,
      y: 100,
    });
  });
});

describe('Icon Position Test', () => {
  const bbox = { x: 0, y: 0, width: 100, height: 100 };
  const iconSize = 10;

  test('should return "top" area', () => {
    const results = getIconPosition(bbox, iconSize, 'top');

    expect(results).toEqual({
      x: 0,
      y: 0,
    });
  });

  test('should return "middle" area', () => {
    const results = getIconPosition(bbox, iconSize, 'middle');
    expect(results).toEqual({
      x: 0,
      y: 45,
    });
  });

  test('should return "bottom" area', () => {
    const results = getIconPosition(bbox, iconSize, 'bottom');
    expect(results).toEqual({
      x: 0,
      y: 90,
    });
  });
});

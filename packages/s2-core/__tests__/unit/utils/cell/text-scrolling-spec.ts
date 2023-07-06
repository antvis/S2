import type { AreaRange } from '@/common';
import { adjustTextIconPositionWhileScrolling } from '@/utils/cell/text-scrolling';
import { NormalizedAlign } from '@/utils/normalize';

describe('text-scrolling test', () => {
  const viewport: AreaRange = {
    start: 0,
    size: 100,
  };
  const iconEndSize = 10 + 5; // icon size + padding

  const padding = {
    start: 10,
    end: 10,
    betweenTextAndEndIcon: 5,
  };

  /**
   *   +----------------------------+
   *   |  +-------------+           |
   *   |  | text | icon |  viewport |
   *   |  +-------------+           |
   *   +----------------------------+
   */
  test('should get correct start point when cell is inside of viewport', () => {
    const content: AreaRange = { start: 20, size: 50 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 10,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: 20,
      iconStart: 20,
      iconEnd: 35,
    });
  });

  /**
   *         +-------------------+
   *  +------|------+            |
   *  | text | icon |   viewport |
   *  +------|------+            |
   *         +-------------------+
   */
  test('should get correct start point when cell is left of viewport [with enough area]', () => {
    const content: AreaRange = { start: -10, size: 50 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 10,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: 10,
      iconStart: 10,
      iconEnd: 25,
    });
  });

  test('should get correct start point when cell is left of viewport [without enough area]', () => {
    const content: AreaRange = { start: -30, size: 50 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 10,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: -5,
      iconStart: -5,
      iconEnd: 10,
    });
  });

  /**
   *   +-------------------+
   *   |            +------|------+
   *   | viewport   | text | icon |
   *   |            +------|------+
   *   +-------------------+
   */
  test('should get correct start point when cell is right of viewport [with enough area]', () => {
    const content: AreaRange = { start: 60, size: 50 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 10,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: 60,
      iconStart: 60,
      iconEnd: 75,
    });
  });

  test('should get correct start point when cell is right of viewport [without enough area]', () => {
    const content: AreaRange = { start: 90, size: 50 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 10,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: 90,
      iconStart: 90,
      iconEnd: 105,
    });
  });

  /**
   *     +----------------------+
   *     |      viewport        |
   *  +--|----------------------|----------------------+
   *  |  |     short text       |                      |
   *  +--|---|------------------|----------------------+
   *     +---|------------------|
   */
  test('should get correct start point when cell contains viewport [with short text]', () => {
    const content: AreaRange = { start: -10, size: 120 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 10,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: 10,
      iconStart: 10,
      iconEnd: 25,
    });
  });

  /**
   *     +----------------------+
   *     |      viewport        |
   *  +--|----------------------|----------------------+
   *  |      | super super super| super long text   |  |
   *  +--|---|------------------|-------------------|--+
   *     +---|------------------|                   |
   *         v                  v                   v
   *       start              center               end
   */
  test('should get correct start point when cell contains viewport [with long text] and [left text is inside of viewport]', () => {
    const content: AreaRange = { start: -10, size: 200 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 145,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: 10,
      iconStart: 10,
      iconEnd: 160,
    });
  });

  test('should get correct start point when cell contains viewport [with long text] and [left text is outside of viewport]', () => {
    const content: AreaRange = { start: -40, size: 200 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 145,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: -20,
      iconStart: -20,
      iconEnd: 130,
    });
  });

  test('should get correct start point when cell contains viewport [with long text] and [right text is inside of viewport]', () => {
    const content: AreaRange = { start: -90, size: 200 };
    const result = adjustTextIconPositionWhileScrolling(viewport, content, {
      align: NormalizedAlign.Start,
      size: {
        textSize: 145,
        iconEndSize,
      },
      padding,
    });

    expect(result).toEqual({
      textStart: -70,
      iconStart: -70,
      iconEnd: 80,
    });
  });
});

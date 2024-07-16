/* eslint-disable jest/expect-expect */
import { Group } from '@antv/g';
import { customMerge } from '../../../../src';
import { ScrollBar, ScrollType } from '../../../../src/ui/scrollbar';
import type { ScrollBarCfg } from '../../../../src/ui/scrollbar/interface';
import { sleep } from '../../../util/helpers';

describe('Scrollbar Tests', () => {
  const defaultConfig: ScrollBarCfg = {
    thumbLen: 50,
    trackLen: 200,
    scrollTargetMaxOffset: 100,
    isHorizontal: false,
    position: {
      x: 0,
      y: 0,
    },
    theme: {
      size: 4,
    },
  };

  const expectScrollbarAttr = (scrollBarCfg?: Partial<ScrollBarCfg>) => {
    const config = customMerge<ScrollBarCfg>(defaultConfig, scrollBarCfg);
    const scrollbar = new ScrollBar(customMerge(defaultConfig, config));

    const { scrollBarGroup } = scrollbar;
    const [trackShape, thumbShape] = scrollBarGroup.children;

    expect(scrollBarGroup.get('className')).toEqual(
      config.isHorizontal ? 'horizontalBar' : 'verticalBar',
    );
    expect(trackShape.attributes).toMatchSnapshot();
    expect(thumbShape.attributes).toMatchSnapshot();
  };

  test('should render scrollbar group', () => {
    const scrollbar = new ScrollBar(defaultConfig);

    expect(scrollbar).toBeInstanceOf(Group);
    expect(scrollbar.scrollBarGroup).toBeInstanceOf(Group);
  });

  test('should render horizontal scrollbar shape', () => {
    expectScrollbarAttr({ isHorizontal: true });
  });

  test('should render vertical scrollbar shape', () => {
    expectScrollbarAttr({ isHorizontal: false });
  });

  test('should render horizontal scrollbar shape by custom theme', () => {
    expectScrollbarAttr({
      isHorizontal: true,
      theme: {
        size: 10,
        hoverSize: 12,
        trackColor: 'red',
        thumbColor: 'yellow',
      },
    });
  });

  test('should render vertical scrollbar shape by custom theme', () => {
    expectScrollbarAttr({
      isHorizontal: false,
      theme: {
        size: 2,
        hoverSize: 4,
        trackColor: '#396',
        thumbColor: 'rgba(0,0,0,.2)',
      },
    });
  });

  test('should get scrollbar relative position', () => {
    const scrollbar = new ScrollBar({
      ...defaultConfig,
      thumbOffset: 40,
    });

    expect(scrollbar.current()).toBeCloseTo(0.266);
  });

  test.skip('should update thumb length', async () => {
    const scrollChange = jest.fn();
    const scrollbar = new ScrollBar({
      ...defaultConfig,
      thumbLen: 0,
    });

    scrollbar.updateThumbLen(100);

    scrollbar.addEventListener(ScrollType.ScrollChange, scrollChange);
    expect(scrollbar.thumbLen).toEqual(100);
    expectScrollbarAttr();

    await sleep(200);
    expect(scrollChange).toHaveBeenCalledWith({
      offset: 0,
      updateThumbOffset: false,
    });
  });

  test.skip('should update thumb offset', async () => {
    let offset = 0;
    const scrollChange = jest.fn((data) => {
      offset = data.offset;
    });
    const scrollbar = new ScrollBar(defaultConfig);

    scrollbar.addEventListener(ScrollType.ScrollChange, scrollChange);
    scrollbar.updateThumbOffset(100);

    expect(scrollbar.thumbOffset).toEqual(100);
    expectScrollbarAttr();

    await sleep(200);
    expect(Math.floor(offset)).toEqual(66);
  });

  test.skip('should not emit scroll change after update thumb offset', async () => {
    const scrollChange = jest.fn();
    const scrollbar = new ScrollBar(defaultConfig);

    scrollbar.updateThumbOffset(100, false);

    scrollbar.addEventListener(ScrollType.ScrollChange, scrollChange);

    await sleep(200);
    expect(scrollChange).not.toHaveBeenCalled();
  });

  test.skip('should not emit scroll change if update consistent thumb offset', async () => {
    const scrollChange = jest.fn();
    const scrollbar = new ScrollBar({
      ...defaultConfig,
      thumbOffset: 100,
    });

    scrollbar.updateThumbOffset(100);

    scrollbar.addEventListener(ScrollType.ScrollChange, scrollChange);

    await sleep(200);
    expect(scrollChange).not.toHaveBeenCalled();
  });

  test.skip('should emit scroll change', async () => {
    const scrollChange = jest.fn();
    const scrollbar = new ScrollBar(defaultConfig);

    scrollbar.emitScrollChange(100);

    scrollbar.addEventListener(ScrollType.ScrollChange, scrollChange);

    await sleep(200);
    expect(scrollChange).toHaveBeenCalledWith({
      offset: 100,
      updateThumbOffset: true,
    });
  });
});

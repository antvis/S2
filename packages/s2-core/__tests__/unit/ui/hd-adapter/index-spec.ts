/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jest/expect-expect */
import { createPivotSheet, sleep } from 'tests/util/helpers';
import type { S2Options } from '../../../../src';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import type { HdAdapter } from '@/ui/hd-adapter';

describe('HD Adapter Tests', () => {
  const DPR = 1;
  const s2Options: S2Options = {
    width: 600,
    height: 600,
    devicePixelRatio: DPR,
  };

  let s2: SpreadSheet;
  let hdAdapter: HdAdapter;
  let expectContainerSize: (
    size?: [number, number],
    updatedSize?: [number, number],
  ) => void;

  beforeEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', {
      value: DPR,
    });
    Object.defineProperty(visualViewport, 'scale', {
      value: 1,
      configurable: true,
    });

    s2 = createPivotSheet(s2Options);
    s2.render();
    hdAdapter = s2.hdAdapter;

    expectContainerSize = (
      [width, height] = [s2.options.width, s2.options.height],
      [updatedWidth, updatedHeight] = [
        s2.options.width * DPR,
        s2.options.height * DPR,
      ],
    ) => {
      const canvas = s2.getCanvasElement();
      expect(canvas.style.width).toEqual(`${width}px`);
      expect(canvas.style.height).toEqual(`${height}px`);
      expect(canvas.width).toEqual(updatedWidth);
      expect(canvas.height).toEqual(updatedHeight);
    };
  });

  afterEach(() => {
    hdAdapter.destroy();
    s2.destroy();

    Object.defineProperty(visualViewport, 'scale', {
      value: 1,
      configurable: true,
    });
  });

  // eslint-disable-next-line jest/expect-expect
  test('should update container size by DPR', () => {
    expectContainerSize();
  });

  test('should not be update container size when zoom scale changed, but scale less than current DPR', async () => {
    const renderSpy = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});
    visualViewport.dispatchEvent(new Event('resize'));
    await sleep(500);

    expectContainerSize();
    expect(renderSpy).not.toHaveBeenCalled();
  });

  test('should update container size when zoom scale changed, and scale more than current DPR', async () => {
    const scale = 3;
    Object.defineProperty(visualViewport, 'scale', {
      value: scale,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));
    await sleep(500);

    // update container width/height, not update container stylesheet width/height
    // eg: <canvas width="1000" height="500" style="width:500px; height: 250px;" />
    expectContainerSize(
      [s2.options.width, s2.options.height],
      [s2.options.width * scale, s2.options.height * scale],
    );

    // 双指缩放回原始比例, 还原为默认宽高
    Object.defineProperty(visualViewport, 'scale', {
      value: 1,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));
    await sleep(500);

    expectContainerSize(
      [s2.options.width, s2.options.height],
      [s2.options.width * DPR, s2.options.height * DPR],
    );
  });

  test('should use DPR for update container size when zoom scale changed, and scale less than current DPR', async () => {
    const renderSpy = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});
    Object.defineProperty(visualViewport, 'scale', {
      value: 1,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);
    expect(renderSpy).not.toHaveBeenCalled();
  });

  test('should not rerender when zoom event destroyed', async () => {
    const renderSpy = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});

    s2.destroy();

    Object.defineProperty(visualViewport, 'scale', {
      value: 3,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);
    expect(renderSpy).not.toHaveBeenCalled();
  });

  test('should not rerender when zoom event destroyed on mobile device', async () => {
    const renderSpy = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});

    hdAdapter.destroy();
    Object.defineProperty(navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    });
    hdAdapter.init();
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);

    expectContainerSize();
    expect(renderSpy).not.toHaveBeenCalled();
  });

  test('should update canvas size if DPR changed', () => {
    const ratio = 3;
    Object.defineProperty(window, 'devicePixelRatio', {
      value: ratio,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 模拟 matchMedia 触发
    hdAdapter.renderByDevicePixelRatioChanged();

    expectContainerSize(
      [s2.options.width, s2.options.height],
      [s2.options.width * ratio, s2.options.height * ratio],
    );
  });

  // https://github.com/antvis/S2/issues/2072
  test('should ignore visualViewport resize effect', () => {
    const renderByDevicePixelRatioSpy = jest
      .spyOn(hdAdapter as any, 'renderByDevicePixelRatio')
      .mockImplementationOnce(() => {});

    const ratio = 3;

    Object.defineProperty(window, 'devicePixelRatio', {
      value: ratio,
    });

    // @ts-ignore
    hdAdapter.renderByDevicePixelRatioChanged();
    visualViewport.dispatchEvent(new Event('resize'));
    // @ts-ignore 模拟 matchMedia 触发后 visualViewport resize 事件触发
    hdAdapter.isDevicePixelRatioChange = true;

    expect(renderByDevicePixelRatioSpy).toHaveBeenCalledTimes(1);
  });
});

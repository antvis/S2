import { createPivotSheet, sleep } from 'tests/util/helpers';
import type { S2Options } from '../../../../src';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import { HdAdapter } from '@/ui/hd-adapter';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');

describe('HD Adapter Tests', () => {
  const DPR = 2;
  const s2Options: S2Options = {
    width: 600,
    height: 600,
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
    hdAdapter = new HdAdapter(s2);
    hdAdapter.init();

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
    const render = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});
    visualViewport.dispatchEvent(new Event('resize'));
    await sleep(500);

    expectContainerSize();
    expect(render).not.toHaveBeenCalled();
  });

  // eslint-disable-next-line jest/expect-expect
  test('should update container size when zoom scale changed, and scale more than current DPR', async () => {
    const scale = 2;
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
  });

  test('should use DPR for update container size when zoom scale changed, and scale less than current DPR', async () => {
    const render = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});
    Object.defineProperty(visualViewport, 'scale', {
      value: 1,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);
    expect(render).not.toHaveBeenCalled();
  });

  test('should not rerender when zoom event destroyed', async () => {
    const render = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});

    hdAdapter.destroy();
    Object.defineProperty(visualViewport, 'scale', {
      value: 3,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);
    expect(render).not.toHaveBeenCalled();
  });

  test('should not rerender when zoom event destroyed on mobile device', async () => {
    const render = jest.spyOn(s2, 'render').mockImplementationOnce(() => {});

    hdAdapter.destroy();
    Object.defineProperty(navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    });
    hdAdapter.init();
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);

    expectContainerSize();
    expect(render).not.toHaveBeenCalled();
  });
});

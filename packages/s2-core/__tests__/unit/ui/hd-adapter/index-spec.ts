import { createFakeSpreadSheet, sleep } from 'tests/util/helpers';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import { HdAdapter } from '@/ui/hd-adapter';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('HD Adapter Tests', () => {
  const DPR = 2;

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

    s2 = createFakeSpreadSheet();
    hdAdapter = new HdAdapter(s2);
    hdAdapter.init();

    expectContainerSize = (
      [width, height] = [s2.options.width, s2.options.height],
      [updatedWidth, updatedHeight] = [
        s2.options.width * DPR,
        s2.options.height * DPR,
      ],
    ) => {
      const canvas: HTMLCanvasElement = s2.container.get('el');
      expect(canvas.style.width).toEqual(`${width}px`);
      expect(canvas.style.height).toEqual(`${height}px`);
      expect(canvas.width).toEqual(updatedWidth);
      expect(canvas.height).toEqual(updatedHeight);
    };
  });

  afterEach(() => {
    hdAdapter.destroy();

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
    visualViewport.dispatchEvent(new Event('resize'));
    await sleep(500);

    expectContainerSize();
    expect(s2.render).not.toHaveBeenCalled();
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
    Object.defineProperty(visualViewport, 'scale', {
      value: 1,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);
    expect(s2.render).not.toHaveBeenCalled();
  });

  test('should not rerender when zoom event destroyed', async () => {
    hdAdapter.destroy();
    Object.defineProperty(visualViewport, 'scale', {
      value: 3,
      configurable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);
    expect(s2.render).not.toHaveBeenCalled();
  });

  test('should not rerender when zoom event destroyed on mobile device', async () => {
    hdAdapter.destroy();
    Object.defineProperty(navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    });
    hdAdapter.init();
    visualViewport.dispatchEvent(new Event('resize'));

    await sleep(500);

    expectContainerSize();
    expect(s2.render).not.toHaveBeenCalled();
  });
});

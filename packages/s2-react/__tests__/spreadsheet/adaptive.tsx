import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { SpreadSheet, S2Options } from '@antv/s2';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer, sleep } from 'tests/util/helpers';
import { SheetComponent } from '@/components/sheets';
import { Adaptive } from '@/components';

interface Props {
  containerWidth?: number;
  containerHeight?: number;
  adaptive?: Adaptive;
  containerId?: string;
  options?: S2Options;
}

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
};

let s2: SpreadSheet;

function MainLayout({
  containerWidth,
  containerHeight,
  adaptive,
  containerId,
  options,
}: Props) {
  return (
    <div
      id={containerId}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <SheetComponent
        adaptive={adaptive}
        sheetType="pivot"
        dataCfg={mockDataConfig}
        options={options || s2Options}
        themeCfg={{ name: 'default' }}
        getSpreadSheet={(instance) => {
          s2 = instance;
        }}
      />
    </div>
  );
}

describe('SheetComponent adaptive Tests', () => {
  const testAdaptiveConfig = async (
    containerId: string,
    adaptive?: { width?: boolean; height?: boolean },
  ) => {
    const newContainerWidth = 1000;
    const newContainerHeight = 500;
    const options = {
      width: 0,
      height: 0,
    };

    act(() => {
      ReactDOM.render(
        <MainLayout
          adaptive={{
            getContainer: () => document.getElementById(containerId),
            ...adaptive,
          }}
          containerId={containerId}
          containerWidth={newContainerWidth}
          containerHeight={newContainerHeight}
          options={options}
        />,
        getContainer(),
      );
    });

    await sleep(1000);
    return { newContainerHeight, newContainerWidth, options };
  };
  beforeEach(() => {
    s2 = null;
  });

  test('should use container width when table first rendered', async () => {
    act(() => {
      ReactDOM.render(
        <MainLayout adaptive containerWidth={400} />,
        getContainer(),
      );
    });

    await sleep(1000);

    expect(s2.options.width).toEqual(400);
    expect(s2.container.cfg.width).toEqual(400);
  });

  test('should use container width when container width less than options width and table first rendered', async () => {
    act(() => {
      ReactDOM.render(
        <MainLayout adaptive={true} containerWidth={s2Options.width - 100} />,
        getContainer(),
      );
    });

    await sleep(1000);

    expect(s2.options.width).toEqual(s2Options.width - 100);
    expect(s2.container.cfg.width).toEqual(s2Options.width - 100);
  });

  test('should use option width and height when table first rendered, and disable adaptive', async () => {
    act(() => {
      ReactDOM.render(
        <MainLayout
          adaptive={false}
          containerWidth={1000}
          containerHeight={1000}
        />,
        getContainer(),
      );
    });
    await sleep(1000);
    expect(s2.options.width).toEqual(s2Options.width);
    expect(s2.options.height).toEqual(s2Options.height);
    expect(s2.container.cfg.width).toEqual(s2Options.width);
    expect(s2.container.cfg.height).toEqual(s2Options.height);
  });

  test('should update table width and height when container resize', async () => {
    const newContainerWidth = 1000;
    const newContainerHeight = 500;
    const containerId = 'testContainer';

    act(() => {
      ReactDOM.render(
        <MainLayout
          adaptive={{
            getContainer: () => document.getElementById(containerId),
          }}
          containerId={containerId}
          containerWidth={200}
          containerHeight={200}
        />,
        getContainer(),
      );
    });

    act(() => {
      const container = document.getElementById(containerId);
      container.style.width = newContainerWidth + 'px';
      container.style.height = newContainerHeight + 'px';
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await sleep(1000);

    expect(s2.options.width).toEqual(newContainerWidth);
    expect(s2.options.height).toEqual(newContainerHeight);
    expect(s2.container.cfg.height).toEqual(newContainerHeight);
    expect(s2.container.cfg.width).toEqual(newContainerWidth);
  });

  // https://github.com/antvis/S2/issues/792
  test('should update canvas size when container resize', async () => {
    const newContainerWidth = 800;
    const newContainerHeight = 300;
    const containerId = 'resizeContainer';

    // render by option
    act(() => {
      ReactDOM.render(
        <MainLayout
          adaptive={{
            getContainer: () => document.getElementById(containerId),
          }}
          containerId={containerId}
        />,
        getContainer(),
      );
    });

    // parent size changed, trigger resize observer
    act(() => {
      document
        .getElementById(containerId)
        .setAttribute(
          'style',
          `width: ${newContainerWidth}px; height: ${newContainerHeight}px`,
        );
    });

    await sleep(1000);

    const canvas = s2.container.get('el') as HTMLCanvasElement;

    // render by resized parent container
    expect(s2.options.width).toEqual(newContainerWidth);
    expect(s2.options.height).toEqual(newContainerHeight);
    expect(s2.container.cfg.width).toEqual(newContainerWidth);
    expect(s2.container.cfg.height).toEqual(newContainerHeight);

    // update canvas width
    expect(canvas.style.width).toEqual(`${newContainerWidth}px`);
    expect(canvas.style.height).toEqual(`${newContainerHeight}px`);
  });

  test("should don't update canvas size when container resize but disable adaptive", async () => {
    const newContainerWidth = 800;
    const newContainerHeight = 300;
    const containerId = 'resizeContainer';

    // render by option
    act(() => {
      ReactDOM.render(
        <MainLayout adaptive={false} containerId={containerId} />,
        getContainer(),
      );
    });

    // parent size changed, trigger resize observer
    act(() => {
      document
        .getElementById(containerId)
        .setAttribute(
          'style',
          `width: ${newContainerWidth}px; height: ${newContainerHeight}px`,
        );
    });

    await sleep(1000);

    const canvas = s2.container.get('el') as HTMLCanvasElement;

    expect(s2.options.width).toEqual(200);
    expect(s2.container.cfg.width).toEqual(200);
    expect(canvas.style.width).toEqual(`200px`);
    expect(canvas.style.height).toEqual(`200px`);
  });

  // canvas need to set "display: block", otherwise have `5px` difference with container
  test('should container height equal canvas height', async () => {
    const containerId = 'blockContainer';

    act(() => {
      ReactDOM.render(
        <MainLayout adaptive containerId={containerId} />,
        getContainer(),
      );
    });

    const container = document.getElementById(containerId);
    const canvas = s2.container.get('el') as HTMLCanvasElement;

    await sleep(1000);

    const { height: containerHeight } = container.getBoundingClientRect();

    expect(`${Math.round(containerHeight)}px`).toEqual(canvas.style.height);
  });

  // https://github.com/antvis/S2/issues/901
  test('should use container width and height when options width and height is zero', async () => {
    const { newContainerHeight, newContainerWidth } = await testAdaptiveConfig(
      'testIssue901',
    );

    expect(s2.options.width).toEqual(newContainerWidth);
    expect(s2.options.height).toEqual(newContainerHeight);
    expect(s2.container.cfg.height).toEqual(newContainerHeight);
    expect(s2.container.cfg.width).toEqual(newContainerWidth);
  });

  test('should just use container height when adaptive width is false', async () => {
    const { newContainerHeight, options } = await testAdaptiveConfig(
      'onlyHeightAdaptive',
      { width: false },
    );

    expect(s2.options.width).toEqual(options.width);
    expect(s2.options.height).toEqual(newContainerHeight);
    expect(s2.container.cfg.height).toEqual(newContainerHeight);
    expect(s2.container.cfg.width).toEqual(options.width);
  });

  test('should just use container width when adaptive height is false', async () => {
    const { newContainerWidth, options } = await testAdaptiveConfig(
      'onlyWidthAdaptive',
      { height: false },
    );
    expect(s2.options.height).toEqual(options.height);
    expect(s2.options.width).toEqual(newContainerWidth);
    expect(s2.container.cfg.height).toEqual(options.height);
    expect(s2.container.cfg.width).toEqual(newContainerWidth);
  });

  test('should use options width and height when adaptive config height and width are false', async () => {
    const { options } = await testAdaptiveConfig('noneAdaptive', {
      height: false,
      width: false,
    });

    expect(s2.options.width).toEqual(options.width);
    expect(s2.options.height).toEqual(options.height);
    expect(s2.container.cfg.height).toEqual(options.height);
    expect(s2.container.cfg.width).toEqual(options.width);
  });
});

import type { SpreadSheet } from '@antv/s2';
import type { Adaptive } from '@antv/s2-shared';
import React from 'react';
import { act } from 'react-dom/test-utils';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer, renderComponent, sleep } from 'tests/util/helpers';
import { waitFor } from '@testing-library/react';
import { SheetComponent } from '@/components/sheets';
import type { SheetComponentsProps } from '@/components';

interface Props {
  containerWidth?: number;
  containerHeight?: number;
  adaptive?: Adaptive;
  containerId?: string;
  options?: SheetComponentsProps['options'];
}

const s2Options: SheetComponentsProps['options'] = {
  width: 200,
  height: 200,
  hd: false,
};

let s2: SpreadSheet | null;

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
        onMounted={(instance) => {
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

    renderComponent(
      <MainLayout
        adaptive={{
          getContainer: () => document.getElementById(containerId)!,
          ...adaptive,
        }}
        containerId={containerId}
        containerWidth={newContainerWidth}
        containerHeight={newContainerHeight}
        options={options}
      />,
    );

    await sleep(1000);

    return { newContainerHeight, newContainerWidth, options };
  };

  beforeEach(() => {
    s2 = null;
  });

  test('should use container width when table first rendered', async () => {
    renderComponent(<MainLayout adaptive containerWidth={400} />);

    await waitFor(() => {
      expect(s2!.options.width).toEqual(400);
      expect(s2!.container.getConfig().width).toEqual(400);
    });
  });

  test('should use option width and height when table first rendered, and disable adaptive', async () => {
    renderComponent(
      <MainLayout
        adaptive={false}
        containerWidth={1000}
        containerHeight={1000}
      />,
    );

    await waitFor(() => {
      expect(s2!.options.width).toEqual(s2Options.width);
      expect(s2!.options.height).toEqual(s2Options.height);
      expect(s2!.container.getConfig().width).toEqual(s2Options.width);
      expect(s2!.container.getConfig().height).toEqual(s2Options.height);
    });
  });

  test('should update table width and height when container resize', async () => {
    const newContainerWidth = 1000;
    const newContainerHeight = 500;
    const containerId = 'testContainer';

    renderComponent(
      <MainLayout
        adaptive={{
          getContainer: () => document.getElementById(containerId)!,
        }}
        containerId={containerId}
        containerWidth={200}
        containerHeight={200}
      />,
    );

    act(() => {
      const container = document.getElementById(containerId)!;

      container.style.width = `${newContainerWidth}px`;
      container.style.height = `${newContainerHeight}px`;
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(s2!.options.width).toEqual(newContainerWidth);
      expect(s2!.options.height).toEqual(newContainerHeight);
      expect(s2!.container.getConfig().height).toEqual(newContainerHeight);
      expect(s2!.container.getConfig().width).toEqual(newContainerWidth);
    });
  });

  // https://github.com/antvis/S2/issues/792
  test('should update canvas size when container resize', async () => {
    const newContainerWidth = 800;
    const newContainerHeight = 300;
    const containerId = 'resizeContainer';

    renderComponent(
      <MainLayout
        adaptive={{
          getContainer: () => document.getElementById(containerId)!,
        }}
        containerId={containerId}
      />,
    );

    // parent size changed, trigger resize observer
    act(() => {
      document
        .getElementById(containerId)!
        .setAttribute(
          'style',
          `width: ${newContainerWidth}px; height: ${newContainerHeight}px`,
        );
    });

    await waitFor(() => {
      const canvas = s2!.getCanvasElement();

      // render by resized parent container
      expect(s2!.options.width).toEqual(newContainerWidth);
      expect(s2!.options.height).toEqual(newContainerHeight);
      expect(s2!.container.getConfig().width).toEqual(newContainerWidth);
      expect(s2!.container.getConfig().height).toEqual(newContainerHeight);

      // update canvas width
      expect(canvas.style.width).toEqual(`${newContainerWidth}px`);
      expect(canvas.style.height).toEqual(`${newContainerHeight}px`);
    });
  });

  test("should don't update canvas size when container resize but disable adaptive", async () => {
    const newContainerWidth = 800;
    const newContainerHeight = 300;
    const containerId = 'resizeContainer';

    // render by option
    renderComponent(<MainLayout adaptive={false} containerId={containerId} />);

    // parent size changed, trigger resize observer
    act(() => {
      document
        .getElementById(containerId)!
        .setAttribute(
          'style',
          `width: ${newContainerWidth}px; height: ${newContainerHeight}px`,
        );
    });

    await waitFor(() => {
      const canvas = s2!.getCanvasElement() as HTMLCanvasElement;

      expect(s2!.options.width).toEqual(200);
      expect(s2!.container.getConfig().width).toEqual(200);
      expect(canvas.style.width).toEqual(`200px`);
      expect(canvas.style.height).toEqual(`200px`);
    });
  });

  // canvas need to set "display: block", otherwise have `5px` difference with container
  test('should container height equal canvas height', async () => {
    const containerId = 'blockContainer';

    renderComponent(<MainLayout adaptive containerId={containerId} />);

    await waitFor(() => {
      const container = document.getElementById(containerId)!;
      const canvas = s2!.getCanvasElement();

      const { height: containerHeight } = container.getBoundingClientRect();

      expect(`${Math.round(containerHeight)}px`).toEqual(canvas.style.height);
    });
  });

  // https://github.com/antvis/S2/issues/901
  test('should use container width and height when options width and height is zero', async () => {
    const { newContainerHeight, newContainerWidth } =
      await testAdaptiveConfig('testIssue901');

    expect(s2!.options.width).toEqual(newContainerWidth);
    expect(s2!.options.height).toEqual(newContainerHeight);
    expect(s2!.container.getConfig().height).toEqual(newContainerHeight);
    expect(s2!.container.getConfig().width).toEqual(newContainerWidth);
  });

  test('should just use container height when adaptive width is false', async () => {
    const { newContainerHeight, options } = await testAdaptiveConfig(
      'onlyHeightAdaptive',
      { width: false },
    );

    expect(s2!.options.width).toEqual(options.width);
    expect(s2!.options.height).toEqual(newContainerHeight);
    expect(s2!.container.getConfig().height).toEqual(newContainerHeight);
    expect(s2!.container.getConfig().width).toEqual(options.width);
  });

  test('should just use container width when adaptive height is false', async () => {
    const { newContainerWidth, options } = await testAdaptiveConfig(
      'onlyWidthAdaptive',
      { height: false },
    );

    expect(s2!.options.height).toEqual(options.height);
    expect(s2!.options.width).toEqual(newContainerWidth);
    expect(s2!.container.getConfig().height).toEqual(options.height);
    expect(s2!.container.getConfig().width).toEqual(newContainerWidth);
  });

  test('should use options width and height when adaptive config height and width are false', async () => {
    const { options } = await testAdaptiveConfig('noneAdaptive', {
      height: false,
      width: false,
    });

    expect(s2!.options.width).toEqual(options.width);
    expect(s2!.options.height).toEqual(options.height);
    expect(s2!.container.getConfig().height).toEqual(options.height);
    expect(s2!.container.getConfig().width).toEqual(options.width);
  });

  // https://github.com/antvis/S2/issues/1411
  test('should get original container size if container scaled', async () => {
    const newContainerWidth = 1000;
    const newContainerHeight = 500;
    const container = getContainer();

    container.style.width = `${newContainerWidth}px`;
    container.style.height = `${newContainerHeight}px`;
    container.style.transform = 'scale(0.5)';

    renderComponent(
      <MainLayout
        adaptive={{
          width: true,
          height: true,
          getContainer: () => container,
        }}
      />,
      container,
    );

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(s2!.options.width).toEqual(newContainerWidth);
      expect(s2!.container.getConfig().width).toEqual(newContainerWidth);
    });
  });
});

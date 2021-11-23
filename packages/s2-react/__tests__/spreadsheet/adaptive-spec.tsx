import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { SpreadSheet, S2Options } from '@antv/s2';
import * as mockDataConfig from '../data/simple-data.json';
import { getContainer, sleep } from '../util/helpers';
import { SheetComponent } from '@/components/sheets';

interface Props {
  containerWidth?: number;
  containerHeight?: number;
  adaptive?: boolean;
  containerId?: string;
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
        options={s2Options}
        themeCfg={{ name: 'default' }}
        getSpreadSheet={(instance) => {
          s2 = instance;
        }}
      />
    </div>
  );
}

describe('SheetComponent adaptive Tests', () => {
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
        <MainLayout adaptive containerWidth={s2Options.width - 100} />,
        getContainer(),
      );
    });

    await sleep(1000);

    expect(s2.options.width).toEqual(s2Options.width - 100);
    expect(s2.container.cfg.width).toEqual(s2Options.width - 100);
  });

  test('should use option width when table first rendered, and disable adaptive', async () => {
    act(() => {
      ReactDOM.render(
        <MainLayout adaptive={false} containerWidth={1000} />,
        getContainer(),
      );
    });
    await sleep(1000);
    expect(s2.options.width).toEqual(s2Options.width);
    expect(s2.container.cfg.width).toEqual(s2Options.width);
  });

  test('should update table width when container resize', async () => {
    const newContainerWidth = 1000;
    const containerId = 'testContainer';

    act(() => {
      ReactDOM.render(
        <MainLayout adaptive containerId={containerId} containerWidth={200} />,
        getContainer(),
      );
    });

    act(() => {
      document
        .getElementById(containerId)
        .setAttribute('style', `width: ${newContainerWidth}px`);
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await sleep(1000);

    expect(s2.options.width).toEqual(newContainerWidth);
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
        <MainLayout adaptive containerId={containerId} />,
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
    expect(s2.container.cfg.width).toEqual(newContainerWidth);

    // update canvas width
    expect(canvas.style.width).toEqual(`${newContainerWidth}px`);
    expect(canvas.style.height).toEqual(`${s2Options.height}px`);
  });

  // canvas need to set "display: block", otherwise have `5px` difference with container
  test('should container height equal canvas height', async () => {
    const containerId = 'blockContainer';

    act(() => {
      ReactDOM.render(
        <MainLayout adaptive containerId={containerId} containerWidth={400} />,
        getContainer(),
      );
    });

    const container = document.getElementById(containerId);
    const canvas = s2.container.get('el') as HTMLCanvasElement;

    await sleep(1000);

    const { height: containerHeight } = container.getBoundingClientRect();

    expect(`${containerHeight}px`).toEqual(canvas.style.height);
  });
});

/**
 * @description spec for issue #609
 * https://github.com/antvis/S2/issues/609
 * Wrong table width and height when enable adaptive
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer, sleep } from 'tests/util/helpers';
import { SheetComponent } from '@/components/sheets';
import { SpreadSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';

interface Props {
  containerWidth: number;
  adaptive?: boolean;
  containerId?: string;
}

const s2Options: S2Options = {
  width: 200,
  height: 200,
};

let s2: SpreadSheet;

function MainLayout({ containerWidth, adaptive, containerId }: Props) {
  return (
    <div
      id={containerId}
      style={{
        width: containerWidth,
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
  test('should use container width when table first rendered', () => {
    act(() => {
      ReactDOM.render(
        <MainLayout adaptive containerWidth={400} />,
        getContainer(),
      );
    });

    expect(s2.options.width).toEqual(400);
    expect(s2.container.cfg.width).toEqual(400);
  });

  test('should use container width when container width less than options width and table first rendered', () => {
    act(() => {
      ReactDOM.render(
        <MainLayout adaptive containerWidth={s2Options.width - 100} />,
        getContainer(),
      );
    });

    expect(s2.options.width).toEqual(s2Options.width - 100);
    expect(s2.container.cfg.width).toEqual(s2Options.width - 100);
  });

  test('should use option width when table first rendered, and disable adaptive', () => {
    act(() => {
      ReactDOM.render(
        <MainLayout adaptive={false} containerWidth={1000} />,
        getContainer(),
      );
    });

    expect(s2.options.width).toEqual(s2Options.width);
    expect(s2.container.cfg.width).toEqual(s2Options.width);
  });

  test('should update table width when container resize', async () => {
    const newContainerWidth = 1000;

    act(() => {
      ReactDOM.render(
        <MainLayout
          adaptive
          containerId="testContainer"
          containerWidth={200}
        />,
        getContainer(),
      );
    });

    act(() => {
      document
        .querySelector('#testContainer')
        .setAttribute('style', `width: ${newContainerWidth}px`);
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await sleep(1000);

    expect(s2.options.width).toEqual(newContainerWidth);
    expect(s2.container.cfg.width).toEqual(newContainerWidth);
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { SpreadSheet, S2Options, BaseTooltip } from '@antv/s2';
import * as mockDataConfig from '../data/simple-data.json';
import { getContainer, sleep } from '../util/helpers';
import { SheetComponent } from '@/components/sheets';
import { CustomTooltip } from '@/components/tooltip/custom-tooltip';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
  tooltip: {
    showTooltip: true,
  },
};

let s2: SpreadSheet;

function MainLayout() {
  return (
    <SheetComponent
      adaptive={false}
      sheetType="pivot"
      dataCfg={mockDataConfig}
      options={s2Options}
      themeCfg={{ name: 'default' }}
      getSpreadSheet={(instance) => {
        s2 = instance;
      }}
    />
  );
}

describe('SheetComponent Tooltip Tests', () => {
  beforeEach(() => {
    s2?.destroy();
    s2 = null;
  });

  beforeEach(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });

  // https://github.com/antvis/S2/issues/828

  test('should not throw error if multiple call showTooltip', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await sleep(1000);

    const showTooltip = () => {
      s2.tooltip.show({ position: { x: 0, y: 0 }, content: '111' });
    };

    Array.from({ length: 10 }).forEach(() => {
      expect(showTooltip).not.toThrowError();
    });

    showTooltip();

    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  test('should init custom tooltip and instance of BaseTooltip', async () => {
    await sleep(1000);
    expect(s2.tooltip).toBeInstanceOf(BaseTooltip);
    expect(s2.tooltip).toBeInstanceOf(CustomTooltip);
  });

  test('should get renderTooltip options', async () => {
    await sleep(1000);
    const { renderTooltip } = s2.options.tooltip;

    expect(renderTooltip).toBeFunction();
    expect(renderTooltip(s2)).toBeInstanceOf(CustomTooltip);
  });

  test('should render tooltip content for jsx element', async () => {
    await sleep(1000);
    const content = <div id="custom-content">content</div>;

    s2.showTooltip({ position: { x: 0, y: 0 }, content });

    expect(s2.tooltip.container.querySelector('#custom-content')).toBeTruthy();
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { SpreadSheet, S2Options, BaseTooltip } from '@antv/s2';
import * as mockDataConfig from '../data/simple-data.json';
import { getContainer, sleep } from '../util/helpers';
import { SheetComponent } from '@/components/sheets';

interface Props {
  containerId?: string;
}

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hdAdapter: false,
  tooltip: {
    showTooltip: true,
  },
};

let s2: SpreadSheet;

function MainLayout({ containerId }: Props) {
  return (
    <div id={containerId}>
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
    </div>
  );
}

describe('SheetComponent Tooltip Tests', () => {
  beforeEach(() => {
    s2 = null;
  });

  beforeEach(() => {
    ReactDOM.render(<MainLayout containerId="id1" />, getContainer());
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

    expect(errorSpy).not.toHaveBeenCalled();
  });

  test('should init BaseTooltip', async () => {
    await sleep(1000);
    expect(s2.tooltip).toBeInstanceOf(BaseTooltip);
  });
});

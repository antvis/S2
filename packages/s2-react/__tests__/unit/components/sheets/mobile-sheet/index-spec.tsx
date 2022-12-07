import { render } from '@testing-library/react';
import React from 'react';
import { DEFAULT_MOBILE_OPTIONS, DeviceType, SpreadSheet } from '@antv/s2';
import { pick } from 'lodash';
import * as mockDataConfig from '../../../../data/simple-data.json';
import { MobileSheetComponent } from '../../../../../src/components/sheets/mobile-sheet';

describe('MobileSheet Tests', () => {
  test('get mobile default option', () => {
    let s2: SpreadSheet;
    render(
      <MobileSheetComponent
        dataCfg={mockDataConfig}
        options={{ height: 300, devicePixelRatio: 2 }}
        onMounted={(s) => {
          s2 = s;
        }}
      />,
    );

    const interactionOptions = pick(
      s2!.options.interaction,
      Object.keys(DEFAULT_MOBILE_OPTIONS.interaction!),
    );
    const { height, device } = s2!.options;
    expect(interactionOptions).toEqual(DEFAULT_MOBILE_OPTIONS.interaction);
    expect(height).toEqual(300);
    expect(device).toEqual(DeviceType.MOBILE);
  });

  test('get mobile default fragment', () => {
    const { asFragment } = render(
      <MobileSheetComponent
        dataCfg={mockDataConfig}
        options={{
          height: 300,
          width: 300,
          hdAdapter: false,
          devicePixelRatio: 2,
        }}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

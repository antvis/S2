/**
 * @description spec for issue #652
 * https://github.com/antvis/S2/issues/652
 * Wrong table width and height when enable adaptive
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import type { S2Options } from '@antv/s2';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from '../util/helpers';
import { SheetComponent } from '@/components/sheets';
import { SheetComponentsProps, SheetType } from '@/components/sheets/interface';

const s2Options: S2Options = {
  width: 400,
  height: 400,
};

function MainLayout({ sheetType, adaptive }: Partial<SheetComponentsProps>) {
  return (
    <SheetComponent
      sheetType={sheetType}
      dataCfg={mockDataConfig}
      options={s2Options}
      themeCfg={{ name: 'default' }}
      adaptive={adaptive}
    />
  );
}

describe('SheetComponent Correct Render Tests', () => {
  test.each([
    { sheetType: 'pivot', adaptive: false },
    { sheetType: 'table', adaptive: false },
    { sheetType: 'gridAnalysis', adaptive: false },
    { sheetType: 'pivot', adaptive: true },
    { sheetType: 'table', adaptive: true },
    { sheetType: 'gridAnalysis', adaptive: true },
  ] as Array<{ sheetType: SheetType; adaptive: boolean }>)(
    'should correct render %o with empty options',
    ({ sheetType, adaptive }) => {
      function render() {
        ReactDOM.render(
          <MainLayout sheetType={sheetType} adaptive={adaptive} />,
          getContainer(),
        );
      }

      expect(render).not.toThrowError();
    },
  );
});

/**
 * @description spec for issue #652
 * https://github.com/antvis/S2/issues/652
 * Wrong table width and height when enable adaptive
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as mockDataConfig from 'tests/data/simple-data.json';
import type { SheetType } from '@antv/s2-shared';
import { getContainer } from '../util/helpers';
import { SheetComponent } from '@/components/sheets';
import type { SheetComponentsProps } from '@/components/sheets/interface';

const s2Options: SheetComponentsProps['options'] = {
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
  const sheets: Array<{ sheetType: SheetType; adaptive: boolean }> = [
    { sheetType: 'pivot', adaptive: false },
    { sheetType: 'table', adaptive: false },
    { sheetType: 'gridAnalysis', adaptive: false },
    { sheetType: 'editable', adaptive: false },
    { sheetType: 'pivot', adaptive: true },
    { sheetType: 'table', adaptive: true },
    { sheetType: 'gridAnalysis', adaptive: true },
    { sheetType: 'editable', adaptive: true },
  ];
  test.each(sheets)(
    'should correct render %o with empty options',
    ({ sheetType, adaptive }) => {
      function render() {
        ReactDOM.render(
          <MainLayout sheetType={sheetType} adaptive={adaptive} />,
          getContainer(),
        );
      }

      expect(render).not.toThrow();
    },
  );
});

/**
 * @description spec for issue #652
 * https://github.com/antvis/S2/issues/652
 * Wrong table width and height when enable adaptive
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { SheetComponent } from '@/components/sheets';
import { S2Options } from '@/common/interface';
import { SheetType } from '@/components/sheets/interface';

function MainLayout({ sheetType }: { sheetType: SheetType }) {
  const [s2Options] = React.useState<S2Options>();
  return (
    <SheetComponent
      sheetType={sheetType}
      dataCfg={mockDataConfig}
      options={s2Options}
      themeCfg={{ name: 'default' }}
    />
  );
}

describe('SheetComponent Correct Render Tests', () => {
  test.each(['pivot', 'table', 'gridAnalysis'] as unknown as Array<
    keyof SheetType
  >)('should correct render %o with empty options', (type) => {
    function render() {
      ReactDOM.render(
        <MainLayout sheetType={type as SheetType} />,
        getContainer(),
      );
    }

    expect(render).not.toThrowError();
  });
});

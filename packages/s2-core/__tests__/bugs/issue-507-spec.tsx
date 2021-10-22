/**
 * @description spec for issue #507
 * https://github.com/antvis/S2/issues/507
 * Show err when hierarchyType is tree and data is empty
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import * as dataCfg from '../data/data-issue-507.json';
import { SheetComponent, S2Options } from '@/index';

function MainLayout() {
  const s2options: S2Options = {
    width: 800,
    height: 600,
    hierarchyType: 'tree',
  };

  return (
    <div>
      <SheetComponent
        dataCfg={dataCfg}
        sheetType={'pivot'}
        options={s2options}
      />
    </div>
  );
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});

/**
 * @description spec for issue #725
 * https://github.com/antvis/S2/issues/725
 * Wrong multi measure render
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import * as mockDataConfig from 'tests/data/data-issue-725.json';
import { getContainer } from '../util/helpers';
import { S2Options } from '@/common/interface';
import { SheetComponent } from '@/components/sheets';

function MainLayout({ hierarchyType }: { hierarchyType: 'grid' | 'tree' }) {
  const [s2Options] = React.useState<S2Options>();
  return (
    <SheetComponent
      dataCfg={mockDataConfig}
      options={{ ...s2Options, hierarchyType }}
      themeCfg={{ name: 'default' }}
    />
  );
}

describe('Multi Measure Correct Render Tests', () => {
  test.each(['tree', 'grid'])(
    'should correct render %o with empty options',
    (type) => {
      function render() {
        ReactDOM.render(
          <MainLayout hierarchyType={type as 'grid' | 'tree'} />,
          getContainer(),
        );
      }

      expect(render).not.toThrowError();
    },
  );
});

/**
 * @description spec for issue #1736
 * https://github.com/antvis/S2/issues/1736
 * Export dropdown visible state error
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getMockSheetInstance, getContainer } from 'tests/util/helpers';
import { Export } from '@/components/export';

describe('header export component render tests', () => {
  test('should render export and dropdown keep invisible', () => {
    act(() => {
      const sheet = getMockSheetInstance();

      ReactDOM.render(<Export sheet={sheet} open={true} />, getContainer());
    });

    // export 组件
    expect(document.querySelector('.antv-s2-export')).toBeDefined();

    // dropdown 不应该渲染
    expect(document.querySelector('.ant-dropdown')).toBe(null);
  });

  test('should render export dropdown menu', () => {
    act(() => {
      const sheet = getMockSheetInstance();

      ReactDOM.render(
        <Export
          sheet={sheet}
          open={true}
          dropdown={{
            open: true,
          }}
        />,
        getContainer(),
      );
    });

    // dropdown组件
    expect(document.querySelector('.ant-dropdown')).toBeDefined();
  });
});

/**
 * @description spec for issue #1736
 * https://github.com/antvis/S2/issues/1736
 * Export dropdown visible state error
 */
import { waitFor } from '@testing-library/react';
import React from 'react';
import type { Root } from 'react-dom/client';
import { getMockSheetInstance, renderComponent } from 'tests/util/helpers';
import { Export } from '@/components/export';

describe('header export component render tests', () => {
  let unmount: Root['unmount'];

  afterEach(() => {
    unmount?.();
  });

  test('should render export and dropdown keep invisible', async () => {
    const sheet = getMockSheetInstance();

    unmount = renderComponent(<Export sheet={sheet} open />);

    await waitFor(() => {
      // export 组件
      expect(document.querySelector('.antv-s2-export')).toBeDefined();

      // dropdown 不应该渲染
      expect(document.querySelector('.ant-dropdown')).toBe(null);
    });
  });

  test('should render export dropdown menu', async () => {
    const sheet = getMockSheetInstance();

    unmount = renderComponent(
      <Export
        sheet={sheet}
        open
        dropdown={{
          open: true,
        }}
      />,
    );

    await waitFor(() => {
      // dropdown 组件
      expect(document.querySelector('.ant-dropdown')).toBeDefined();
    });
  });
});

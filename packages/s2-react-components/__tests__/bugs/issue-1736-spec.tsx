/**
 * @description spec for issue #1736
 * https://github.com/antvis/S2/issues/1736
 * Export dropdown visible state error
 */
import { Export } from '@/components';
import { waitFor } from '@testing-library/react';
import React from 'react';
import type { Root } from 'react-dom/client';
import {
  getMockSheetInstance,
  renderComponent,
} from '../../../s2-react/__tests__/util/helpers';

describe('header export component render tests', () => {
  let unmount: Root['unmount'];

  afterEach(() => {
    unmount?.();
  });

  test('should render export dropdown menu', async () => {
    const sheet = getMockSheetInstance();

    unmount = renderComponent(
      <Export
        sheet={sheet}
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

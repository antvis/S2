/**
 * @description spec for issue #1736
 * https://github.com/antvis/S2/issues/1736
 * Export dropdown visible state error
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getMockSheetInstance, getContainer } from 'tests/util/helpers';
import { waitFor } from '@testing-library/react';
import { Export } from '@/components/export';

describe('header export component render tests', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  test('should render export and dropdown keep invisible', async () => {
    act(() => {
      const sheet = getMockSheetInstance();

      ReactDOM.render(<Export sheet={sheet} open={true} />, container);
    });

    await waitFor(() => {
      // export 组件
      expect(document.querySelector('.antv-s2-export')).toBeDefined();

      // dropdown 不应该渲染
      expect(document.querySelector('.ant-dropdown')).toBe(null);
    });
  });

  test('should render export dropdown menu', async () => {
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
        container,
      );
    });

    await waitFor(() => {
      // dropdown组件
      expect(document.querySelector('.ant-dropdown')).toBeDefined();
    });
  });
});

import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { getContainer } from '../../../util/helpers';
import { act } from 'react-dom/test-utils';

import {
  DimensionSwitchPopover,
  DimensionSwitchDropdown,
  DimensionSwitchModal,
} from 'src/components/dimension-switch';
import { DimensionType } from 'src/components/dimension-switch/dimension';

function MainLayout() {
  const data: DimensionType[] = [
    {
      type: 'measure',
      displayName: '维值',
      items: [
        {
          id: 'pv1',
          displayName: '点击pv',
          checked: true,
        },
        {
          id: 'uv1',
          displayName: '点击uv',
          checked: false,
        },
        {
          id: 'pv2',
          displayName: '访问pv',
          checked: true,
        },
        {
          id: 'pv2',
          displayName: '访问ppv',
          checked: true,
        },
      ],
    },
    {
      type: 'value',
      displayName: '指标数值',
      items: [
        {
          id: 'pv1',
          displayName: '点击pv',
          checked: false,
        },
        {
          id: 'uv1',
          displayName: '点击uv',
          checked: true,
        },
        {
          id: 'pv2',
          displayName: '访问pv',
          checked: true,
        },
        {
          id: 'pv2',
          displayName: '访问ppv',
          checked: true,
        },
      ],
    },
  ];
  const content = (
    <>
      <p>Content</p>
      <p>Content</p>
    </>
  );
  return (
    <div>
      <DimensionSwitchPopover data={data} />
      <DimensionSwitchDropdown dimension={data[0]} />
      <DimensionSwitchModal data={data} />
    </div>
  );
}

describe('Dimension Switch Test', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});

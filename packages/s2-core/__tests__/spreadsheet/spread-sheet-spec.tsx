import { ThemeName } from '@/index';
import { Radio, Space, Switch } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';
import { CustomTooltip } from './custom/custom-tooltip';

function MainLayout() {
  const [render, setRender] = React.useState(true);

  const [spotLight, setSpotLight] = React.useState(true);
  const [hoverHighlight, setHoverHighlight] = React.useState(true);
  const [showPagination, setShowPagination] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(true);

  const [themeName, setThemeName] = React.useState<ThemeName>('default');

  const onToggleRender = () => {
    setRender(!render);
  };

  const onRadioChange = (e) => {
    setThemeName(e.target.value);
  };
  const mergedOptions = {
    pagination: showPagination && {
      pageSize: 20,
      current: 1,
    },
    tooltip: {
      showTooltip: showTooltip,
      renderTooltip: (spreadsheet) => {
        return new CustomTooltip(spreadsheet);
      },
    },
    selectedCellsSpotlight: spotLight,
    hoverHighlight: hoverHighlight,
  };
  return (
    <div>
      <Space size="middle" style={{ marginBottom: 20 }}>
        <Switch
          checkedChildren="渲染组件"
          unCheckedChildren="卸载组件"
          defaultChecked={render}
          onChange={onToggleRender}
        />
      </Space>
      {render && (
        <SheetEntry
          dataCfg={{}}
          options={mergedOptions}
          themeCfg={{ name: themeName }}
          header={
            <Space size="middle" style={{ marginBottom: 20 }}>
              <Radio.Group onChange={onRadioChange} defaultValue="default">
                <Radio.Button value="default">默认</Radio.Button>
                <Radio.Button value="simple">简约蓝</Radio.Button>
                <Radio.Button value="colorful">多彩蓝</Radio.Button>
              </Radio.Group>

              <Switch
                checkedChildren="分页"
                unCheckedChildren="不分页"
                checked={showPagination}
                onChange={setShowPagination}
              />
              <Switch
                checkedChildren="选中聚光灯开"
                unCheckedChildren="选中聚光灯关"
                checked={spotLight}
                onChange={setSpotLight}
              />
              <Switch
                checkedChildren="hover十字器开"
                unCheckedChildren="hover十字器关"
                checked={hoverHighlight}
                onChange={setHoverHighlight}
              />

              <Switch
                checkedChildren="tooltip打开"
                unCheckedChildren="tooltip关闭"
                checked={showTooltip}
                onChange={setShowTooltip}
              />
            </Space>
          }
        />
      )}
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

import React, { useState, useEffect } from 'react';
import { debounce, isObjectLike } from 'lodash';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { S2DataConfig, getPalette } from '@antv/s2';
import { SketchPicker } from 'react-color';
import { Row, Space, Input, Button, message, Popover, Table } from 'antd';
import copy from 'copy-to-clipboard';

import '@antv/s2-react/dist/style.min.css';

const s2Options: SheetComponentOptions = {
  width: 500,
  height: 300,
  conditions: {
    interval: [
      {
        field: 'number',
        mapping: () => ({}),
      },
    ],
  },
  interaction: {
    linkFields: ['city'],
  },
};

const STORE_KEY = 'S2_TEST_PALETTE';

/** 色板颜色说明 */
const paletteDesc = [
  '角头字体、列头字体',
  '行头背景、数据格背景(斑马纹)',
  '行头&数据格交互(hover、选中、十字)',
  '角头背景、列头背景',
  '列头交互(hover、选中)',
  '刷选遮罩',
  '行头 link',
  'mini bar、resize 交互(参考线等)',
  '数据格背景(非斑马纹)、整体表底色(建议白色)',
  '行头边框、数据格边框',
  '角头边框、列头边框',
  '竖向大分割线',
  '横向大分割线',
  '数据格字体',
  '行头字体、数据格交互色(hover)',
];

function getInitPalette() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '');
  } catch (err) {}

  return getPalette('colorful');
}

const savePalette = debounce((palette) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(palette));
  console.log('saved');
}, 1000);

function useDataCfg() {
  const [dataCfg, setDataCfg] = useState<S2DataConfig>(null);

  useEffect(() => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
    )
      .then((res) => res.json())
      .then((res) => setDataCfg(res));
  }, []);

  return dataCfg;
}

function ColorTable({ palette, onChange }) {
  const columns = [
    {
      title: '#',
      render(r, v, idx) {
        return idx + 1;
      },
    },
    {
      title: '色值',
      dataIndex: 'color',
    },
    {
      title: '点击调整',
      dataIndex: 'color',
      render(val, _, idx) {
        return (
          <Popover
            trigger="click"
            content={
              <SketchPicker
                disableAlpha
                presetColors={[]}
                color={val}
                onChangeComplete={(evt) => {
                  const nextBasicColors = [...palette.basicColors];

                  nextBasicColors.splice(idx, 1, evt.hex);
                  onChange({
                    ...palette,
                    basicColors: nextBasicColors,
                  });
                }}
              />
            }
          >
            <Row justify="center">
              <div
                style={{
                  width: 30,
                  height: 30,
                  boxShadow: `0 0 8px rgba(0, 0, 0, 0.2)`,
                  cursor: 'pointer',
                  backgroundColor: val,
                }}
              />
            </Row>
          </Popover>
        );
      },
    },
    {
      title: '说明',
      dataIndex: 'desc',
    },
  ];

  const dataSource = palette.basicColors.map((color, idx) => ({
    color,
    desc: paletteDesc[idx],
  }));

  return (
    <Table
      size="small"
      rowKey="desc"
      bordered
      columns={columns}
      pagination={false}
      dataSource={dataSource}
    />
  );
}

function App() {
  const dataCfg = useDataCfg();
  const [palette, setPalette] = useState(getInitPalette());
  const [config, setConfig] = useState('');

  useEffect(() => {
    savePalette(palette);
  }, [palette]);

  if (!dataCfg) {
    return null;
  }

  return (
    <Space direction="vertical">
      <SheetComponent
        dataCfg={dataCfg}
        options={s2Options}
        themeCfg={{ palette }}
      />
      <Space>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            copy(JSON.stringify(palette));
            message.success('复制成功');
          }}
        >
          复制当前色板配置
        </Button>
        <Button
          size="small"
          danger
          onClick={() => {
            setPalette(getPalette('colorful'));
          }}
        >
          重置为默认色板配置
        </Button>
      </Space>
      <Space>
        <Input
          size="small"
          placeholder="粘贴色板 JSON 配置"
          onChange={(evt) => setConfig(evt.target.value)}
          style={{
            width: 180,
          }}
          value={config}
        />
        <Button
          size="small"
          disabled={!config}
          onClick={() => {
            try {
              const cfgObj = JSON.parse(config);

              if (!isObjectLike(cfgObj)) {
                message.error('加载错误');

                return;
              }

              setPalette(cfgObj);
              setConfig('');
              message.success('加载成功');
            } catch (err) {
              message.error('加载错误');
            }
          }}
        >
          设置色板配置
        </Button>
      </Space>
      <ColorTable palette={palette} onChange={setPalette} />
    </Space>
  );
}

reactDOMClient.createRoot(document.getElementById('container')).render(<App />);

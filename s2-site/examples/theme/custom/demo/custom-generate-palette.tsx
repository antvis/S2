import React, { useEffect, useState } from 'react';
import { getPalette, generatePalette, ThemeCfg } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { ChromePicker } from 'react-color';
import { Button, Popover, Space } from 'antd';

import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    function App() {
      const [themeColor, setThemeColor] = useState('#EA1720');
      const [themeCfg, setThemeCfg] = useState<ThemeCfg>({
        name: 'colorful',
      });

      const updatePalette = (newThemeColor) => {
        // 使用内置的 colorful 色板作为参考色板
        const palette = getPalette(themeCfg.name);
        // 使用参考色板 & 主题色值生成新色板
        const newPalette = generatePalette({
          ...palette,
          brandColor: newThemeColor,
        });

        // 使用新色板设置主题
        setThemeCfg({
          name: themeCfg.name,
          palette: newPalette,
        });
      };

      useEffect(() => {
        updatePalette(themeColor);
      }, []);

      return (
        <Space direction="vertical">
          <Space>
            <span>当前主题色: {themeColor}</span>
            <Popover
              placement="bottomRight"
              content={
                <ChromePicker
                  disableAlpha
                  color={themeColor}
                  onChangeComplete={(color) => {
                    setThemeColor(color.hex);
                    updatePalette(color.hex);
                  }}
                />
              }
            >
              <Button size="small" style={{ marginLeft: 20 }}>
                主题色调整
              </Button>
            </Popover>
          </Space>
          <SheetComponent
            dataCfg={dataCfg}
            options={s2Options}
            themeCfg={themeCfg}
          />
        </Space>
      );
    }

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App />);
  });

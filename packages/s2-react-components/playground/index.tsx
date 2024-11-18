/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { type SpreadSheet, type ThemeCfg, type ThemeName } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import { ConfigProvider, Space } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FrozenPanel, TextAlignPanel, ThemePanel } from '../src';
import { SheetHeader } from './Header';
import { s2DataConfig, s2Options } from './config';
import { onSheetMounted } from './utils';

import '@antv/s2-react/dist/s2-react.min.css';
import './index.less';

function MainLayout() {
  const s2Ref = React.useRef<SpreadSheet>();
  const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>({
    name: 'default',
  });

  return (
    <ConfigProvider locale={zhCN}>
      <div className="playground">
        <React.StrictMode>
          <SheetHeader sheetInstance={s2Ref.current!} />
          <Space className="config">
            <>
              <ThemePanel
                title="主题配置"
                disableCustomPrimaryColorPicker={false}
                defaultCollapsed={false}
                onChange={(options, theme) => {
                  setThemeCfg({
                    name: options.themeType as ThemeName,
                    theme,
                  });
                  s2Ref.current?.setOptions({
                    hierarchyType: options.hierarchyType,
                  });
                  s2Ref.current?.render(false);
                  console.log('onChange:', options, theme);
                }}
                onReset={(options, prevOptions, theme) => {
                  console.log('onReset:', options, prevOptions, theme);
                }}
              />
              <TextAlignPanel
                title="文字对齐"
                defaultCollapsed={false}
                onChange={(options, theme) => {
                  setThemeCfg({
                    theme,
                  });
                  s2Ref.current?.render(false);
                  console.log('onChange:', options, theme);
                }}
                onReset={(options, prevOptions, theme) => {
                  console.log('onReset:', options, prevOptions, theme);
                }}
              />
              <FrozenPanel
                title="冻结行列头"
                defaultCollapsed={false}
                inputNumberProps={{
                  size: 'small',
                  step: 1,
                }}
                defaultOptions={{
                  frozenRow: [1, 2],
                }}
                onChange={(options) => {
                  const [rowCount = 0, trailingRowCount = 0] =
                    options.frozenRow;
                  const [colCount = 0, trailingColCount = 0] =
                    options.frozenCol;

                  s2Ref.current?.setOptions({
                    frozen: {
                      rowHeader: options.frozenRowHeader,
                      rowCount,
                      colCount,
                      trailingRowCount,
                      trailingColCount,
                    },
                  });
                  s2Ref.current?.render(false);
                  console.log('onChange:', options);
                }}
                onReset={(options, prevOptions) => {
                  console.log('onReset:', options, prevOptions);
                }}
              />
            </>
          </Space>
          <SheetComponent
            ref={s2Ref}
            dataCfg={s2DataConfig}
            options={s2Options}
            sheetType="pivot"
            themeCfg={themeCfg}
            onMounted={onSheetMounted}
            adaptive
          />
        </React.StrictMode>
      </div>
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')!).render(<MainLayout />);

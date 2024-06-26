/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import {
  getLang,
  type SpreadSheet,
  type ThemeCfg,
  type ThemeName,
} from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import reactPkg from '@antv/s2-react/package.json';
import corePkg from '@antv/s2/package.json';
import { version as AntdVersion, Space, Tag } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import pkg from '../package.json';
import { FrozenPanel, TextAlignPanel, ThemePanel } from '../src';
import { s2DataConfig, s2Options } from './config';

import '@antv/s2-react/dist/s2-react.min.css';
import './index.less';
import { onSheetMounted } from './utils';

function MainLayout() {
  const s2Ref = React.useRef<SpreadSheet>();
  const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>({
    name: 'default',
  });

  return (
    <div className="playground">
      <React.StrictMode>
        <Space className="config">
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
              const [rowCount = 0, trailingRowCount = 0] = options.frozenRow;
              const [colCount = 0, trailingColCount = 0] = options.frozenCol;

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
        </Space>
        <SheetComponent
          ref={s2Ref}
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="pivot"
          themeCfg={themeCfg}
          onMounted={onSheetMounted}
          header={{
            title: (
              <a href="https://github.com/antvis/S2">{pkg.name} playground</a>
            ),
            description: (
              <Space>
                <span>
                  {reactPkg.name}: <Tag>{reactPkg.version}</Tag>
                </span>
                <span>
                  {corePkg.name}: <Tag>{corePkg.version}</Tag>
                </span>
                <span>
                  antd: <Tag>{AntdVersion}</Tag>
                </span>
                <span>
                  react: <Tag>{React.version}</Tag>
                </span>
                <span>
                  lang: <Tag>{getLang()}</Tag>
                </span>
              </Space>
            ),
            switcher: { open: true },
            export: { open: true },
            advancedSort: {
              open: true,
            },
          }}
        />
      </React.StrictMode>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<MainLayout />);

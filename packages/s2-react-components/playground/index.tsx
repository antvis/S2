/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { getLang } from '@antv/s2';
import { Switcher } from '@antv/s2-react';
import { version as AntdVersion, Space, Tag } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SheetComponent } from '@antv/s2-react';
import reactPkg from '@antv/s2-react/package.json';
import corePkg from '@antv/s2/package.json';
import pkg from '../package.json';
import { s2DataConfig, s2Options } from './config';

import '@antv/s2-react/dist/style.min.css';
import './index.less';

function MainLayout() {
  return (
    <div className="playground">
      <React.StrictMode>
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="pivot"
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

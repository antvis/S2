/* eslint-disable no-console */
import { ExportOutlined } from '@ant-design/icons';
import { getLang } from '@antv/s2';
import {
  AdvancedSort,
  Export,
  Switcher,
  type SwitcherProps,
} from '@antv/s2-react-components';
import reactComponentsPkg from '@antv/s2-react-components/package.json';
import corePkg from '@antv/s2/package.json';
import { version as AntdVersion, App, Button, Space, Tag } from 'antd';
import cx from 'classnames';
import React from 'react';
import pkg from '../../../package.json';
import { usePlaygroundContext } from '../../context/playground.context';
import './index.less';

export interface HeaderProps {}

const switcherFields: SwitcherProps = {
  rows: {
    items: [{ id: 'province' }, { id: 'city' }],
    allowEmpty: false,
  },
  columns: {
    items: [{ id: 'type', displayName: '类型 (type)' }],
  },
  values: {
    selectable: true,
    items: [
      { id: 'price', checked: true },
      { id: 'cost', checked: false },
    ],
  },
};

export const PlaygroundSheetHeader: React.FC<HeaderProps> = React.memo(() => {
  const context = usePlaygroundContext();
  const sheetInstance = context.ref?.current!;
  const PRE_CLASS = `sheet-header`;

  const onSubmit: SwitcherProps['onSubmit'] = (result) => {
    console.log('result:', result);
  };

  const renderExtra = () => (
    <Space align="center">
      <Switcher {...switcherFields} title="行列切换" onSubmit={onSubmit} />
      <AdvancedSort
        sheetInstance={sheetInstance}
        onSortConfirm={(ruleValues, sortParams) => {
          console.log('AdvancedSort:', ruleValues, sortParams);
        }}
      />
      <Export sheetInstance={sheetInstance}>
        <Button type="text" icon={<ExportOutlined />}>
          导出数据
        </Button>
      </Export>
      <Export sheetInstance={sheetInstance} />
    </Space>
  );

  return (
    <App>
      <div
        className={cx(PRE_CLASS)}
        style={{
          width: sheetInstance?.options.width,
        }}
      >
        <div className={`${PRE_CLASS}-heading`}>
          <div className={`${PRE_CLASS}-heading-left`}>
            <div className={`${PRE_CLASS}-heading-title`}>
              <a href="https://github.com/antvis/S2">{pkg.name} playground</a>
            </div>
          </div>
          <div className={`${PRE_CLASS}-heading-extra`}>{renderExtra()}</div>
        </div>
        <div className={`${PRE_CLASS}-content`}>
          <Space>
            <span>
              {pkg.name}: <Tag>{pkg.version}</Tag>
            </span>
            <span>
              {corePkg.name}: <Tag>{corePkg.version}</Tag>
            </span>
            <span>
              {reactComponentsPkg.name}: <Tag>{reactComponentsPkg.version}</Tag>
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
        </div>
      </div>
    </App>
  );
});

PlaygroundSheetHeader.displayName = 'PlaygroundSheetHeader';

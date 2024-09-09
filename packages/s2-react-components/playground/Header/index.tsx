/* eslint-disable no-console */
import { NodeExpandOutlined } from '@ant-design/icons';
import { getLang, type SpreadSheet } from '@antv/s2';
import reactPkg from '@antv/s2-react/package.json';
import corePkg from '@antv/s2/package.json';
import {
  version as AntdVersion,
  App,
  Button,
  Popover,
  Space,
  Tag,
  message,
} from 'antd';
import cx from 'classnames';
import React from 'react';
import pkg from '../../package.json';
import {
  AdvancedSort,
  DrillDown,
  Export,
  Switcher,
  type SwitcherProps,
} from '../../src';
import './index.less';

export interface HeaderProps {
  sheetInstance: SpreadSheet;
}

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
  title: '行列切换',
  onSubmit(result) {
    console.log('result:', result);
  },
};

export const SheetHeader: React.FC<HeaderProps> = React.memo((props) => {
  const { sheetInstance } = props;
  const PRE_CLASS = `sheet-header`;

  const renderExtra = () => (
    <Space align="center">
      <Switcher {...switcherFields} />
      <AdvancedSort
        sheetInstance={sheetInstance}
        onSortConfirm={(ruleValues, sortParams) => {
          console.log('AdvancedSort:', ruleValues, sortParams);
        }}
      />
      <Popover
        trigger="click"
        content={
          <DrillDown
            title="下钻"
            clearText="还原"
            searchText="搜索"
            disabledFields={['name']}
            dataSet={[
              {
                name: '性别',
                value: 'sex',
                type: 'text',
              },
              {
                name: '姓名',
                value: 'name',
                type: 'text',
              },
              {
                name: '城市',
                value: 'city',
                type: 'location',
              },
              {
                name: '日期',
                value: 'date',
                type: 'date',
              },
            ]}
          />
        }
      >
        <Button type="text" icon={<NodeExpandOutlined />}>
          下钻面板
        </Button>
      </Popover>
      <Export
        sheetInstance={sheetInstance}
        onCopySuccess={(data) => {
          message.success('复制成功');
          console.log('copy success:', data);
        }}
        onCopyError={(error) => {
          message.error('复制失败');
          console.log('copy failed:', error);
        }}
        onDownloadSuccess={(data) => {
          message.success('下载成功');
          console.log('download success', data);
        }}
        onDownloadError={(error) => {
          message.error('下载失败');
          console.log('download failed:', error);
        }}
      />
    </Space>
  );

  return (
    <App>
      <div
        className={cx(PRE_CLASS)}
        style={{
          width: 1000,
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
              {reactPkg.name}: <Tag>{reactPkg.version}</Tag>
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

SheetHeader.displayName = 'SheetHeader';

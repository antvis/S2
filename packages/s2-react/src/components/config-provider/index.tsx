import React from 'react';
import { ConfigProvider as AntdConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import { getLang } from '@antv/s2';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const { children } = props;
  const locale = getLang() === 'zh_CN' ? zhCN : enUS;

  return <AntdConfigProvider locale={locale}>{children}</AntdConfigProvider>;
};

import { getLang, type ThemeName } from '@antv/s2';
import { ConfigProvider as AntdConfigProvider, theme } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';

export interface ConfigProviderProps {
  children: React.ReactNode;
  themeName?: ThemeName;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const { children, themeName } = props;
  const locale = getLang() === 'zh_CN' ? zhCN : enUS;
  const isDarkTheme = themeName === 'dark';

  return (
    <AntdConfigProvider
      locale={locale}
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </AntdConfigProvider>
  );
};

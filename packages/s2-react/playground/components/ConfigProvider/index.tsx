import { getLang, type ThemeName } from '@antv/s2';
import { ConfigProvider as AntdConfigProvider, theme } from 'antd';
import enUS from 'antd/es/locale/en_US';
import ruRU from 'antd/es/locale/ru_RU';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';

interface PlaygroundSheetConfigProviderProps {
  children: React.ReactNode;
  themeName?: ThemeName;
}

export const PlaygroundSheetConfigProvider: React.FC<
  PlaygroundSheetConfigProviderProps
> = (props) => {
  const { children, themeName } = props;
  const lang = getLang();
  // eslint-disable-next-line no-nested-ternary
  const locale = lang === 'zh_CN' ? zhCN : lang === 'ru_RU' ? ruRU : enUS;
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

import { BgColorsOutlined } from '@ant-design/icons';
import { S2_PREFIX_CLS, i18n, type S2Theme } from '@antv/s2';
import type { SheetComponentOptions } from '@antv/s2-react/src';
import {
  Popover,
  Tooltip,
  type RadioChangeEvent,
  type RadioGroupProps,
} from 'antd';
import React from 'react';
import {
  DEFAULT_THEME_COLOR_LIST,
  SheetThemeColorType,
  SheetThemeType,
} from '../../../common';
import { ResetGroup } from '../../common';
import { RadioGroup } from '../../common/radio-group';
import { ColorBox } from './color-box';
import { ColorPickerPanel } from './color-picker-panel';
import {
  BasicThemeIcon,
  ColorfulThemeIcon,
  HierarchyGridTypeIcon,
  HierarchyTreeTypeIcon,
  NormalThemeIcon,
  ZebraThemeIcon,
} from './icons';
import './index.less';
import { generateColorTheme } from './utils';

export interface ThemePanelOptions {
  hierarchyType: SheetComponentOptions['hierarchyType'];
  themeType: SheetThemeType;
  colorType: SheetThemeColorType;
}

export interface ThemePanelProps {
  children?: React.ReactNode;
  maxCustomColorCount?: number;
  onChange?: (options: ThemePanelOptions, theme: S2Theme) => void;
}

const PRE_CLASS = `${S2_PREFIX_CLS}-theme-panel`;

export const ThemePanel: React.FC<ThemePanelProps> = React.memo((props) => {
  const { maxCustomColorCount, children, onChange } = props;
  const [options, setOptions] = React.useState<ThemePanelOptions>({
    hierarchyType: 'grid',
    themeType: SheetThemeType.DEFAULT,
    colorType: SheetThemeColorType.PRIMARY,
  });
  const [customColor, setCustomColor] = React.useState<string>(
    DEFAULT_THEME_COLOR_LIST[0],
  );

  /** 重置主题区块设置 */
  const onReset = () => {};

  const renderCustomColorSelectPanel = () => {
    return (
      <ColorPickerPanel
        maxCustomColorCount={maxCustomColorCount}
        color={customColor}
        onChange={setCustomColor}
      />
    );
  };

  const renderCustomColorSection = () => {
    if (options.colorType !== SheetThemeColorType.CUSTOM) {
      // 仅自定义颜色才渲染本组件
      return null;
    }

    return (
      <div className={`${PRE_CLASS}-custom-color`}>
        <div>
          <span className={`${PRE_CLASS}-custom-color-title`}>
            {i18n('自定义颜色')}
          </span>
          <Popover
            placement="rightTop"
            content={renderCustomColorSelectPanel()}
            trigger="click"
          >
            <ColorBox color={customColor ?? DEFAULT_THEME_COLOR_LIST[0]} />
          </Popover>
        </div>
      </div>
    );
  };

  const onOptionsChange =
    (field: keyof ThemePanelOptions) => (e: RadioChangeEvent) => {
      const newOptions: ThemePanelOptions = {
        ...options,
        [field]: e.target.value,
      };

      setOptions(newOptions);
    };

  const renderIcon = (title: React.ReactNode, Component: React.ReactNode) => {
    return (
      <Tooltip title={title}>
        <>{Component}</>
      </Tooltip>
    );
  };

  React.useEffect(() => {
    const theme = generateColorTheme({
      themeType: options.themeType,
      colorType: options.colorType,
      customColor,
    });

    onChange?.(options, theme!);
  }, [options, customColor]);

  const hierarchyTypeOptions: RadioGroupProps['options'] = [
    { label: i18n('平铺'), value: 'grid', component: HierarchyGridTypeIcon },
    { label: i18n('树状'), value: 'tree', component: HierarchyTreeTypeIcon },
  ].map(({ label, value, component: Component }) => {
    return {
      label: renderIcon(
        label,
        <Component active={options.hierarchyType === value} />,
      ),
      value,
    };
  });

  const themeTypeOptions: RadioGroupProps['options'] = [
    {
      label: i18n('默认'),
      value: SheetThemeType.DEFAULT,
      component: BgColorsOutlined,
    },
    {
      label: i18n('多彩风'),
      value: SheetThemeType.COLORFUL,
      component: ColorfulThemeIcon,
    },
    {
      label: i18n('简约风'),
      value: SheetThemeType.NORMAL,
      component: NormalThemeIcon,
    },
    {
      label: i18n('极简风'),
      value: SheetThemeType.BASIC,
      component: BasicThemeIcon,
    },
    {
      label: i18n('斑马纹风'),
      value: SheetThemeType.ZEBRA,
      component: ZebraThemeIcon,
    },
  ].map(({ label, value, component: Component }) => ({
    label: renderIcon(
      label,
      <Component active={options.themeType === value} />,
    ),
    value,
  }));

  return (
    <ResetGroup title={i18n('主题风格')} onReset={onReset}>
      {children}
      <RadioGroup
        label={i18n('类型')}
        optionType="button"
        value={options.hierarchyType}
        onChange={onOptionsChange('hierarchyType')}
        options={hierarchyTypeOptions}
        onlyIcon
      />
      <RadioGroup
        label={i18n('主题')}
        optionType="button"
        value={options.themeType}
        onChange={onOptionsChange('themeType')}
        options={themeTypeOptions}
        onlyIcon
      />
      <RadioGroup
        label={i18n('主色系')}
        optionType="button"
        value={options.colorType}
        onChange={onOptionsChange('colorType')}
        options={[
          { label: i18n('深色主题'), value: SheetThemeColorType.PRIMARY },
          { label: i18n('浅色主题'), value: SheetThemeColorType.SECONDARY },
          { label: i18n('灰色'), value: SheetThemeColorType.GRAY },
          {
            label: i18n('自定义'),
            value: SheetThemeColorType.CUSTOM,
          },
        ]}
        extra={renderCustomColorSection()}
      />
    </ResetGroup>
  );
});

ThemePanel.displayName = 'ThemePanel';

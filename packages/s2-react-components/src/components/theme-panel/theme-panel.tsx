import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import { Popover, type RadioChangeEvent, type RadioGroupProps } from 'antd';
import React from 'react';
import {
  DEFAULT_THEME_COLOR_LIST,
  SheetThemeColorType,
  SheetThemeType,
} from '../../common';
import { ResetGroup, TooltipWrapper } from '../common';
import { RadioGroup } from '../common/radio-group/radio-group';
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
import type { ThemePanelOptions, ThemePanelProps } from './interface';
import { generateColorTheme } from './utils';

const PRE_CLASS = `${S2_PREFIX_CLS}-theme-panel`;

export const ThemePanel: React.FC<ThemePanelProps> = React.memo((props) => {
  const {
    title = i18n('主题风格'),
    maxHistoryColorCount,
    disableCustomPrimaryColorPicker = false,
    defaultOptions: defaultThemePanelOptions,
    defaultCollapsed = false,
    children,
    onChange,
    onReset,
  } = props;
  const [options, setOptions] = React.useState<ThemePanelOptions>({
    hierarchyType: 'grid',
    themeType: SheetThemeType.DEFAULT,
    colorType: SheetThemeColorType.PRIMARY,
    ...defaultThemePanelOptions,
  });
  const defaultOptions = React.useRef<ThemePanelOptions>(options);
  const [customColor, setCustomColor] = React.useState<string>(
    DEFAULT_THEME_COLOR_LIST[0],
  );

  const onResetClick = () => {
    const theme = generateColorTheme({
      themeType: defaultOptions.current.themeType,
      colorType: defaultOptions.current.colorType,
      customColor,
    });

    setOptions(defaultOptions.current);
    onReset?.(defaultOptions.current, options, theme!);
  };

  const renderCustomColorSelectPanel = () => {
    return (
      <ColorPickerPanel
        maxHistoryColorCount={maxHistoryColorCount}
        primaryColor={customColor}
        onChange={setCustomColor}
      />
    );
  };

  const renderCustomColorSection = () => {
    if (
      options.colorType !== SheetThemeColorType.CUSTOM ||
      disableCustomPrimaryColorPicker
    ) {
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

  React.useEffect(() => {
    const theme = generateColorTheme({
      themeType: options.themeType,
      colorType: options.colorType,
      customColor,
    });

    onChange?.(options, theme!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, customColor]);

  const hierarchyTypeOptions: RadioGroupProps['options'] = [
    { label: i18n('平铺'), value: 'grid', component: HierarchyGridTypeIcon },
    { label: i18n('树状'), value: 'tree', component: HierarchyTreeTypeIcon },
  ].map(({ label, value, component: Component }) => {
    return {
      label: (
        <TooltipWrapper title={label}>
          <Component active={options.hierarchyType === value} />
        </TooltipWrapper>
      ),
      value,
    };
  });

  const themeTypeOptions: RadioGroupProps['options'] = [
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
    label: (
      <TooltipWrapper title={label}>
        <Component active={options.themeType === value} />
      </TooltipWrapper>
    ),
    value,
  }));

  const colorTypeOptions = React.useMemo<RadioGroupProps['options']>(() => {
    const defaultOptions: RadioGroupProps['options'] = [
      { label: i18n('深色主题'), value: SheetThemeColorType.PRIMARY },
      { label: i18n('浅色主题'), value: SheetThemeColorType.SECONDARY },
      { label: i18n('灰色'), value: SheetThemeColorType.GRAY },
    ];

    if (disableCustomPrimaryColorPicker) {
      return defaultOptions;
    }

    return [
      ...defaultOptions,
      {
        label: i18n('自定义'),
        value: SheetThemeColorType.CUSTOM,
      },
    ];
  }, [disableCustomPrimaryColorPicker]);

  return (
    <ResetGroup
      title={title}
      onResetClick={onResetClick}
      defaultCollapsed={defaultCollapsed}
      className={PRE_CLASS}
    >
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
        options={colorTypeOptions}
        extra={renderCustomColorSection()}
      />
    </ResetGroup>
  );
});

ThemePanel.displayName = 'ThemePanel';

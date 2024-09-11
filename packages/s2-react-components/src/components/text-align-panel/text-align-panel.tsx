import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import { type RadioChangeEvent } from 'antd';
import React from 'react';
import {
  RadioGroup,
  ResetGroup,
  TooltipWrapper,
  type RadioGroupProps,
} from '../common';
import { CenterAlignIcon, LeftAlignIcon, RightAlignIcon } from './icons';
import './index.less';
import type { TextAlignPanelOptions, TextAlignPanelProps } from './interface';
import { generateCellTextAlignTheme } from './utils';

const PRE_CLASS = `${S2_PREFIX_CLS}-text-align-panel`;

export const TextAlignPanel: React.FC<TextAlignPanelProps> = React.memo(
  (props) => {
    const {
      title = i18n('文字对齐'),
      defaultOptions: defaultTextAlignPanelOptions,
      defaultCollapsed = false,
      children,
      onChange,
      onReset,
    } = props;
    const [options, setOptions] = React.useState<TextAlignPanelOptions>({
      rowCellTextAlign: 'left',
      dataCellTextAlign: 'right',
      ...defaultTextAlignPanelOptions,
    });
    const defaultOptions = React.useRef<TextAlignPanelOptions>(options);

    const onResetClick = () => {
      const theme = generateCellTextAlignTheme(defaultOptions.current);

      setOptions(defaultOptions.current);
      onReset?.(defaultOptions.current, options, theme!);
    };

    const onOptionsChange =
      (field: keyof TextAlignPanelOptions) => (e: RadioChangeEvent) => {
        const newOptions: TextAlignPanelOptions = {
          ...options,
          [field]: e.target.value,
        };

        // 指标和列头对齐 (含 EXTRA_FIELD 虚拟列), 可单独调整指标
        if (field === 'colCellTextAlign') {
          newOptions.dataCellTextAlign = newOptions.colCellTextAlign;
        }

        setOptions(newOptions);
      };

    const getCellAlignOptions = (
      field: keyof TextAlignPanelOptions,
    ): RadioGroupProps['options'] =>
      [
        { label: i18n('左对齐'), value: 'left', component: LeftAlignIcon },
        { label: i18n('居中'), value: 'center', component: CenterAlignIcon },
        { label: i18n('右对齐'), value: 'right', component: RightAlignIcon },
      ].map(({ label, value, component: Component }) => {
        return {
          label: (
            <TooltipWrapper title={label}>
              <Component active={options[field] === value} />
            </TooltipWrapper>
          ),
          value,
        };
      });

    const getRadioGroupProps = (
      field: keyof TextAlignPanelOptions,
    ): Partial<RadioGroupProps> => {
      return {
        optionType: 'button',
        value: options[field],
        onChange: onOptionsChange(field),
        options: getCellAlignOptions(field),
        onlyIcon: true,
      };
    };

    React.useEffect(() => {
      const theme = generateCellTextAlignTheme(options);

      onChange?.(options, theme!);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    return (
      <ResetGroup
        title={title}
        onResetClick={onResetClick}
        defaultCollapsed={defaultCollapsed}
        className={PRE_CLASS}
      >
        {children}
        <RadioGroup
          label={i18n('表头')}
          {...getRadioGroupProps('colCellTextAlign')}
        />
        <RadioGroup
          label={i18n('表身 (维度)')}
          {...getRadioGroupProps('rowCellTextAlign')}
        />
        <RadioGroup
          label={i18n('表身 (指标)')}
          {...getRadioGroupProps('dataCellTextAlign')}
        />
      </ResetGroup>
    );
  },
);

TextAlignPanel.displayName = 'TextAlignPanel';

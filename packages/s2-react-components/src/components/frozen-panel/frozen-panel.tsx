import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { isEmpty } from 'lodash';
import React from 'react';
import { ResetGroup } from '../common';
import { FrozenInputNumber } from './frozen-input-number';
import './index.less';
import type { FrozenPanelOptions, FrozenPanelProps } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-frozen-panel`;

export const FrozenPanel: React.FC<FrozenPanelProps> = React.memo((props) => {
  const {
    title = i18n('冻结行列头'),
    defaultOptions: defaultTextAlignPanelOptions,
    defaultCollapsed = false,
    inputNumberProps,
    showFrozenRowHeader = true,
    showFrozenRow = true,
    showFrozenCol = true,
    children,
    onChange,
    onReset,
  } = props;
  const [options, setOptions] = React.useState<FrozenPanelOptions>({
    frozenRow: [],
    frozenCol: [],
    frozenRowHeader: true,
    ...defaultTextAlignPanelOptions,
  });
  const defaultOptions = React.useRef<FrozenPanelOptions>(options);

  const onResetClick = () => {
    setOptions(defaultOptions.current);
    onReset?.(defaultOptions.current, options);
  };

  const onRowHeaderChange = (event: CheckboxChangeEvent) => {
    const newOptions: FrozenPanelOptions = {
      ...options,
      frozenRowHeader: event.target.checked,
    };

    setOptions(newOptions);
    onChange?.(newOptions);
  };

  const BASE_FROZEN_CONFIG: Array<{
    field: keyof Omit<FrozenPanelOptions, 'frozenRowHeader'>;
    suffix: string;
    visible: boolean;
  }> = [
    {
      suffix: i18n('行'),
      field: 'frozenRow' as const,
      visible: showFrozenRow,
    },
    {
      suffix: i18n('列'),
      field: 'frozenCol' as const,
      visible: showFrozenCol,
    },
  ].filter(({ visible }) => visible);

  return (
    <ResetGroup
      title={title}
      onResetClick={onResetClick}
      defaultCollapsed={defaultCollapsed}
      className={PRE_CLASS}
    >
      {showFrozenRowHeader && (
        <div className={`${PRE_CLASS}-container`}>
          <Checkbox
            checked={options.frozenRowHeader}
            onChange={onRowHeaderChange}
          >
            {i18n('冻结行头')}
          </Checkbox>
        </div>
      )}
      {BASE_FROZEN_CONFIG.map((config) => {
        const leadingCount = options[config.field]?.[0];
        const trailingCount = options[config.field]?.[1];
        const enable = !isEmpty(options[config.field]);

        const onGroupChange = (value: [number?, number?]) => {
          const newOptions: FrozenPanelOptions = {
            ...options,
            [config.field]: value,
          };

          setOptions(newOptions);
          onChange?.(newOptions);
        };

        return (
          <div className={`${PRE_CLASS}-container`} key={config.field}>
            <Checkbox
              checked={enable}
              onChange={(event) => {
                onGroupChange(event.target.checked ? [1, 1] : []);
              }}
            >
              {i18n('冻结')}
              {config.suffix}
            </Checkbox>
            <span className={`${PRE_CLASS}-container-group`}>
              {i18n('冻结前')}
              <FrozenInputNumber
                disabled={!enable}
                value={leadingCount!}
                onChange={(val) => {
                  onGroupChange([val, trailingCount]);
                }}
                {...inputNumberProps}
              />
              {config.suffix}
            </span>
            <span className={`${PRE_CLASS}-container-group`}>
              {i18n('冻结后')}
              <FrozenInputNumber
                disabled={!enable}
                value={trailingCount!}
                onChange={(val) => {
                  onGroupChange([leadingCount, val]);
                }}
                {...inputNumberProps}
              />
              {config.suffix}
            </span>
          </div>
        );
      })}
      {children}
    </ResetGroup>
  );
});

FrozenPanel.displayName = 'FrozenPanel';

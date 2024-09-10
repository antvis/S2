import { SwapOutlined } from '@ant-design/icons';
import { i18n } from '@antv/s2';
import { Button, Popover } from 'antd';
import cls from 'classnames';
import React from 'react';
import { SwitcherContent } from './content';
import './index.less';
import type { SwitcherProps } from './interface';
import { getSwitcherClassName } from './util';

export const Switcher: React.FC<SwitcherProps> = React.memo(
  ({ title, icon, popover, disabled, children, ...otherProps }) => {
    const [visible, setVisible] = React.useState(false);
    const onToggleVisible = () => {
      setVisible((prev) => !prev);
    };

    return (
      <Popover
        open={!disabled && visible}
        content={
          <SwitcherContent {...otherProps} onToggleVisible={onToggleVisible} />
        }
        onOpenChange={onToggleVisible}
        trigger="click"
        placement="bottomLeft"
        destroyTooltipOnHide
        {...popover}
        overlayClassName={cls(
          getSwitcherClassName('switcher-overlay'),
          popover?.overlayClassName,
        )}
      >
        {children || (
          <Button
            className={getSwitcherClassName('entry-button')}
            size="small"
            disabled={disabled}
            icon={icon || <SwapOutlined rotate={90} />}
          >
            {title || i18n('行列切换')}
          </Button>
        )}
      </Popover>
    );
  },
);

Switcher.displayName = 'Switcher';

import { Button, Popover, type PopoverProps } from 'antd';
import React, {
  type FC,
  type ReactNode,
  useState,
  isValidElement,
} from 'react';
import { i18n } from '@antv/s2';
import cls from 'classnames';
import { SwitcherIcon } from '../icons';
import { SwitcherContent, type SwitcherContentProps } from './content';
import { getSwitcherClassName } from './util';
import './index.less';

export interface SwitcherProps
  extends Omit<SwitcherContentProps, 'onToggleVisible'> {
  title?: ReactNode;
  // ref: https://ant.design/components/popover-cn/#API
  popover?: PopoverProps;
  disabled?: boolean;
}

export const Switcher: FC<SwitcherProps> = React.memo(
  ({ title, popover, disabled, ...otherProps }) => {
    const [visible, setVisible] = useState(false);
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
        {isValidElement(title) ? (
          title
        ) : (
          <Button
            className={getSwitcherClassName('entry-button')}
            size="small"
            disabled={disabled}
            icon={<SwitcherIcon />}
          >
            {title || i18n('行列切换')}
          </Button>
        )}
      </Popover>
    );
  },
);

Switcher.displayName = 'Switcher';

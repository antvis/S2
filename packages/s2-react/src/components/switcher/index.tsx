import { Button, Popover } from 'antd';
import React, { FC, ReactNode, useState } from 'react';
import { SwitcherIcon } from '../icons';
import { SwitcherContent, SwitcherContentProps } from './content';
import './index.less';
import { getSwitcherClassName } from './util';
import { i18n } from '@/common/i18n';

export interface SwitcherProps
  extends Omit<SwitcherContentProps, 'onToggleVisible'> {
  title?: ReactNode;
  triggerClassName?: string;
  overlayClassName?: string;
}

export const Switcher: FC<SwitcherProps> = ({
  title,
  triggerClassName,
  overlayClassName,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const onToggleVisible = () => {
    setVisible((prev) => !prev);
  };

  return (
    <Popover
      className={triggerClassName}
      overlayClassName={overlayClassName}
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      destroyTooltipOnHide={true}
      content={<SwitcherContent {...props} onToggleVisible={onToggleVisible} />}
      onVisibleChange={onToggleVisible}
    >
      {title || (
        <Button
          className={getSwitcherClassName('entry-button')}
          size="small"
          icon={<SwitcherIcon />}
        >
          {i18n('行列切换')}
        </Button>
      )}
    </Popover>
  );
};

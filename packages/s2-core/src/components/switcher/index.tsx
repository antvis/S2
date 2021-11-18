import { Button, Popover, PopoverProps } from 'antd';
import React, { FC, ReactNode, useState } from 'react';
import { SwitcherIcon } from '../icons';
import { SwitcherContent, SwitcherContentProps } from './content';
import { getSwitcherClassName } from './util';
import { i18n } from '@/common/i18n';
import './index.less';

export interface SwitcherProps
  extends Omit<SwitcherContentProps, 'onToggleVisible'> {
  title?: ReactNode;
  // ref: https://ant.design/components/popover-cn/#API
  popover?: PopoverProps;
}

export const Switcher: FC<SwitcherProps> = ({
  title,
  popover,
  ...otherProps
}) => {
  const [visible, setVisible] = useState(false);

  const onToggleVisible = () => {
    setVisible((prev) => !prev);
  };

  return (
    <Popover
      visible={visible}
      content={
        <SwitcherContent {...otherProps} onToggleVisible={onToggleVisible} />
      }
      onVisibleChange={onToggleVisible}
      trigger="click"
      placement="bottomLeft"
      destroyTooltipOnHide
      {...popover}
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

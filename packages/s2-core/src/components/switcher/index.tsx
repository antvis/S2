import { Button, Popover } from 'antd';
import React, { FC, useRef, ReactNode } from 'react';
import { SwitcherIcon } from '../icons';
import {
  SwitcherContent,
  SwitcherContentProps,
  SwitcherContentRef,
} from './content';
import './index.less';
import { SwitcherResult } from './interface';
import { getSwitcherClassName } from './util';
import { i18n } from '@/common/i18n';

export interface SwitcherProps extends SwitcherContentProps {
  title?: ReactNode;
  onSubmit?: (result: SwitcherResult) => void;
}

export const Switcher: FC<SwitcherProps> = ({ title, onSubmit, ...props }) => {
  const ref = useRef<SwitcherContentRef>();
  return (
    <Popover
      overlayClassName={getSwitcherClassName()}
      placement="bottomLeft"
      trigger="click"
      destroyTooltipOnHide={true}
      content={<SwitcherContent {...props} ref={ref} />}
      onVisibleChange={(visible) => {
        if (!visible) {
          onSubmit?.(ref.current.getResult());
        }
      }}
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

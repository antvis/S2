import { Button, Popover } from 'antd';
import React, { FC, useRef } from 'react';
import { SwitcherIcon } from '../icons';
import { SwitcherContent, SwitcherContentRef } from './content';
import './index.less';
import { SwitchResult, SwitchState } from './interface';
import { getSwitcherClassName } from './util';
import { i18n } from '@/common/i18n';

export interface SwitcherProps extends SwitchState {
  onSubmit?: (result: SwitchResult) => void;
}

export const Switcher: FC<SwitcherProps> = ({ onSubmit, ...state }) => {
  const ref = useRef<SwitcherContentRef>();
  return (
    <Popover
      overlayClassName={getSwitcherClassName()}
      placement="bottomLeft"
      trigger="click"
      content={<SwitcherContent {...state} ref={ref} />}
      onVisibleChange={(visible) => {
        if (!visible) {
          onSubmit?.(ref.current.getResult());
        }
      }}
    >
      <Button
        className={getSwitcherClassName('entry-button')}
        size="small"
        icon={<SwitcherIcon />}
      >
        {i18n('行列切换')}
      </Button>
    </Popover>
  );
};

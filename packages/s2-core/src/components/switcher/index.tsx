import { Button, Popover } from 'antd';
import React, { FC, useRef } from 'react';
import { SwitcherIcon } from '../icons';
import { Result, State, SwitcherContent, SwitcherContentRef } from './content';
import './index.less';

export interface SwitcherProps extends State {
  onSubmit?: (result: Result) => void;
}

export const Switcher: FC<SwitcherProps> = ({ onSubmit, ...state }) => {
  const ref = useRef<SwitcherContentRef>();
  return (
    <Popover
      overlayClassName="s2-switcher"
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
        className={'switcher-button'}
        size="small"
        icon={<SwitcherIcon />}
      >
        行列切换
      </Button>
    </Popover>
  );
};

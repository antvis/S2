import { Button, Popover } from 'antd';
import React, { FC } from 'react';
import {} from 'react-beautiful-dnd';
import { SwitcherIcon } from '../icons';
import { SwitcherContent, SwitcherProps } from './content/content';

export const Switcher: FC<SwitcherProps> = (props) => {
  return (
    <Popover
      overlayClassName="s2-switcher"
      placement="bottomLeft"
      trigger="click"
      content={<SwitcherContent {...props} />}
      onVisibleChange={(visible) => {}}
    >
      <Button size="small" icon={<SwitcherIcon />}>
        行列切换
      </Button>
    </Popover>
  );
};

Switcher.defaultProps = {
  rows: [],
  cols: [],
  values: [],
};

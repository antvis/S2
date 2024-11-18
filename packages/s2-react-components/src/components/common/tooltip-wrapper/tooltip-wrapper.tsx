import { S2_PREFIX_CLS } from '@antv/s2';
import { Tooltip } from 'antd';
import cls from 'classnames';
import React from 'react';
import type { TooltipWrapperProps } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-tooltip-wrapper`;

export const TooltipWrapper: React.FC<TooltipWrapperProps> = React.memo(
  (props) => {
    const { title, children, className, ...attrs } = props;

    // 增加 <></> 用于 Tooltip 绑定事件
    return (
      <Tooltip title={title} className={cls(PRE_CLASS, className)} {...attrs}>
        <>{children}</>
      </Tooltip>
    );
  },
);

TooltipWrapper.displayName = 'TooltipWrapper';

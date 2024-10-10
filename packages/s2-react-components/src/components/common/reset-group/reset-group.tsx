import { CaretRightOutlined } from '@ant-design/icons';
import { S2_PREFIX_CLS } from '@antv/s2';
import { Collapse } from 'antd';
import cls from 'classnames';
import React from 'react';
import { ResetButton } from '../reset-button';
import './index.less';
import type { ResetGroupProps } from './interface';

const ACTIVE_KEY = 'RESET_GROUP';
const PRE_CLASS = `${S2_PREFIX_CLS}-reset-group`;

export const ResetGroup: React.FC<ResetGroupProps> = React.memo((props) => {
  const {
    title,
    defaultCollapsed = false,
    style,
    className,
    onResetClick,
    children,
  } = props;

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={!defaultCollapsed ? ACTIVE_KEY : ''}
      className={cls(PRE_CLASS, className)}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={style}
    >
      <Collapse.Panel
        key={ACTIVE_KEY}
        header={title}
        className={`${PRE_CLASS}-panel`}
        extra={
          <ResetButton
            onClick={(e) => {
              e.stopPropagation();
              onResetClick?.();
            }}
          />
        }
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  );
});

ResetGroup.displayName = 'ResetGroup';

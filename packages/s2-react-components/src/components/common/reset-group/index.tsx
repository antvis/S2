import { CaretRightOutlined } from '@ant-design/icons';
import { S2_PREFIX_CLS } from '@antv/s2';
import { Collapse } from 'antd';
import React from 'react';
import { ResetButton } from '../reset-button';

interface ResetGroupProps {
  title?: string;
  defaultActive?: boolean;
  onReset?: () => void;
  children?: React.ReactNode;
}

const ACTIVE_KEY = 'RESET_GROUP';
const PRE_CLASS = `${S2_PREFIX_CLS}-reset-group`;

export const ResetGroup: React.FC<ResetGroupProps> = React.memo((props) => {
  const {
    title,
    defaultActive = true,
    onReset: onResetClick,
    children,
  } = props;

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={defaultActive ? ACTIVE_KEY : ''}
      className={PRE_CLASS}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
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

import { ReloadOutlined } from '@ant-design/icons';
import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import React from 'react';
import './index.less';
import type { ResetButtonProps } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-reset-btn`;

export const ResetButton: React.FC<ResetButtonProps> = React.memo((props) => {
  const { title = i18n('重置'), onClick } = props;

  return (
    <span className={PRE_CLASS} onClick={onClick}>
      <ReloadOutlined className={`${PRE_CLASS}-icon`} />
      <span className={`${PRE_CLASS}-text`}>{title}</span>
    </span>
  );
});

ResetButton.displayName = 'ResetButton';

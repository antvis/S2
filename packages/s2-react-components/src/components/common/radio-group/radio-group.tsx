import { S2_PREFIX_CLS } from '@antv/s2';
import { Radio } from 'antd';
import cls from 'classnames';
import React from 'react';
import './index.less';
import type { RadioGroupProps } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-radio-group`;

export const RadioGroup: React.FC<RadioGroupProps> = React.memo((props) => {
  const { label, extra, onlyIcon, ...radioProps } = props;

  return (
    <div
      className={cls(PRE_CLASS, {
        [`${PRE_CLASS}-icon-only`]: onlyIcon,
      })}
    >
      <span className={`${PRE_CLASS}-label`}>{label}</span>
      <span className={`${PRE_CLASS}-content`}>
        <Radio.Group size="small" {...radioProps} />
        {extra}
      </span>
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

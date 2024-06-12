import { S2_PREFIX_CLS } from '@antv/s2';
import cls from 'classnames';
import React from 'react';
import './index.less';
import type { ColorBoxProps } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-color-box`;

export const ColorBox: React.FC<ColorBoxProps> = React.memo((props) => {
  const { color, className, onClick, ...restProps } = props;

  return (
    <div
      className={cls(PRE_CLASS, className)}
      style={{
        backgroundColor: color,
      }}
      onClick={onClick}
      {...restProps}
    />
  );
});

ColorBox.displayName = 'ColorBox';

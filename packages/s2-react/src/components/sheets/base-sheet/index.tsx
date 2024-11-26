import { S2_PREFIX_CLS } from '@antv/s2';
import { isFunction } from 'lodash';
import React from 'react';
import { useSpreadSheet } from '../../../hooks/useSpreadSheet';
import type { SheetComponentProps } from '../../sheets/interface';

import './index.less';

export const BaseSheet: React.FC<SheetComponentProps> = React.memo((props) => {
  const { containerRef, wrapperRef, pagination } = useSpreadSheet(props);
  const children = isFunction(props.children)
    ? props.children({ pagination })
    : props.children;

  return (
    <div ref={wrapperRef} className={`${S2_PREFIX_CLS}-wrapper`}>
      <div ref={containerRef} className={`${S2_PREFIX_CLS}-container`} />
      {children}
    </div>
  );
});

BaseSheet.displayName = 'BaseSheet';

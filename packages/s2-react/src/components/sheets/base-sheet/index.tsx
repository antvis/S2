import { S2_PREFIX_CLS } from '@antv/s2';
import { injectThemeVars } from '@antv/s2-shared';
import React from 'react';
import { useSpreadSheet } from '../../../hooks/useSpreadSheet';
import type { SheetComponentProps } from '../../sheets/interface';

import './index.less';

export const BaseSheet: React.FC<SheetComponentProps> = React.memo((props) => {
  const { containerRef, wrapperRef } = useSpreadSheet(props);

  React.useEffect(() => {
    injectThemeVars(props.themeCfg?.name);
  }, [props.themeCfg?.name]);

  return (
    <div ref={wrapperRef} className={`${S2_PREFIX_CLS}-wrapper`}>
      <div ref={containerRef} className={`${S2_PREFIX_CLS}-container`} />
      {props.children}
    </div>
  );
});

BaseSheet.displayName = 'BaseSheet';

import { S2_PREFIX_CLS } from '@antv/s2';
import { injectThemeVars } from '@antv/s2-shared';
import { Spin } from 'antd';
import React from 'react';
import { useSpreadSheet } from '../../../hooks/useSpreadSheet';
import { S2Pagination } from '../../pagination';
import type { SheetComponentProps } from '../../sheets/interface';

import './index.less';

export const BaseSheet: React.FC<SheetComponentProps> = React.memo((props) => {
  const { loading, containerRef, pagination, wrapperRef } =
    useSpreadSheet(props);

  React.useEffect(() => {
    injectThemeVars(props.themeCfg?.name);
  }, [props.themeCfg?.name]);

  return (
    <Spin spinning={loading} wrapperClassName={`${S2_PREFIX_CLS}-spin`}>
      <div ref={wrapperRef} className={`${S2_PREFIX_CLS}-wrapper`}>
        <div ref={containerRef} className={`${S2_PREFIX_CLS}-container`} />
        {pagination.showPagination && (
          <S2Pagination
            pagination={pagination.pagination}
            onChange={pagination.onChange}
            onShowSizeChange={pagination.onShowSizeChange}
          />
        )}
        {props.children}
      </div>
    </Spin>
  );
});

BaseSheet.displayName = 'BaseSheet';

import { getSafetyDataConfig, S2_PREFIX_CLS } from '@antv/s2';
import { Spin } from 'antd';
import React from 'react';
import { injectThemeVars } from '@antv/s2-shared';
import { useSpreadSheet } from '../../../hooks/useSpreadSheet';
import { getSheetComponentOptions } from '../../../utils';
import { Header } from '../../header';
import { S2Pagination } from '../../pagination';
import type {
  SheetComponentOptions,
  SheetComponentsProps,
} from '../../sheets/interface';

import './index.less';

export const BaseSheet: React.FC<SheetComponentsProps> = React.memo((props) => {
  const { dataCfg, options, header } = props;
  const { s2Ref, loading, containerRef, pagination, wrapperRef } =
    useSpreadSheet(props);

  React.useEffect(() => {
    injectThemeVars(props.themeCfg?.name);
  }, [props.themeCfg?.name]);

  return (
    <Spin spinning={loading} wrapperClassName={`${S2_PREFIX_CLS}-spin`}>
      <div ref={wrapperRef} className={`${S2_PREFIX_CLS}-wrapper`}>
        {header && (
          <Header
            {...header}
            sheet={s2Ref.current!}
            style={{
              width: options?.width,
            }}
            dataCfg={getSafetyDataConfig(dataCfg)}
            options={getSheetComponentOptions(options!)}
          />
        )}
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
BaseSheet.defaultProps = {
  options: {} as SheetComponentOptions,
  adaptive: false,
  showPagination: false,
};

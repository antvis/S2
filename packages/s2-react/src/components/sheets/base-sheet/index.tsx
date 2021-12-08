import { Spin } from 'antd';
import React from 'react';
import { S2_PREFIX_CLS, S2Options, getSafetyDataConfig } from '@antv/s2';
import { Header } from '@/components/header';
import { BaseSheetProps } from '@/components/sheets/interface';
import { S2Pagination } from '@/components/pagination';
import { getSheetComponentOptions } from '@/utils';

import './index.less';

export const BaseSheet: React.FC<BaseSheetProps> = React.memo((props) => {
  const {
    dataCfg,
    options,
    header,
    showPagination,
    loading,
    s2Ref,
    containerRef,
    pagination,
  } = props;

  return (
    <React.StrictMode>
      <Spin spinning={loading}>
        {header && (
          <Header
            {...header}
            sheet={s2Ref.current}
            width={options.width}
            dataCfg={getSafetyDataConfig(dataCfg)}
            options={getSheetComponentOptions(options)}
          />
        )}
        <div ref={containerRef} className={`${S2_PREFIX_CLS}-container`} />
        {showPagination && (
          <S2Pagination {...pagination} pagination={options.pagination} />
        )}
      </Spin>
    </React.StrictMode>
  );
});

BaseSheet.defaultProps = {
  options: {} as S2Options,
  adaptive: false,
  showPagination: true,
};

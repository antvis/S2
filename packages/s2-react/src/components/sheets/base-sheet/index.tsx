import {
  getSafetyDataConfig,
  type S2Options,
  S2_PREFIX_CLS,
  SpreadSheet,
} from '@antv/s2';
import { Spin } from 'antd';
import { get } from 'lodash';
import React from 'react';
import { useSpreadSheet } from '../../../hooks/useSpreadSheet';
import { getSheetComponentOptions } from '../../../utils';
import { Header } from '../../header';
import { S2Pagination } from '../../pagination';
import type { SheetComponentsProps } from '../../sheets/interface';

import './index.less';

export const BaseSheet = React.forwardRef(
  (props: SheetComponentsProps, ref: React.MutableRefObject<SpreadSheet>) => {
    const { dataCfg, options, header, showPagination } = props;
    const { s2Ref, loading, containerRef, pagination, wrapperRef } =
      useSpreadSheet(props);

    // 同步实例
    React.useEffect(() => {
      if (ref) {
        ref.current = s2Ref.current;
      }
    }, [ref, s2Ref]);

    return (
      <React.StrictMode>
        <Spin spinning={loading} wrapperClassName={`${S2_PREFIX_CLS}-spin`}>
          <div ref={wrapperRef} className={`${S2_PREFIX_CLS}-wrapper`}>
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
              <S2Pagination
                {...pagination}
                pagination={options.pagination}
                onChange={get(showPagination, 'onChange')}
                onShowSizeChange={get(showPagination, 'onShowSizeChange')}
              />
            )}
          </div>
        </Spin>
      </React.StrictMode>
    );
  },
);

BaseSheet.displayName = 'BaseSheet';
BaseSheet.defaultProps = {
  options: {} as S2Options,
  adaptive: false,
  showPagination: false,
};

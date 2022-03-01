import { Spin } from 'antd';
import React from 'react';
import {
  S2_PREFIX_CLS,
  S2Options,
  getSafetyDataConfig,
  SpreadSheet,
} from '@antv/s2';
import { get } from 'lodash';
import { Header } from '@/components/header';
import { SheetComponentsProps } from '@/components/sheets/interface';
import { S2Pagination } from '@/components/pagination';
import { getSheetComponentOptions } from '@/utils';
import { useSpreadSheet } from '@/hooks/useSpreadSheet';

import './index.less';

export const BaseSheet = React.forwardRef(
  (props: SheetComponentsProps, ref: React.MutableRefObject<SpreadSheet>) => {
    const { dataCfg, options, header, showPagination, sheetType } = props;
    const { s2Ref, loading, containerRef, pagination, wrapRef } =
      useSpreadSheet(props, {
        sheetType,
      });

    // 同步实例
    React.useEffect(() => {
      if (ref) {
        ref.current = s2Ref.current;
      }
    }, [ref, s2Ref]);

    // 默认隐藏列
    React.useEffect(() => {
      s2Ref.current?.interaction.hideColumns(
        options.interaction?.hiddenColumnFields,
      );
    }, [options.interaction?.hiddenColumnFields, s2Ref]);

    return (
      <React.StrictMode>
        <Spin spinning={loading} wrapperClassName={`${S2_PREFIX_CLS}-spin`}>
          <div ref={wrapRef} className={`${S2_PREFIX_CLS}-wrapper`}>
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

BaseSheet.defaultProps = {
  options: {} as S2Options,
  adaptive: false,
  showPagination: false,
};

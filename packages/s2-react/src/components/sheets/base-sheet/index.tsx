import { getSafetyDataConfig, S2_PREFIX_CLS, SpreadSheet } from '@antv/s2';
import { Spin } from 'antd';
import React from 'react';
import { useSpreadSheet } from '../../../hooks/useSpreadSheet';
import { SpreadSheetContext } from '../../../utils/SpreadSheetContext';
import { getSheetComponentOptions } from '../../../utils';
import { Header } from '../../header';
import { S2Pagination } from '../../pagination';
import type {
  SheetComponentOptions,
  SheetComponentsProps,
} from '../../sheets/interface';

import './index.less';

export const BaseSheet = React.forwardRef<
  SpreadSheet,
  React.PropsWithChildren<SheetComponentsProps>
>((props, ref) => {
  const { dataCfg, options, header } = props;
  const { s2Ref, loading, containerRef, pagination, wrapperRef } =
    useSpreadSheet(props);

  const [contextVal, setContextVal] = React.useState<SpreadSheet>(
    s2Ref.current,
  );

  // 同步实例
  React.useEffect(() => {
    if (ref) {
      (ref as React.MutableRefObject<SpreadSheet>).current = s2Ref.current;
    }
  }, [ref, s2Ref]);

  React.useEffect(() => setContextVal(s2Ref.current), [setContextVal, s2Ref]);

  return (
    <React.StrictMode>
      <SpreadSheetContext.Provider value={contextVal}>
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
      </SpreadSheetContext.Provider>
    </React.StrictMode>
  );
});

BaseSheet.displayName = 'BaseSheet';
BaseSheet.defaultProps = {
  options: {} as SheetComponentOptions,
  adaptive: false,
  showPagination: false,
};

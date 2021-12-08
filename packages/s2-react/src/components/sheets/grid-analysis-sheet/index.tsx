import React from 'react';
import { BaseSheetComponentProps } from '../interface';
import { BaseSheet } from '../base-sheet';
import { GridAnalysisDataCell } from './grid-analysis-data-cell';
import { GridAnalysisTheme } from './grid-analysis-theme';
import { getSheetComponentOptions } from '@/utils';
import { useSpreadSheet } from '@/hooks';

export const GridAnalysisSheet: React.FC<BaseSheetComponentProps> = (props) => {
  const { options } = props;

  const s2Options = React.useMemo(() => {
    return getSheetComponentOptions(options, {
      dataCell: GridAnalysisDataCell,
      style: {
        colCfg: {
          hideMeasureColumn: true,
        },
      },
    });
  }, [options]);

  const { s2Ref, loading, containerRef, pagination } = useSpreadSheet(props, {
    sheetType: 'gridAnalysis',
    s2Options,
  });

  return (
    <BaseSheet
      {...props}
      themeCfg={{
        theme: GridAnalysisTheme,
      }}
      loading={loading}
      containerRef={containerRef}
      s2Ref={s2Ref}
      pagination={pagination}
      showPagination={false}
      sheetType="pivot"
    />
  );
};

GridAnalysisSheet.displayName = 'GridAnalysisSheet';

import React, { memo, useEffect } from 'react';
import { BaseSheet } from '../base-sheet';
import { BaseSheetComponentProps } from '@/components/sheets/interface';
import { useSpreadSheet } from '@/hooks';

export const TableSheet: React.FC<BaseSheetComponentProps> = memo((props) => {
  const { options } = props;
  const { s2Ref, loading, containerRef, pagination } = useSpreadSheet(props, {
    sheetType: 'table',
  });

  useEffect(() => {
    s2Ref.current?.setOptions({ interaction: { hiddenColumnFields: [] } });
    s2Ref.current?.interaction.hideColumns(
      options.interaction?.hiddenColumnFields,
    );
  }, [options.interaction?.hiddenColumnFields, s2Ref]);

  return (
    <BaseSheet
      {...props}
      loading={loading}
      containerRef={containerRef}
      s2Ref={s2Ref}
      pagination={pagination}
      sheetType="table"
    />
  );
});

TableSheet.displayName = 'TableSheet';

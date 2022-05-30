import React from 'react';
import { SpreadSheet } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { SheetComponentsProps } from '@/components/sheets/interface';

export const TableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options } = props;
    const s2Ref = React.useRef<SpreadSheet>();

    React.useEffect(() => {
      s2Ref.current?.interaction.hideColumns(
        options.interaction?.hiddenColumnFields,
      );
    }, [options.interaction?.hiddenColumnFields, s2Ref]);

    return <BaseSheet {...props} ref={s2Ref} />;
  },
);

TableSheet.displayName = 'TableSheet';

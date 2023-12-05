import React, { useCallback } from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
import { DragCopyPoint } from './drag-copy';
import { EditCell } from './edit-cell';

export const EditableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const onChange = useCallback(() => {}, []);
    return (
      <BaseSheet {...props} sheetType={'table'}>
        <EditCell
          onChange={onChange}
          onDataCellEditEnd={props.onDataCellEditEnd}
        />
        <DragCopyPoint />
      </BaseSheet>
    );
  },
);

EditableSheet.displayName = 'EditableSheet';

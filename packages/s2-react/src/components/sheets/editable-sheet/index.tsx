import React, { useCallback } from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
import { DragCopyPoint } from './drag-copy';
<<<<<<< HEAD
import { EditCell } from './custom-cell';
=======
import { EditCell } from './edit-cell';
>>>>>>> origin/master

export const EditableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const onChange = useCallback(() => {}, []);
<<<<<<< HEAD

    return (
      <BaseSheet {...props} sheetType={'table'}>
        <EditCell onChange={onChange} />
=======
    return (
      <BaseSheet {...props} sheetType={'table'}>
        <EditCell
          onChange={onChange}
          onDataCellEditEnd={props.onDataCellEditEnd}
        />
>>>>>>> origin/master
        <DragCopyPoint />
      </BaseSheet>
    );
  },
);

EditableSheet.displayName = 'EditableSheet';

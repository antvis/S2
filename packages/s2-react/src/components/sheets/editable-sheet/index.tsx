import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentProps } from '../interface';
import { EditCell } from './custom-cell';
import { DragCopyPoint } from './drag-copy';

export const EditableSheet: React.FC<SheetComponentProps> = React.memo(
  (props) => {
    return (
      <BaseSheet {...props} sheetType={'table'}>
        <EditCell
          onDataCellEditStart={props.onDataCellEditStart}
          onDataCellEditEnd={props.onDataCellEditEnd}
        />
        <DragCopyPoint />
      </BaseSheet>
    );
  },
);

EditableSheet.displayName = 'EditableSheet';

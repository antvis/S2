import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
import { DragCopyPoint } from './drag-copy';
import { EditCell } from './custom-cell';

export const EditableSheet: React.FC<SheetComponentsProps> = React.memo(
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

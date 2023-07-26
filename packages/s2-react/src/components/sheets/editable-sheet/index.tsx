import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
import { EditCell } from './edit-cell';
import { DragCopyPoint } from './drag-copy';
import { PastePlugin } from './paste';

export const EditableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    return (
      <BaseSheet {...props} sheetType={'table'}>
        <EditCell
          onChange={() => {}}
          onDataCellEditEnd={props.onDataCellEditEnd}
        />
        <DragCopyPoint />
        <PastePlugin />
      </BaseSheet>
    );
  },
);

EditableSheet.displayName = 'EditableSheet';

import React from 'react';
import { EditCell } from './edit-cell';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';

export const EditableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    return (
      <BaseSheet {...props} sheetType={'table'}>
        <EditCell onChange={() => {}} />
      </BaseSheet>
    );
  },
);

EditableSheet.displayName = 'EditableSheet';

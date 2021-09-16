import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FieldType } from '../constant';

import './index.less';
import { isMeasureType } from '../util';
import { SingleItem } from './single-item';

export interface Item {
  id: string;
  displayName: string;
  checked?: boolean;
  derivedValues?: Item[];
}

export interface DimensionItemProps extends Item {
  fieldType: FieldType;
  index: number;
  expandDerivedValues: boolean;
  onVisibleItemChange?: (
    checked: boolean,
    fieldType: FieldType,
    id: string,
    derivedId?: string,
  ) => void;
}

export const DimensionItem: FC<DimensionItemProps> = ({
  fieldType,
  id,
  displayName,
  derivedValues,
  checked,
  index,
  expandDerivedValues,
  onVisibleItemChange,
}) => {
  const isMeasure = isMeasureType(fieldType);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={isMeasure ? 'measure-list' : 'dimension-list'}
        >
          <SingleItem
            fieldType={fieldType}
            id={id}
            displayName={displayName}
            checked={checked}
            onVisibleItemChange={onVisibleItemChange}
            className={isMeasure ? 'measure-item' : 'dimension-item'}
          />

          {isMeasure && !isEmpty(derivedValues) && expandDerivedValues && (
            <div className="derived-measures">
              {derivedValues.map((item) => (
                <SingleItem
                  key={item.id}
                  fieldType={fieldType}
                  id={id}
                  displayName={item.displayName}
                  derivedId={item.id}
                  checked={item.checked}
                  onVisibleItemChange={onVisibleItemChange}
                  className="measure-item"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

DimensionItem.defaultProps = {
  checked: false,
  derivedValues: [],
  expandDerivedValues: false,
};

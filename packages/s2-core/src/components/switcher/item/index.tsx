import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import cx from 'classnames';
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
  expandDerivedValues?: boolean;
  draggingItemId?: string;

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
  draggingItemId,
  onVisibleItemChange,
}) => {
  const isMeasure = isMeasureType(fieldType);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cx(isMeasure ? 'measure-list' : 'dimension-list', {
            'list-dragging': snapshot.isDragging,
          })}
        >
          <SingleItem
            fieldType={fieldType}
            id={id}
            displayName={displayName}
            checked={checked}
            onVisibleItemChange={onVisibleItemChange}
            className={cx(isMeasure ? 'measure-item' : 'dimension-item', {
              'measure-collapse': !expandDerivedValues,
            })}
          />

          {isMeasure && !isEmpty(derivedValues) && draggingItemId !== id && (
            <div
              className={cx('derived-measures', {
                'measures-hidden': !expandDerivedValues,
              })}
            >
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

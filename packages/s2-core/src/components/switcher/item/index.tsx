import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FieldType } from '../constant';
import { Item } from '../interface';
import { isMeasureType } from '../util';
import './index.less';
import { SingleItem } from './single-item';

export interface DimensionCommonProps {
  fieldType: FieldType;
  expandDerivedValues?: boolean;
  draggingItemId?: string;

  onVisibleItemChange?: (
    checked: boolean,
    fieldType: FieldType,
    id: string,
    derivedId?: string,
  ) => void;
}

export type DimensionItemProps = Item &
  DimensionCommonProps & {
    index: number;
  };

export const DimensionItem: FC<DimensionItemProps> = ({
  fieldType,
  id,
  displayName,
  checked,
  derivedValues,
  expandDerivedValues,
  index,
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
